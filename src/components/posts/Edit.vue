<template>
    <div class="row no-gutters wrapper">
        <Navigation></Navigation>
        <div class="col-md-10 main-content">
            <div class="container-fluid">
                <div class="row">

                    <div class="col-md-10">
                        <div class="form-group">
                            <input type="text" class="form-control form-control-lg merriweather" v-model="title" placeholder="Title" />
                        </div>
                        <div class="form-group">
                            <markdown-editor v-model="content"></markdown-editor>
                        </div>
                    </div>

                    <div class="col-md-2">
                        <div class="alert alert-success text-center" v-show="success"><i class="far fa-thumbs-up"></i></div>
                        <div class="alert alert-danger text-center" v-show="error">Error updating.</div>

                        <div class="card">
                            <div class="card-body">
                                <p class="card-text">
                                    <button type="button" class="btn btn-success btn-lg btn-block" v-on:click="update()">Update</button>
                                </p>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Tag</h4>
                                <p class="card-text">
                                    <select v-model="selected_tag" class="form-control">
                                        <option v-for="tag in tags" :value="tag._id" :key="tag._id">{{ tag.title }}</option>
                                    </select>
                                </p>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Schedule</h4>
                                <p class="card-text">
                                    <input type="date" class="form-control" :value="schedule && schedule.toISOString().split('T')[0]" />
                                </p>
                            </div>
                        </div>

                        <div class="card">
                            <span v-if="selectedImage !== null">
                                <img class="card-img-top img-fluid" :src="'/uploads/images/' + selectedImage.file_name" alt="Selected Image">
                            </span>
                            <div class="card-body">
                                <h4 class="card-title">Image</h4>
                                <p class="card-text">
                                    <b-btn v-b-modal="'imagesWidget'" class="btn-block">Select Image</b-btn>
                                </p>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Options</h4>
                                <p class="card-text">
                                    <div class="form-group">
                                        <label>
                                            <input type="checkbox" v-model="hidden" /> Hidden Post
                                        </label>    
                                    </div>
                                    <div class="form-group">
                                        <button type="button" class="btn btn-danger btn-block" v-on:click="delete_post()">Delete Post</button>
                                    </div>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <ImagesWidget></ImagesWidget>
    </div>
</template>

<script>
import Navigation from '../Navigation.vue'
import ImagesWidget from '../widgets/Images.vue'
import markdownEditor from 'vue-simplemde/src/markdown-editor'

export default {
  name: 'EditPost',
  components: {
      Navigation,
      ImagesWidget,
      markdownEditor
  },
  created() {
      this.getTags()
      this.getPost()
  },
  data () {
    return {
        tags: [],
        title: null,
        content: null,
        selected_tag: null,
        schedule: new Date(),
        hidden: false,

        success: false,
        error: false,
    }
  },
  computed: {
      selectedImage() {
          return this.$store.state.selectedImage
      }
  },
  methods: {
      getTags() {
          this.axios.get(this.api + '/tags').then((res) => {
              this.tags = res.data
          })
          .catch((err) => {
              console.log(err);
          });
      },
      getPost() {
          this.axios.get(this.api + '/blog/' + this.$route.params.id).then((res) => {
              // console.log(res.data)
              this.title = res.data[0].title
              this.content = res.data[0].content
              this.selected_tag = res.data[0].tag._id
              this.schedule = new Date(res.data[0].created_at)
              this.hidden = res.data[0].hidden

              this.$store.commit('selectImage', ((res.data[0].image) ? res.data[0].image : null))
          })
          .catch((err) => {
              console.log(err);
          })
      },
      update() {
          this.error = false
          this.success = false

          let formData = {
              title: this.title,
              content: this.content,
              tag: this.selected_tag,
              image: (this.$store.state.selectedImage == null) ? null : this.$store.state.selectedImage._id,
              schedule: this.schedule,
              hidden: this.hidden
          }
          // console.log(formData);

          this.axios.put(this.api + '/blog/' + this.$route.params.id, formData).then((res) => {
              // console.log(res)
              if (res.data.error == 0) {
                  this.success = true
              }
              else
              {
                  this.error = true
              }
          })
          .catch((err) => {
              console.log(err)
          });
      },
      delete_post() {
          this.axios.post(this.api + '/blog/delete/' + this.$route.paramd.is).then((res) => {
              if (res.data.error == 0)
              {
                  this.$router.push('/posts')
              }
          })
          .catch((err) => {
              console.log(err)
          })
      }
  }
}
</script>
