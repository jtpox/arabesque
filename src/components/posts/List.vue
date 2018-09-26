<template>
  <div class="wrapper">
    <Navigation/>
    <div class="main-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-8 offset-md-2">

            <div class="page-header">
              <h1>Posts <router-link 
                :to="{ name: 'NewPost' }" 
                class="btn btn-primary btn-sm">New Post</router-link></h1>
            </div>

            <div
              v-show="posts.length > 0"
              :class="{ 'input-group mb-3': (search !== '') }"
              class="form-group">
              <input
                v-model="search"
                type="text"
                class="form-control"
                placeholder="Search by post title."
                @input="searchInput" >
              <div
                v-show="search !== ''"
                class="input-group-append">
                <button
                  v-b-tooltip.hover
                  class="btn btn-danger"
                  title="Reset Search"
                  @click.prevent="search = ''">
                  <font-awesome-icon icon="times" />
                </button>
              </div>
            </div>

            <div
              v-show="posts.length < 1"
              class="alert alert-warning">
              No posts yet.
            </div>

            <div class="list-group list-group-flush">
              <router-link
                v-for="post in posts" 
                v-show="searches.length < 1"
                :key="'post ' + post._id" 
                :to="{ name: 'EditPost', params: { id: post._id } }" 
                class="list-group-item">
                <div class="justify-content-between">
                  <h5 class="mb-1">{{ post.title }}</h5>
                </div>
                <small>By {{ post.created_by.username }} - {{ post.created_at | formatDate }}</small>
              </router-link>

              <router-link
                v-for="post in searches" 
                v-show="searches.length > 0"
                :key="'search ' + post._id" 
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

import debounce from "debounce";

export default {
  name: "ListPosts",
  components: {
    Navigation
  },
  data() {
    return {
      posts: [],
      search: ""
    };
  },
  computed: {
    searches() {
      if (this.search !== "") {
        const results = [];
        const regex = new RegExp(this.search.toLowerCase(), "g");
        // console.log(regex.toString());
        this.posts.forEach((item, index) => {
          // console.log(item.title.search(this.search));
          if (item.title.toLowerCase().match(regex)) {
            results.push(item);
          }
        });
        // console.log(results);
        return results;
      } else {
        return [];
      }
    }
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
    },
    searchInput: debounce(e => {
      // console.log(e.target.value);
      this.search = e.target.value;
    }, 1000)
  }
};
</script>
