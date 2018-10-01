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
                  :to="{ name: 'Posts' }"
                  class="btn btn-danger btn-lg"
                  title="Back to Posts"><font-awesome-icon icon="chevron-left" /></router-link>
              </div>
              <input 
                v-model="title" 
                type="text" 
                class="form-control form-control-lg merriweather" 
                placeholder="Post Title" 
                @keyup="slugify" >
            </div>
            <div class="form-group">
              <shinpuru v-model="content"/>
            </div>
          </div>

          <div class="col-md-2">
            <div 
              v-show="success" 
              class="alert alert-success text-center"><font-awesome-icon icon="thumbs-up" /></div>
            <div 
              v-show="error" 
              class="alert alert-danger text-center">Error updating.</div>

            <div class="card">
              <div class="card-body">
                <p class="card-text">
                  <button 
                    type="button" 
                    class="btn btn-success btn-lg btn-block" 
                    @click="update()">Update</button>
                </p>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <Stats :post="$route.params.id"/>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h4 class="card-title">URL</h4>
                <div class="form-group card-text">
                  <input 
                    v-model="url" 
                    type="text" 
                    class="form-control" >
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h4 class="card-title">Tag</h4>
                <div class="form-group card-text">
                  <select 
                    v-model="selected_tag" 
                    class="form-control">
                    <option 
                      v-for="tag in tags" 
                      :value="tag._id" 
                      :key="tag._id">{{ tag.title }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h4 class="card-title">Schedule</h4>
                <div class="form-group card-text">
                  <input 
                    v-b-tooltip.focus 
                    v-model="schedule" 
                    :title="'Original Schedule: ' + originalSchedule" 
                    type="date" 
                    class="form-control" >
                </div>
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
                <div class="form-group card-text">
                  <button 
                    type="button" 
                    class="btn btn-primary btn-block" 
                    @click.prevent="hidden = !hidden">{{ (hidden) ? 'Hidden' : 'Viewable' }}
                  </button>
                </div>
                <div class="form-group card-text">
                  <button 
                    type="button" 
                    class="btn btn-danger btn-block" 
                    @click="delete_post()">Delete Post</button>
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
import moment from "moment";
import slugify from "slugify";
import Navigation from "../Navigation.vue";
import ImagesWidget from "../widgets/Images.vue";
import Shinpuru from "../widgets/Shinpuru.vue";
import Stats from "../widgets/Stats.vue";

export default {
  name: "EditPost",
  components: {
    Navigation,
    ImagesWidget,
    Shinpuru,
    Stats
    // markdownEditor
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
      error: false
    };
  },
  computed: {
    selectedImage() {
      return this.$store.state.selectedImage;
    },
    originalSchedule() {
      // console.log(this.original_schedule);
      return moment(this.original_schedule).format("MM/DD/YYYY");
    }
  },
  created() {
    this.getTags();
    this.getPost();
  },
  methods: {
    getTags() {
      this.axios
        .get(`${this.api}/tags`)
        .then(res => {
          this.tags = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getPost() {
      this.axios
        .get(`${this.api}/blog/${this.$route.params.id}`)
        .then(res => {
          // console.log(res.data)
          this.title = res.data[0].title;
          this.content = res.data[0].content;
          this.selected_tag = res.data[0].tag._id;
          // this.schedule = new Date(res.data[0].created_at);
          this.original_schedule = res.data[0].created_at;
          this.schedule = moment(res.data[0].created_at).format("YYYY-MM-DD");
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

      const formData = {
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
        .put(`${this.api}/blog/${this.$route.params.id}`, formData)
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
      console.log(this.content);
    },
    delete_post() {
      this.axios
        .post(`${this.api}/blog/delete/${this.$route.params.id}`)
        .then(res => {
          if (res.data.error == 0) {
            this.$router.push("/posts");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
