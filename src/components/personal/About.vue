<template>
  <div class="wrapper">
    <Navigation/>
    <div class="main-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-8 offset-md-2">

            <div class="page-header">
              <h1>About Me</h1>
            </div>
            <form @submit.prevent="update()">
              <div 
                v-show="alerts.success" 
                class="alert alert-success text-center"><i class="far fa-thumbs-up"/></div>
              <div 
                v-show="alerts.error" 
                class="alert alert-danger text-center">Error updating.</div>
              <div class="form-group">
                <textarea 
                  v-model="about_me" 
                  class="form-control" 
                  placeholder="Describe yourself."/>
              </div>
              <div class="form-group">
                <button 
                  type="submit" 
                  class="btn btn-primary">Update</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from "../Navigation.vue";

export default {
  name: "About",
  components: {
    Navigation
  },
  data() {
    return {
      about_me: null,
      alerts: {
        success: false,
        error: false
      }
    };
  },
  created() {
    this.getDetails();
  },
  methods: {
    getDetails() {
      this.axios
        .post(`${this.api}/auth/details`)
        .then(res => {
          this.about_me = res.data[0].about;
        })
        .catch(err => {
          console.log(err);
        });
    },
    update() {
      this.alerts.success = false;
      this.alerts.error = false;
      this.axios
        .post(`${this.api}/auth/update/about`, { about: this.about_me })
        .then(res => {
          if (res.data.error == 0) {
            this.alerts.success = true;
          } else {
            this.alers.error = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
