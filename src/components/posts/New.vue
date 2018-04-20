<template>
    <div class="row no-gutters wrapper">
        <Navigation></Navigation>
        <div class="col-md-10 main-content">
            <div class="container-fluid">
                <div class="row">

                    <div class="col-md-10">
                        <div class="form-group">
                            <input type="text" class="form-control form-control-lg merriweather" v-model="title" placeholder="Title" v-on:keyup="slugify" />
                        </div>
                        <div class="form-group">
                            <markdown-editor v-model="content"></markdown-editor>
                        </div>
                    </div>

                    <div class="col-md-2">
                        <div class="card">
                            <div class="card-body">
                                <p class="card-text">
                                    <button type="button" class="btn btn-primary btn-lg btn-block" v-on:click="post()">Post</button>
                                </p>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">URL</h4>
                                <p class="card-text">
                                    <input type="text" class="form-control" v-model="url" />
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
                                    <input type="date" class="form-control" v-model="schedule" />
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
                                    <label>
                                        <input type="checkbox" v-model="hidden" /> Hidden Post
                                    </label>
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

import slugify from 'slugify'

export default {
  name: 'NewPost',
  components: {
      Navigation,
      ImagesWidget,
      markdownEditor
  },
  created() {
      this.getTags()
  },
  data () {
    return {
        tags: [],
        title: null,
        content: null,
        selected_tag: null,
        schedule: new Date(),
        hidden: false,
        url: null,
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
      slugify() {
          this.url = slugify(this.title)
      },
      post() {
          let formData = {
              title: this.title,
              content: this.content,
              tag: this.selected_tag,
              image: (this.$store.state.selectedImage == null) ? null : this.$store.state.selectedImage._id,
              schedule: this.schedule,
              hidden: this.hidden,
              url: this.url
          }
          // console.log(formData);

          this.axios.post(this.api + '/blog', formData).then((res) => {
              // console.log(res)
              if (res.data.error == 0){
                 //Clear selected.
                this.$store.commit('clearSelectedImage')
                this.$router.push('/edit/post/' + res.data.post_id)
              }
          })
          .catch((err) => {
              console.log(err)
          });
      }
  }
}
</script>
