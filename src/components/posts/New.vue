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
            <div class="card">
              <div class="card-body">
                <p class="card-text">
                  <button 
                    type="button" 
                    class="btn btn-primary btn-lg btn-block" 
                    @click="post()">Publish</button>
                </p>
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
                    v-model="schedule" 
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
import slugify from "slugify";
import Navigation from "../Navigation.vue";
import ImagesWidget from "../widgets/Images.vue";
import Shinpuru from "../widgets/Shinpuru.vue";

export default {
  name: "NewPost",
  components: {
    Navigation,
    ImagesWidget,
    Shinpuru
    // markdownEditor
  },
  data() {
    return {
      tags: [],
      title: null,
      content: null,
      selected_tag: null,
      schedule: new Date(),
      hidden: false,
      url: null
    };
  },
  computed: {
    selectedImage() {
      return this.$store.state.selectedImage;
    }
  },
  created() {
    this.getTags();
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
    slugify() {
      this.url = slugify(this.title);
    },
    post() {
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

      this.axios
        .post(`${this.api}/blog`, formData)
        .then(res => {
          if (res.data.error == 0) {
            // Clear selected.
            this.$store.commit("clearSelectedImage");
            this.$router.push(`/edit/post/${res.data.post_id}`);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
