<template>
  <div class="wrapper">
    <Navigation/>
    <div class="main-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-10">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <router-link 
                  v-b-tooltip.hover
                  v-b-tooltip.html.right
                  :to="{ name: 'Pages' }"
                  class="btn btn-danger btn-lg"
                  title="Back to Pages"><font-awesome-icon icon="chevron-left" /></router-link>
              </div>
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

            <div class="page-toolbar">
              <button 
                type="button" 
                class="btn btn-default" 
                @click.prevent="addBox()">Add Content Box</button>
            </div>

            <draggable 
              v-model="page.boxes" 
              :options="{ handle: '.movable' }" 
              class="row">
              <div 
                v-for="(box, index) in page.boxes" 
                :key="index" 
                :class="'col-md-' + box.content_column + ' offset-md-' + box.content_offset">
                <div class="card">
                  <div class="card-body">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend movable">
                        <span class="input-group-text"><font-awesome-icon icon="arrows-alt" /></span>
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
                          @click.prevent="removeBox(index)"><font-awesome-icon icon="trash" /></button>
                      </div>
                    </div>

                    <div class="form-group">
                      <textarea 
                        v-model="box.content" 
                        class="form-control monaco" 
                        placeholder="Content"/>
                      <small>Markdown is enabled.</small>
                    </div>

                    <div class="input-group mb-3">
                      <div
                        v-b-tooltip.hover
                        class="input-group-prepend"
                        title="Size">
                        <span class="input-group-text">
                          <font-awesome-icon
                            icon="expand" />
                        </span>
                      </div>
                      <input 
                        v-model="box.content_column" 
                        type="number" 
                        class="form-control" >
                    </div>

                    <div class="input-group mb-3">
                      <div
                        v-b-tooltip.hover
                        class="input-group-prepend"
                        title="Offset">
                        <span class="input-group-text">
                          <font-awesome-icon
                            icon="arrows-alt-h" />
                        </span>
                      </div>
                      <input 
                        v-model="box.content_offset" 
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
                <div class="form-group card-text">
                  <b-btn 
                    v-b-modal="'imagesWidget'" 
                    class="btn-block">Select Image</b-btn>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h4 class="card-title">Options</h4>
                <div class="form-group card-text">
                  <button 
                    type="button" 
                    class="btn btn-primary btn-block" 
                    @click.prevent="page.hidden = !page.hidden">{{ (page.hidden) ? 'Hidden' : 'Viewable' }}
                  </button>
                </div>
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
            content_column: 3,
            content_offset: 0
          },
          {
            title: "Example 2",
            content: "Second content example",
            content_column: 3,
            content_offset: 0
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
        content_column: 3,
        content_offset: 0
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
