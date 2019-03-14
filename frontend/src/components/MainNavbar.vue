<template>
  <nav class="navbar navbar-expand-md navbar-light navbar-laravel fixed-top">
    <div class="container-fluid">
      <router-link :to="{path: '/'}" class="navbar-brand">
        Textiles Hernandez
        <img src="../assets/logo-144.png" class="logo" alt="Logo">
      </router-link>
      <router-link :to="{path: '/notificaciones'}" class="btn text-dark d-block d-md-none" v-if="getNotifications().length">
        <i class="fa fa-bell fa-lg text-success"></i>
        <span class="badge badge-pill badge-danger">{{getNotifications().length}}</span>
      </router-link>
      <button class="navbar-toggler" type="button" @click="toggleSidebar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="navbar-nav mr-auto">
          <div class="btn-group" role="group">
            <button class="btn btn-secondary" @click="toggleSidebar">
              <i class="fas fa-bars"></i>
            </button>
            <button class="btn btn-dark" @click="() => $router.go(-1)">
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="dropdown" v-if="offices.length > 1">
              <a
                class="btn dropdown-toggle btn-light"
                href="#"
                role="button"
                id="navbarOffices"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >{{selectedOffice.name || "Sucursales"}}</a>
              <div class="dropdown-menu" aria-labelledby="navbarOffices">
                <button
                  class="dropdown-item pointer"
                  :class="{'active':selectedOffice.id == data.id}"
                  @click="selectOffice(data)"
                  v-for="data in offices"
                  :key="'office-list-'+data.id"
                >{{data.name}}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="navbar-nav ml-auto">
          <div class="dropdown" v-if="getNotifications().length">
            <a
              class="btn text-dark"
              href="#"
              role="button"
              id="notifications"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="fa fa-bell fa-lg text-success"></i>
              <span class="badge badge-pill badge-danger">{{getNotifications().length}}</span>
            </a>
            <Notifications
              :items="getNotifications()"
              :aria-labelledby="'notifications'"
              :showNotification="showNotification"
              :readNotification="readNotification"
            />
          </div>

          <div class="dropdown">
            <a
              class="btn dropdown-toggle text-dark"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >Hola, {{user.name}}</a>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <router-link :to="{ path: '/ajustes' }" class="dropdown-item">Ajustes</router-link>
              <button class="dropdown-item pointer" @click="handleLogout">Cerrar Sesion</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Notifications from "./Notifications";
import { getMappedKeyEntity } from "../utils/entities";
import { fetch } from "../utils";

export default {
  components: { Notifications },
  props: {
    user: { required: true },
    handleLogout: { required: true }
  },
  methods: {
    async showNotification(item) {
      const entity = getMappedKeyEntity(item.entity.name);
      let [err, res] = await fetch({
        url: `/api/notifications/${item.id}`,
        data: { status: 2 },
        method: "put"
      });
      if (err) {
        console.log(err);
      }
      this.$router.push(`/${entity}/lista/${item.entity_value_id}`);
    },
    async readNotification(item) {
      let [err, res] = await fetch({
        url: `/api/notifications/${item.id}`,
        data: { status: 2 },
        method: "put"
      });
      if (err) {
        console.log(err);
      }
    },
    ...mapActions("app", ["toggleSidebar", "selectOffice"])
  },
  computed: {
    ...mapState("app", ["selectedOffice"]),
    ...mapState("entities", ["offices"]),
    ...mapGetters("entities", ["getNotifications"])
  },
  watch: {
    offices(value, oldValue) {
      if (value.length && !oldValue.length) {
        this.selectOffice(this.offices[0]);
      }
    }
  }
};
</script>


<style scoped>
.logo {
  max-width: 35px;
}
</style>
