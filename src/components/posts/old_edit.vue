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
                                <p class="card-text">
                                    <button type="button" class="btn btn-info btn-lg btn-block" v-on:click.prevent="statModal"><i class="fas fa-chart-pie"></i> Statistics</button>
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
                                    <small>Original Schedule: {{ original_schedule.toLocaleDateString() }}</small>
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
</template>

<script>
import Navigation from "../Navigation.vue";
import ImagesWidget from "../widgets/Images.vue";
import markdownEditor from "vue-simplemde/src/markdown-editor";

import slugify from "slugify";

export default {
  name: "EditPost",
  components: {
    Navigation,
    ImagesWidget,
    markdownEditor
  },
  created() {
    this.getTags();
    this.getPost();
  },
  data() {
    return {
      tags: [],
      title: null,
      content: null,
      selected_tag: null,
      schedule: new Date(),
      original_schedule: new Date(),
      hidden: false,
      url: null,

      success: false,
      error: false,
      statDate: [],
      statBrowser: [],
      statOs: []
    };
  },
  computed: {
    selectedImage() {
      return this.$store.state.selectedImage;
    }
  },
  methods: {
    getTags() {
      this.axios
        .get(this.api + "/tags")
        .then(res => {
          this.tags = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getPost() {
      this.axios
        .get(this.api + "/blog/" + this.$route.params.id)
        .then(res => {
          // console.log(res.data)
          this.title = res.data[0].title;
          this.content = res.data[0].content;
          this.selected_tag = res.data[0].tag._id;
          this.schedule = new Date(res.data[0].created_at);
          this.original_schedule = new Date(res.data[0].created_at);
          this.hidden = res.data[0].hidden;
          this.url = res.data[0].url;

          this.$store.commit(
            "selectImage",
            res.data[0].image ? res.data[0].image : null
          );
        })
        .catch(err => {
          console.log(err);
        });
    },
    slugify() {
      this.url = slugify(this.title);
    },
    update() {
      this.error = false;
      this.success = false;

      let formData = {
        title: this.title,
        content: this.content,
        tag: this.selected_tag,
        image:
          this.$store.state.selectedImage == null
            ? null
            : this.$store.state.selectedImage._id,
        schedule: this.schedule,
        hidden: this.hidden,
        url: this.url
      };
      // console.log(formData);

      this.axios
        .put(this.api + "/blog/" + this.$route.params.id, formData)
        .then(res => {
          // console.log(res)
          if (res.data.error == 0) {
            this.success = true;

            // Change original schedule date.
            this.original_schedule = new Date(this.schedule);
          } else {
            this.error = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delete_post() {
      this.axios
        .post(this.api + "/blog/delete/" + this.$route.params.id)
        .then(res => {
          if (res.data.error == 0) {
            this.$router.push("/posts");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getStat(days = 7) {
        this.axios
        .get(this.api + "/blog/" + this.$route.params.id + "/stat/" + days + "/number")
        .then(res => {
          // console.log(res);
          this.statDate = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    
      this.axios
        .get(this.api + "/blog/" + this.$route.params.id + "/stat/" + days + "/browser")
        .then(res => {
          // console.log(res);
          this.statBrowser = res.data;
        })
        .catch(err => {
          console.log(err);
        });

        this.axios
        .get(this.api + "/blog/" + this.$route.params.id + "/stat/" + days + "/platform")
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
