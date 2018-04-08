<template>
    <div class="row no-gutters wrapper">
        <Navigation></Navigation>
        <div class="col-md-10 main-content">
            <div class="container-fluid">
                
                <nav class="navbar navbar-expand-lg navbar-light bg-light page-toolbar">
                    <div class="container-fluid">
                        <span>
                            <button type="button" class="btn btn-default" v-on:click.prevent="addBox()">Add Content Box</button>
                            <b-btn v-b-modal="'imagesWidget'">Select Image</b-btn>
                        </span>
                        <span>
                            <button type="button" class="btn btn-primary" v-on:click.prevent="page.hidden = !page.hidden">
                                <i class="fas" v-bind:class="{ 'fa-eye': !page.hidden, 'fa-eye-slash': page.hidden }"></i> Page {{ (page.hidden) ? 'Hidden' : 'Viewable' }}
                            </button>
                            <button type="button" class="btn btn-success" v-on:click.prevent="publish()">Publish</button>
                        </span>
                    </div>
                </nav>

                <div class="row">
                    <div v-bind:class="{ 'col-md-12': !selectedImage, 'col-md-9': selectedImage }">
                        <div class="form-group">
                            <input type="text" v-model="page.title" class="form-control form-control-lg merriweather" placeholder="Title" />
                        </div>
                    </div>

                    <div class="col-md-3" v-if="selectedImage">
                        <div class="card">
                            <img class="card-img-top img-fluid" :src="'/uploads/images/' + selectedImage.file_name" alt="Selected Image">
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div class="form-group">
                            <markdown-editor v-model="page.content"></markdown-editor>
                        </div>
                    </div>
                </div>

                <draggable v-model="page.boxes" class="row" :options="{ handle: '.movable' }">
                    <div v-for="(box, index) in page.boxes" :key="index" v-bind:class="'col-md-' + box.content_column">
                        <div class="card movable">
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
                                    <textarea class="form-control merriweather" v-model="box.content" placeholder="Content"></textarea>
                                    <small>Markdown is enabled.</small>
                                </div>

                                <div class="form-group">
                                    <input type="number" class="form-control" v-model="box.content_column" />
                                </div>
                            </div>
                        </div>
                    </div>
                </draggable>

                <ImagesWidget></ImagesWidget>
            </div>
        </div>
    </div>
</template>

<script>
import Navigation from '../Navigation.vue'
import ImagesWidget from '../widgets/Images.vue'
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import draggable from 'vuedraggable'

export default {
  name: 'NewPage',
  components: {
      Navigation,
      ImagesWidget,
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
      publish() {
          var formData = {
              title: this.page.title,
              content: this.page.content,
              hidden: this.page.hidden,
              image: (this.$store.state.selectedImage == null) ? null : this.$store.state.selectedImage._id,
              boxes: JSON.stringify(this.page.boxes)
          }

          this.axios.post(this.api + '/pages', formData).then((res) => {
              // console.log(res.data)
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
