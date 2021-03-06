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
                            <button type="button" class="btn btn-info" v-on:click.prevent="statModal"><i class="fas fa-chart-pie"></i> Statistics</button>
                            <button type="button" class="btn btn-danger" v-on:click.prevent="deletePage()"><i class="far fa-trash-alt"></i> Delete</button>
                            <button type="button" class="btn btn-success" v-on:click.prevent="update()"><i class="far fa-thumbs-up" v-show="alerts.success"></i> Update</button>
                        </span>
                    </div>
                </nav>

                <div class="row">
                    <div v-bind:class="{ 'col-md-12': !selectedImage, 'col-md-9': selectedImage }">
                        <div class="input-group input-group-lg form-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-heading"></i></span>
                            </div>
                            <input type="text" v-model="page.title" class="form-control merriweather" placeholder="Title" v-on:keyup="slugify" />
                        </div>
                        <div class="form-group input-group input-group-sm">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-link"></i></span>
                            </div>
                            <input type="text" class="form-control merriweather" v-model="page.url" placeholder="Page URL" />
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

                <ImagesWidget></ImagesWidget>
                <b-modal ref="statModal" title="Statistics" size="lg" hide-footer>
                    <div class="d-block">
                        <h5>Visitors</h5>
                        <line-chart :data="statDate" :empty="{ empty: 'No data available.' }"></line-chart>
                    </div>
                    <b-container fluid>
                        <b-row>
                            <b-col cols="6">
                                <h5>Browsers</h5>
                                <pie-chart :data="statBrowser" :empty="{ empty: 'No data available.' }"></pie-chart>
                            </b-col>

                            <b-col cols="6">
                                <h5>Platforms</h5>
                                <pie-chart :data="statOs" :empty="{ empty: 'No data available.' }"></pie-chart>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-modal>
            </div>
        </div>
    </div>
</template>

<script>
import Navigation from "../Navigation.vue";
import ImagesWidget from "../widgets/Images.vue";
import markdownEditor from "vue-simplemde/src/markdown-editor";
import draggable from "vuedraggable";

import slugify from "slugify";

export default {
  name: "EditPage",
  components: {
    Navigation,
    ImagesWidget,
    markdownEditor,
    draggable
  },
  created() {
    this.getPage();
  },
  computed: {
    selectedImage() {
      return this.$store.state.selectedImage;
    }
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
      },
      statDate: [],
      statBrowser: [],
      statOs: [],
    };
  },
  methods: {
    getPage() {
      this.axios
        .get(this.api + "/pages/" + this.$route.params.id)
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
      var formData = {
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
        .put(this.api + "/pages/" + this.$route.params.id, formData)
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
        .post(this.api + "/pages/delete/" + this.$route.params.id)
        .then(res => {
          this.$router.push("/pages");
        })
        .catch(err => {
          console.log(err);
        });
    },
    /*
       * Statistics
       */
    getStat(days = 7) {
      this.axios
        .get(this.api + "/pages/" + this.$route.params.id + "/stat/" + days + "/number")
        .then(res => {
          // console.log(res);
          this.statDate = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    
      this.axios
        .get(this.api + "/pages/" + this.$route.params.id + "/stat/" + days + "/browser")
        .then(res => {
          // console.log(res);
          this.statBrowser = res.data;
        })
        .catch(err => {
          console.log(err);
        });

        this.axios
        .get(this.api + "/pages/" + this.$route.params.id + "/stat/" + days + "/platform")
        .then(res => {
          // console.log(res);
          this.statOs = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    statModal() {
      this.getStat();
      this.$refs.statModal.show();
    }
  }
};
</script>
