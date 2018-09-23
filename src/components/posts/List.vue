<template>
  <div class="row no-gutters wrapper">
    <Navigation/>
    <div class="col-md-10 main-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-8 offset-md-2">

            <div class="page-header">
              <h1>Posts <router-link 
                :to="{ name: 'NewPost' }" 
                class="btn btn-primary btn-sm">New Post</router-link></h1>
            </div>

            <div
              v-show="posts.length < 1"
              class="alert alert-warning">
              No posts yet.
            </div>

            <div class="list-group list-group-flush">
              <router-link 
                v-for="post in posts" 
                :key="post._id" 
                :to="{ name: 'EditPost', params: { id: post._id } }" 
                class="list-group-item">
                <div class="justify-content-between">
                  <h5 class="mb-1">{{ post.title }}</h5>
                </div>
                <small>By {{ post.created_by.username }} - {{ post.created_at | formatDate }}</small>
              </router-link>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from "../Navigation.vue";

export default {
  name: "ListPosts",
  components: {
    Navigation
  },
  data() {
    return {
      posts: []
    };
  },
  created() {
    this.getPosts();
  },
  methods: {
    getPosts() {
      this.axios
        .get(`${this.api}/blog`)
        .then(res => {
          this.posts = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
