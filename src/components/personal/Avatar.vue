<template>
  <div class="wrapper">
    <Navigation/>
    <div class="main-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-8 offset-md-2">

            <div class="page-header">
              <h1>Avatar</h1>
            </div>
            <form @submit.prevent="update()">
              <div class="media">
                <img 
                  :src="'/uploads/profile/' + avatar" 
                  class="mr-3" 
                  width="64" 
                  alt="Avatar" >
                <div class="media-body">
                  <div 
                    v-show="alerts.success" 
                    class="alert alert-success text-center"><i class="far fa-thumbs-up"/></div>
                  <div 
                    v-show="alerts.error" 
                    class="alert alert-danger text-center">Error updating.</div>
                  <div class="form-group">
                    <FilePond
                      ref="file"
                      name="file"
                      label-idle="Browse or drop file here..."
                      allow-multiple="false"
                      instant-upload="false"
                      accepted-file-types="image/jpeg, image/png, image/gif"
                      allow-image-preview="true"
                      @addfile="uploadFieldChange"
                      @removefile="removeUploadField" />
                  </div>
                  <div class="form-group">
                    <button 
                      type="submit" 
                      class="btn btn-primary">Update</button>
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
import FilePond, { registerPlugin } from "vue-filepond";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilepondPluginImagePreview from "filepond-plugin-image-preview";
import Navigation from "../Navigation.vue";

registerPlugin(FilePondPluginFileValidateType);
registerPlugin(FilepondPluginImagePreview);

export default {
  name: "Avatar",
  components: {
    Navigation,
    FilePond
  },
  data() {
    return {
      avatar: null,
      alerts: {
        success: false,
        error: false
      },
      attachments: []
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
          this.avatar = res.data[0].avatar;
        })
        .catch(err => {
          console.log(err);
        });
    },
    uploadFieldChange() {
      const files = this.$refs.file.getFiles();
      if (!files.length) {
        return;
      }

      for (let i = files.length - 1; i >= 0; i--) {
        this.attachments.push(files[i]);
      }
    },
    removeUploadField() {
      this.attachments = [];
    },
    resetData() {
      this.attachments = [];
      // document.getElementById("attachments").value = [];
    },
    update() {
      this.alerts.success = false;
      this.alerts.error = false;

      // console.log(this.attachments[0].file)
      const data = new FormData();
      data.append("file", this.attachments[0].file);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          session_id: this.$store.state.currentUser.session_id,
          session_token: this.$store.state.currentUser.session_token
        }
      };

      // console.log(data)

      this.axios
        .post(`${this.api}/auth/update/avatar`, data, config)
        .then(res => {
          // console.log(res)
          if (res.data.error == 0) {
            this.avatar = res.data.image;
            this.alerts.success = true;
          } else {
            this.alerts.error = true;
          }
          this.resetData();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
