<template>
    <div class="row no-gutters wrapper">
        <Navigation></Navigation>
        <div class="col-md-10 main-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-8 offset-md-2">

                        <div class="page-header">
                            <h1>About Me</h1>
                        </div>
                        <form v-on:submit.prevent="update()">
                            <div class="alert alert-success text-center" v-show="alerts.success"><i class="far fa-thumbs-up"></i></div>
                            <div class="alert alert-danger text-center" v-show="alerts.error">Error updating.</div>
                            <div class="form-group">
                                <textarea class="form-control" placeholder="Describe yourself." v-model="about_me"></textarea>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary">Update</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navigation from '../Navigation.vue'

export default {
  name: 'About',
  components: {
      Navigation
  },
  created() {
      this.getDetails()
  },
  data () {
    return {
        about_me: null,
        alerts: {
            success: false,
            error: false
        }
    }
  },
  methods: {
      getDetails() {
          this.axios.post(this.api + '/auth/details').then((res) => {
              this.about_me = res.data[0].about
          })
          .catch((err) => {
              console.log(err);
          });
      },
      update() {
        this.alerts.success = false
        this.alerts.error = false
        this.axios.post(this.api + '/auth/update/about', { about: this.about_me }).then((res) => {
            if (res.data.error == 0){
                this.alerts.success = true
            }
            else
            {
                this.alers.error = true
            }
        })
        .catch((err) => {
            console.log(err)
        })
      }
  }
}
</script>
