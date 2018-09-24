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
            href="https://github.com/jtpox/arabesque"
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
              class="form-control" 
              placeholder="Email" >
          </div>

          <div class="form-group">
            <input 
              v-model="password" 
              type="password" 
              name="password" 
              class="form-control" 
              placeholder="Password" >
          </div>

          <div class="form-group">
            <button 
              type="submit" 
              name="login" 
              class="btn btn-primary float-right">Log In</button>
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
.login h1 {
  /* Font */
  color: #f5f7fa;
}

.login h1 > small {
  /* Font */
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
}

.intro {
  /* Font */
  color: #f5f7fa;
}

.login a,
.login a:link,
.login a:visited {
  display: inline-block;
  /* Font */
  color: #f5f7fa;
  text-decoration: none;
}

.login a::after {
  background: #f5f7fa;
  width: 0;
  height: 1px;
  content: "";
  display: block;
  /* Transition */
  transition: width 0.3s;
}

.login a:hover::after {
  width: 100%;
}

.login-container {
  background-image: url("../../assets/luca-bravo-414346-unsplash.jpg");
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: 100vh;
  /* Flex */
  display: flex;
  align-items: center;
  justify-content: center;
  /* Font */
  text-align: center;
}

.card-login {
  background: inherit;
  height: auto;
  width: 300px;
  position: relative;
  overflow: hidden;
  /* Margin & Padding */
  padding: 20px;
  /* Border */
  border: none;
  /* Border Radius */
  border-radius: 6px;
}

.card-login:after {
  content: "";
  height: inherit;
  width: 350px;
  background: inherit;
  position: absolute;
  left: -25px;
  right: 0;
  top: -25px;
  bottom: 0;
  box-shadow: inset 0 0 0 200px rgba(255, 255, 255, 0.05);
  filter: blur(10px);
}

.login {
  position: relative;
  z-index: 5;
}
</style>
