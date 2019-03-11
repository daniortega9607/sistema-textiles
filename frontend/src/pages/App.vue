<template>
  <div :class="{'show-sidebar':showSidebar, 'h-100':true}" v-if="authenticated">
    <MainNavbar :user="user" :handleLogout="handleLogout"/>
    <Sidebar :user="user" :handleLogout="handleLogout" :showSidebar="showSidebar" :menu="menu"/>
    <main id="content-wrapper" class="h-100">
      <div class="py-4">
        <router-view id="main-wrapper"/>
      </div>
    </main>
  </div>
</template>
<script>

import { mapMutations, mapActions, mapState } from 'vuex';
import MainNavbar from '../components/MainNavbar';
import Sidebar from '../components/Sidebar';

let notifications;
let retries = 3;
let incremental_retry = 5;

export default {
  components: {
    MainNavbar, Sidebar
  },
  data() {
    return {
      last_event_id: null
    }
  },
  async created() {
    if (!(await this.isAuthenticated())) {
      this.handleLogout();
    }
    else this.setupStream();
  },
  computed: {
    ...mapState("auth", ["authenticated", "user"]),
    ...mapState("app", ["showSidebar", "menu"])
  },
  methods: {
    redirectToLogin() {
      this.$router.replace("/login");
    },
    handleLogout() {
      this.logout({ callback: this.redirectToLogin });
    },
    setupStream() {
      notifications = new EventSource(`/api/notification_events/subscribe?${this.last_event_id ? 'last_event_id='+this.last_event_id : ''}`);
      notifications.addEventListener("open", event => {
        if(retries !== 3) {
          retries = 3;
          incremental_retry = 5;
          PNotify.success('Conexión reestablecida')
        }
      }, false);
      notifications.addEventListener("initValues", event => {
        const data = JSON.parse(event.data);
        this.last_event_id = event.lastEventId;
        this.setInitialValues(data);
      }, false);
      notifications.addEventListener("notification", event => {
        const data = JSON.parse(event.data);
        this.last_event_id = event.lastEventId;
        this.setNotifications(data);
      }, false);
      notifications.addEventListener("error", event => {
        event.target.close();
        if (retries > 0) {
          retries--;
          setTimeout(() => {
            incremental_retry = incremental_retry * 2;
            this.setupStream();
          }, 1000 * incremental_retry);
          PNotify.error({
            title: "Error de Red",
            text: `Hay un error con su conexion, intentando restablecer en ${incremental_retry} segundos`
          });
        } else {
          PNotify.error({
            title: "Error de Red",
            text: "No se ha podido reestablecer la conexion. Verifique su conexion a internet e intente de nuevo",
            hide: false,
            modules: {
              Confirm: {
                confirm: true,
                buttons: [
                  {
                    text: "Reintentar",
                    click: (alert) => {
                      this.setupStream();
                      alert.update({
                        hide: true
                      })
                    }
                  }
                ]
              },
              Buttons: { closer: false, sticker: false, }
            }
          });
        }
      }, false);
    },
    closeStream() {
      notifications.close();
    },
    ...mapMutations('entities', ['setInitialValues']),
    ...mapActions('entities', ['setNotifications']),
    ...mapActions("auth", ["isAuthenticated", "logout"])
},
  beforeDestroy() {
    if (notifications) {
      notifications.close();
      notifications = null;
    }
  }
};
</script>

<style scoped>
#content-wrapper {
  margin-left: 0px;
  overflow: auto;
  transition: all 0.5s;
}

#main-wrapper {
  padding-top: 50px;
}

.show-sidebar #content-wrapper {
  margin-left: 220px;
}

@media (max-width: 767px) {
  .show-sidebar #content-wrapper {
    margin-left: 0px;
  }
}
</style>
