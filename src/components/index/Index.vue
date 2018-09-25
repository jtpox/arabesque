<template>
  <div class="login-container">
    <div class="card-login">
      <div class="login">
        <small class="intro">
          <a
            href="https://github.com/jtpox/arabesque"
            target="_blank">arabesque</a> for
        </small>
        <h1 class="diavlo text-center">
          <a
            href="https://ribbon.jtpox.com"
            target="_blank">
            ribbon
          </a>
        </h1>
        <div 
          v-show="error" 
          class="alert alert-danger">
          Error authenticating.
        </div>
        <form @submit.prevent="login">
          <div class="form-group">
            <input 
              v-model="email" 
              type="email" 
              name="email" 
              class="form-input" 
              placeholder="Email" >
          </div>

          <div class="form-group">
            <input 
              v-model="password" 
              type="password" 
              name="password" 
              class="form-input" 
              placeholder="Password" >
          </div>

          <div class="form-group">
            <button 
              type="submit" 
              name="login" 
              class="btn btn-login float-right">Log In</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      email: null,
      password: null,
      error: null
    };
  },
  methods: {
    login() {
      const { email, password } = this;
      this.axios
        .post(`${this.api}/auth`, { email, password })
        .then(res => {
          if (res.data.error == 1) {
            this.error = true;

            // Commiting auth mutations.
            this.$store.commit("unAuth");
            this.$store.commit("unSetCurrentUser");
          } else {
            const session = {
              session_id: res.data.session_id,
              session_token: res.data.session_token,
              username: res.data.username,
              user_id: res.data.user_id
            };

            localStorage.setItem("user", JSON.stringify(session));

            this.$store.commit("setAuth");
            this.$store.commit("setCurrentUser", session);

            this.$router.push("/posts");
          }
        })
        .catch(err => {
          console.log(err);
          this.error = true;
        });
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/login";
</style>
