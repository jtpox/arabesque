<template>
  <div class="row no-gutters wrapper">
    <Navigation/>
    <div class="col-md-10 main-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-10">
            <div class="form-group">
              <input 
                v-model="page.title" 
                type="text" 
                class="form-control form-control-lg merriweather" 
                placeholder="Page Title" 
                @keyup="slugify" >
            </div>
                        
            <div class="form-group">
              <shinpuru v-model="page.content"/>
            </div>

            <nav class="navbar navbar-expand-lg navbar-light bg-light page-toolbar">
              <div class="container-fluid">
                <span>
                  <button 
                    type="button" 
                    class="btn btn-default" 
                    @click.prevent="addBox()">Add Content Box</button>
                </span>
              </div>
            </nav>

            <draggable 
              v-model="page.boxes" 
              :options="{ handle: '.movable' }" 
              class="row">
              <div 
                v-for="(box, index) in page.boxes" 
                :key="index" 
                :class="'col-md-' + box.content_column">
                <div class="card">
                  <div class="card-body">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend movable">
                        <span class="input-group-text"><i class="fas fa-arrows-alt"/></span>
                      </div>
                      <input 
                        v-model="box.title" 
                        type="text" 
                        class="form-control merriweather" 
                        placeholder="Title" >
                      <div class="input-group-append">
                        <button 
                          type="button" 
                          class="btn btn-danger" 
                          @click.prevent="removeBox(index)"><i class="far fa-trash-alt"/></button>
                      </div>
                    </div>

                    <div class="form-group">
                      <textarea 
                        v-model="box.content" 
                        class="form-control monaco" 
                        placeholder="Content"/>
                      <small>Markdown is enabled.</small>
                    </div>

                    <div class="form-group">
                      <input 
                        v-model="box.content_column" 
                        type="number" 
                        class="form-control" >
                    </div>
                  </div>
                </div>
              </div>
            </draggable>
          </div>

          <div class="col-md-2">
            <div class="card">
              <div class="card-body">
                <button 
                  type="button" 
                  class="btn btn-primary btn-lg btn-block" 
                  @click.prevent="publish()">Publish</button>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h4 class="card-title">URL</h4>
                <input 
                  v-model="page.url" 
                  type="text" 
                  class="form-control merriweather" >
              </div>
            </div>

            <div class="card">
              <span v-if="selectedImage !== null">
                <img 
                  :src="'/uploads/images/' + selectedImage.file_name" 
                  class="card-img-top img-fluid" 
                  alt="Selected Image">
              </span>
              <div class="card-body">
                <h4 class="card-title">Image</h4>
                <p class="card-text">
                  <b-btn 
                    v-b-modal="'imagesWidget'" 
                    class="btn-block">Select Image</b-btn>
                </p>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h4 class="card-title">Options</h4>
                <button 
                  type="button" 
                  class="btn btn-primary btn-block" 
                  @click.prevent="page.hidden = !page.hidden">
                  <i 
                    :class="{ 'fa-eye': !page.hidden, 'fa-eye-slash': page.hidden }" 
                    class="fas"/> Page {{ (page.hidden) ? 'Hidden' : 'Viewable' }}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <ImagesWidget/>
  </div>
</template>

<script>
// import markdownEditor from "vue-simplemde/src/markdown-editor";
import draggable from "vuedraggable";
import slugify from "slugify";
import Navigation from "../Navigation.vue";
import ImagesWidget from "../widgets/Images.vue";
import Shinpuru from "../widgets/Shinpuru.vue";

export default {
  name: "NewPage",
  components: {
    Navigation,
    ImagesWidget,
    Shinpuru,
    // markdownEditor,
    draggable
  },
  data() {
    return {
      page: {
        title: null,
        content: null,
        hidden: false,
        url: null,
        boxes: [
          {
            title: "Example",
            content: "Content example.",
            content_column: 3
          },
          {
            title: "Example 2",
            content: "Second content example",
            content_column: 3
          }
        ]
      }
    };
  },
  computed: {
    selectedImage() {
      return this.$store.state.selectedImage;
    }
  },
  methods: {
    removeBox(index) {
      this.page.boxes.splice(index, 1);
    },
    addBox() {
      this.page.boxes.push({
        title: null,
        content: null,
        content_column: 3
      });
    },
    slugify() {
      this.page.url = slugify(this.page.title);
    },
    publish() {
      const formData = {
        title: this.page.title,
        content: this.page.content,
        hidden: this.page.hidden,
        url: this.page.url,
        image:
          this.$store.state.selectedImage == null
            ? null
            : this.$store.state.selectedImage._id,
        boxes: JSON.stringify(this.page.boxes)
      };

      this.axios
        .post(`${this.api}/pages`, formData)
        .then(res => {
          if (res.data.error == 0) {
            // Clear selected image.
            this.$store.commit("clearSelectedImage");
            this.$router.push(`/edit/page/${res.data.page_id}`);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
