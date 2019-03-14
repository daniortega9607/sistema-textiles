<template>
  <div class="h-100 bg-login">
    <div class="container h-100">
      <div class="row h-100 justify-content-center align-items-center">
        <div class="col-md-8 col-lg-6">
          <div class="card card-default shadow">
            <div class="card-header text-center">
              <h4>
                Textiles Hernández
                <img src="../assets/logo-144.png" class="logo" alt="Logo">
              </h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="onSubmitHandler">
                <div class="form-group row">
                  <label for="email" class="col-sm-4 col-form-label text-md-right">E-Mail</label>
                  <div class="col-md-6">
                    <input
                      id="email"
                      type="email"
                      class="form-control"
                      v-model="email"
                      required
                      autofocus
                    >
                  </div>
                </div>
                <div class="form-group row">
                  <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>
                  <div class="col-md-6">
                    <input
                      id="password"
                      type="password"
                      class="form-control"
                      v-model="password"
                      required
                    >
                  </div>
                </div>
                <div class="form-group row mb-0">
                  <div class="col-md-8 offset-md-4">
                    <button type="submit" class="btn btn-primary">Entrar</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { fetch } from "../utils";

export default {
  data() {
    return {
      email: null,
      password: null
    };
  },
  async created() {
    const authenticated = await this.isAuthenticated();
    if (authenticated) {
      this.redirectToHome();
    }
  },
  methods: {
    redirectToHome() {
      this.$router.push("/home");
    },
    async onSubmitHandler() {
      const email = this.email;
      const password = this.password;
      const [err, login] = await fetch({
        method: "post",
        url: "api/login",
        data: { email, password }
      });
      if (err) {
        PNotify.error(
          "El correo y la contraseña no coinciden con la base de datos"
        );
        console.log(err);
        return;
      }
      const user = login.user;
      const token = login.token;
      if (token) {
        window.axios.defaults.headers.common['Content-Type'] = 'application/json'
        window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
        this.login({ user, token, callback: this.redirectToHome });
      }
    },
    ...mapActions("auth", ["isAuthenticated", "login"])
  }
};
</script>
<style scoped>
.card-default {
  background-color: rgba(255, 255, 255, 0.9);
}
.bg-login {
  background: url("../assets/background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
.logo {
  max-width: 60px;
}
</style>