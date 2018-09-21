<template>
    <div class="row no-gutters wrapper">
        <Navigation></Navigation>
        <div class="col-md-10 main-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-10">
                        <div class="form-group">
                            <input type="text" v-model="page.title" class="form-control form-control-lg merriweather" placeholder="Page Title" v-on:keyup="slugify" />
                        </div>
                        
                        <div class="form-group">
                            <shinpuru v-model="page.content"></shinpuru>
                        </div>

                        <nav class="navbar navbar-expand-lg navbar-light bg-light page-toolbar">
                            <div class="container-fluid">
                                <span>
                                    <button type="button" class="btn btn-default" v-on:click.prevent="addBox()">Add Content Box</button>
                                </span>
                            </div>
                        </nav>

                        <draggable v-model="page.boxes" class="row" :options="{ handle: '.movable' }">
                            <div v-for="(box, index) in page.boxes" :key="index" v-bind:class="'col-md-' + box.content_column">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="input-group mb-3">
                                            <div class="input-group-prepend movable">
                                                <span class="input-group-text"><i class="fas fa-arrows-alt"></i></span>
                                            </div>
                                            <input type="text" class="form-control merriweather" v-model="box.title" placeholder="Title" />
                                            <div class="input-group-append">
                                                <button type="button" class="btn btn-danger" v-on:click.prevent="removeBox(index)"><i class="far fa-trash-alt"></i></button>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <textarea class="form-control monaco" v-model="box.content" placeholder="Content"></textarea>
                                            <small>Markdown is enabled.</small>
                                        </div>

                                        <div class="form-group">
                                            <input type="number" class="form-control" v-model="box.content_column" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </draggable>
                    </div>

                    <div class="col-md-2">
                        <div class="card">
                            <div class="card-body">
                                <button type="button" class="btn btn-primary btn-lg btn-block" v-on:click.prevent="publish()">Publish</button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">URL</h4>
                                <input type="text" class="form-control merriweather" v-model="page.url" />
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
                                <button type="button" class="btn btn-primary btn-block" v-on:click.prevent="page.hidden = !page.hidden">
                                    <i class="fas" v-bind:class="{ 'fa-eye': !page.hidden, 'fa-eye-slash': page.hidden }"></i> Page {{ (page.hidden) ? 'Hidden' : 'Viewable' }}
                                </button>
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
import Shinpuru from '../widgets/Shinpuru.vue';
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import draggable from 'vuedraggable'

import slugify from 'slugify'

export default {
  name: 'NewPage',
  components: {
      Navigation,
      ImagesWidget,
      Shinpuru,
      markdownEditor,
      draggable,
  },
  computed: {
      selectedImage() {
          return this.$store.state.selectedImage
      }
  },
  data () {
    return {
        page: {
            title: null,
            content: null,
            hidden: false,
            url: null,
            boxes: [
                {
                    title: 'Example',
                    content: 'Content example.',
                    content_column: 3
                },
                {
                    title: 'Example 2',
                    content: 'Second content example',
                    content_column: 3
                }
            ]
        },
    }
  },
  methods: {
      removeBox(index) {
          this.page.boxes.splice(index, 1)
      },
      addBox() {
          this.page.boxes.push({
              title: null,
              content: null,
              content_column: 3
          })
      },
      slugify() {
          this.page.url = slugify(this.page.title)
      },
      publish() {
          var formData = {
              title: this.page.title,
              content: this.page.content,
              hidden: this.page.hidden,
              url: this.page.url,
              image: (this.$store.state.selectedImage == null) ? null : this.$store.state.selectedImage._id,
              boxes: JSON.stringify(this.page.boxes)
          }

          this.axios.post(this.api + '/pages', formData).then((res) => {
              if( res.data.error == 0 )
              {
                  //Clear selected image.
                  this.$store.commit('clearSelectedImage')
                  this.$router.push('/edit/page/' + res.data.page_id)
              }
          })
          .catch((err) => {
              console.log(err)
          })
      }
  }
}
</script>
