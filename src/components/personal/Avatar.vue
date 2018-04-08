<template>
    <div class="row no-gutters wrapper">
        <Navigation></Navigation>
        <div class="col-md-10 main-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-8 offset-md-2">

                        <div class="page-header">
                            <h1>Avatar</h1>
                        </div>
                        <form v-on:submit.prevent="update()">
                            <div class="media">
                                <img class="mr-3" :src="'/uploads/profile/' + avatar" width="64" alt="Avatar" />
                                <div class="media-body">
                                    <div class="alert alert-success text-center" v-show="alerts.success"><i class="far fa-thumbs-up"></i></div>
                                    <div class="alert alert-danger text-center" v-show="alerts.error">Error updating.</div>
                                    <div class="form-group">
                                        <input type="file" class="form-control" id="attachments" @change="uploadFieldChange">
                                    </div>
                                    <div class="form-group">
                                        <button type="submit" class="btn btn-primary">Update</button>
                                    </div>
                                </div>
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
  name: 'Avatar',
  components: {
      Navigation
  },
  created() {
      this.getDetails()
  },
  data () {
    return {
        avatar: null,
        alerts: {
            success: false,
            error: false
        },
        images: [],
        attachments: [],
        data: new FormData()
    }
  },
  methods: {
      getDetails() {
          this.axios.post(this.api + '/auth/details').then((res) => {
              this.avatar = res.data[0].avatar
          })
          .catch((err) => {
              console.log(err);
          });
      },
      getAttachmentSize() {
          this.upload_size = 0;
          this.attachments.map((item) => { this.upload_size += parseInt(item.size) })
          this.upload_size = Number((this.upload_size).toFixed(1))
          this.$forceUpdate()
      },
      uploadFieldChange(e) {
          var files = e.target.files || e.dataTransfer.files;
          if (!files.length){
              return;
          }

          for (var i = files.length - 1; i >= 0; i--){
              this.attachments.push(files[i])
          }
      },
      prepareFields() {
          if (this.attachments.length > 0) {
              for (var i = 0; i < this.attachments.length; i++) {
                  let attachment = this.attachments[i];
                  this.data.append('file', attachment);
                  //this.data = attachment;
              }
          }
      },
      resetData() {
          this.data = new FormData()
          this.attachments = []
          document.getElementById("attachments").value = [];
      },
      update() {
        this.alerts.success = false
        this.alerts.error = false
        this.prepareFields()
          var config = {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'session_id': this.$store.state.currentUser.session_id,
                  'session_token': this.$store.state.currentUser.session_token
              }
          }

          this.axios.post(this.api + '/auth/update/avatar', this.data, config).then((res) => {
              // console.log(res)
              if (res.data.error == 0){
                  this.avatar = res.data.image;
                  this.alerts.success = true
              }
              else
              {
                  this.alerts.error = true
              }
              this.resetData()
          })
          .catch((err) => {
              console.log(err)
          })
      }
  }
}
</script>
