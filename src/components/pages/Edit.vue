<template>
  <div class="wrapper">
    <Navigation/>
    <div class="main-content">
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
                :class="'col-md-' + box.content_column">
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
            <div 
              v-show="alerts.success" 
              class="alert alert-success text-center"><font-awesome-icon icon="thumbs-up" /></div>
            <div class="card">
              <div class="card-body">
                <button 
                  type="button" 
                  class="btn btn-success btn-lg btn-block" 
                  @click.prevent="update()">Update</button>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <Stats :page="$route.params.id"/>
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
                <div class="form-group">
                  <button 
                    type="button" 
                    class="btn btn-primary btn-block" 
                    @click.prevent="page.hidden = !page.hidden">{{ (page.hidden) ? 'Hidden' : 'Viewable' }}
                  </button>
                </div>
                <div class="form-group">
                  <button 
                    type="button" 
                    class="btn btn-danger btn-block" 
                    @click.prevent="deletePage()">Delete Page</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <ImagesWidget/>
    <b-modal 
      ref="statModal" 
      title="Statistics" 
      size="lg" 
      hide-footer>
      <div class="d-block">
        <h5>Visitors</h5>
        <line-chart 
          :data="statDate" 
          :empty="{ empty: 'No data available.' }"/>
      </div>
      <b-container fluid>
        <b-row>
          <b-col cols="6">
            <h5>Browsers</h5>
            <pie-chart 
              :data="statBrowser" 
              :empty="{ empty: 'No data available.' }"/>
          </b-col>
                    
          <b-col cols="6">
            <h5>Platforms</h5>
            <pie-chart 
              :data="statOs" 
              :empty="{ empty: 'No data available.' }"/>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
// import markdownEditor from "vue-simplemde/src/markdown-editor";
import draggable from "vuedraggable";
import slugify from "slugify";
import Navigation from "../Navigation.vue";
import ImagesWidget from "../widgets/Images.vue";
import Shinpuru from "../widgets/Shinpuru.vue";
import Stats from "../widgets/Stats.vue";

export default {
  name: "EditPage",
  components: {
    Navigation,
    ImagesWidget,
    Shinpuru,
    Stats,
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
        boxes: []
      },
      alerts: {
        success: false
      }
    };
  },
  computed: {
    selectedImage() {
      return this.$store.state.selectedImage;
    }
  },
  created() {
    this.getPage();
  },
  methods: {
    getPage() {
      this.axios
        .get(`${this.api}/pages/${this.$route.params.id}`)
        .then(res => {
          this.page.title = res.data.details.title;
          this.page.content = res.data.details.description;
          this.page.hidden = res.data.details.hidden;
          this.page.url = res.data.details.url;

          this.page.boxes = res.data.boxes;

          this.$store.commit(
            "selectImage",
            res.data.details.image ? res.data.details.image : null
          );
        })
        .catch(err => {
          console.log(err);
        });
    },
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
    update() {
      this.alerts.success = false;
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
        .put(`${this.api}/pages/${this.$route.params.id}`, formData)
        .then(res => {
          // console.log(res.data)
          if (res.data.error == 0) {
            this.alerts.success = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deletePage() {
      this.axios
        .post(`${this.api}/pages/delete/${this.$route.params.id}`)
        .then(res => {
          this.$router.push("/pages");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
