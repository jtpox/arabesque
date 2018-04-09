<template>
    <div class="container">
        <div class="row">
            <div class="col-md-4 offset-md-4">
                <h1 class="diavlo text-center">ribbon</h1>
                <div class="card">
                    <div class="card-body">
                        <div class="alert alert-danger" v-show="error">
                          Error authenticating.
                        </div>
                        <form @submit.prevent="login">
                            <div class="form-group">
                                <input type="email" v-model="email" name="email" class="form-control" placeholder="Email" />
                            </div>

                            <div class="form-group">
                                <input type="password" v-model="password" name="password" class="form-control" placeholder="Password" />
                            </div>

                            <button type="submit" name="login" class="btn btn-primary">Log In</button>
                        </form>
                    </div>
                </div>

                <footer class="footer text-center text-muted">
                  <small><a href="https://github.com/jtpox/arabesque" target="_blank">arabesque</a> for <a href="https://github.com/jtpox/ribbon" target="_blank">ribbon</a></small>
                </footer>
            </div>

        </div>
    </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      email: null,
      password: null,
      error: null
    }
  },
  methods: {
    login() {
      const { email, password } = this
      this.axios.post(this.api + '/auth', { email: email, password: password }).then((res) => {
        if (res.data.error == 1)
        {
          this.error = true;

          //Commiting auth mutations.
          this.$store.commit('unAuth')
          this.$store.commit('unSetCurrentUser')
        }
        else
        {
          var session = {
            session_id: res.data.session_id,
            session_token: res.data.session_token,
            username: res.data.username,
            user_id: res.data.user_id
          };

          localStorage.setItem('user', JSON.stringify(session));

          this.$store.commit('setAuth');
          this.$store.commit('setCurrentUser', session);

          this.$router.push('/posts')
        }
      })
      .catch((err) => {
        console.log(err);
        this.error = true;
      })
    }
  }
}
</script>
