<template>
  <div class="wrapper">
    <Navigation/>
    <div class="main-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-8 offset-md-2">

            <div class="page-header">
              <h1>Password</h1>
            </div>
            <form @submit.prevent="update()">
              <div 
                v-show="alerts.success" 
                class="alert alert-success text-center"><i class="far fa-thumbs-up"/></div>
              <div 
                v-show="alerts.error" 
                class="alert alert-danger text-center">Error updating.</div>
              <div class="form-group">
                <label for="old_password">Current Password</label>
                <input 
                  id="old_password" 
                  v-model="old_password" 
                  type="password" 
                  class="form-control" >
              </div>

              <div class="form-group">
                <label for="new_password">New Password</label>
                <input 
                  id="new_password" 
                  v-model="new_password" 
                  type="password" 
                  class="form-control" >
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
  name: "Avatar",
  components: {
    Navigation
  },
  data() {
    return {
      old_password: null,
      new_password: null,
      alerts: {
        success: false,
        error: false
      },
      attachments: []
    };
  },
  methods: {
    update() {
      this.alerts.success = false;
      this.alerts.error = false;

      this.axios
        .post(`${this.api}/auth/update/password`, {
          old: this.old_password,
          new: this.new_password
        })
        .then(res => {
          if (res.data.error == 0) {
            this.alerts.success = true;
          } else {
            this.alerts.error = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
