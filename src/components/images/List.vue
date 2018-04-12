<template>
    <div class="row no-gutters wrapper">
        <Navigation></Navigation>
        <div class="col-md-10 main-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-9">

                        <div class="page-header">
                            <h1>Images</h1>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <th width="20%">Preview</th>
                                    <th>Name</th>
                                    <th>URL</th>
                                    <th>By</th>
                                    <th>Options</th>
                                </thead>
                                <tbody>
                                    <tr v-for="(image, index) in images" :key="image._id">
                                        <td><img :src="'/uploads/images/' + image.file_name" class="img-fluid" :alt="image.file_name" /></td>
                                        <td>{{ image.title }}</td>
                                        <td>/uploads/images/{{ image.file_name }}</td>
                                        <td>{{ image.created_by.username }}</td>
                                        <td><button type="button" class="btn btn-danger btn-sm" v-on:click.prevent="delete_image(index)"><i class="far fa-trash-alt"></i></button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Upload</h4>
                                <div class="form-group">
                                    <div class="alert alert-success text-center" v-show="alerts.new.success"><i class="far fa-thumbs-up"></i></div>
                                    <div class="alert alert-danger text-center" v-show="alerts.new.error">Error uploading image.</div>
                                    <FilePond
                                        name="file"
                                        ref="file"
                                        labelIdle="Browse or drop file here..."
                                        allowMultiple="false"
                                        instantUpload="false"
                                        acceptedFileTypes="image/jpeg, image/png, image/gif"
                                        allowImagePreview="true"
                                        @addfile="uploadFieldChange"
                                        @removefile="removeUploadField" />
                                </div>
                                <div class="form-group">
                                    <button type="submit" class="btn btn-primary" v-on:click.prevent="upload()">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navigation from '../Navigation.vue'
import FilePond, { registerPlugin } from 'vue-filepond'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilepondPluginImagePreview from 'filepond-plugin-image-preview'
registerPlugin(FilePondPluginFileValidateType)
registerPlugin(FilepondPluginImagePreview)

export default {
  name: 'ImagesList',
  components: {
      Navigation,
      FilePond
  },
  created() {
      this.getImages()
  },
  data () {
    return {
        images: [],
        alerts: {
            new: {
                success: false,
                error: false,
            }
        },
        attachments: [],
    }
  },
  methods: {
      getImages() {
          this.axios.get(this.api + '/images').then((res) => {
              this.images = res.data
          })
          .catch((err) => {
              console.log(err);
          });
      },
      delete_image(index) {
          this.axios.post(this.api + '/images/delete/' + this.images[index]._id).then((res) => {
              this.images.splice(index, 1)
          })
          .catch((err) => {
              console.log(err)
          })
      },
      uploadFieldChange() {
          var files = this.$refs.file.getFiles();
          if (!files.length){
              return;
          }

          for (var i = files.length - 1; i >= 0; i--){
              this.attachments.push(files[i])
          }
      },
      removeUploadField() {
          this.attachments = []
      },
      upload() {
          
          var data = new FormData()
          data.append('file', this.attachments[0].file)

          var config = {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'session_id': this.$store.state.currentUser.session_id,
                  'session_token': this.$store.state.currentUser.session_token
              }
          }

          this.axios.post(this.api + '/images', data, config).then((res) => {
              // console.log(res)
              this.alerts.new.success = false
              this.alerts.new.error = false
              if (res.data.error == 0){
                  this.images.push(res.data.image)
                  this.alerts.new.success = true
              }
              else
              {
                  this.alerts.new.error = true
              }
              this.resetData()
          })
          .catch((err) => {
              console.log(err)
          })
      },
      resetData() {
          this.attachments = []
      }
  }
}
</script>
