<template>
  <div class="wrapper">
    <Navigation/>
    <div class="main-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-8 offset-md-2">

            <div class="page-header">
              <h1>Pages <router-link 
                :to="{ name: 'NewPage' }" 
                class="btn btn-primary btn-sm">New Page</router-link></h1>
            </div>

            <div
              v-show="pages.length < 1"
              class="alert alert-warning">
              No pages yet.
            </div>

            <div class="list-group list-group-flush">
              <router-link 
                v-for="page in pages" 
                :key="page._id" 
                :to="{ name: 'EditPage', params: { id: page._id } }" 
                class="list-group-item">
                <div class="justify-content-between">
                  <h5 class="mb-1">{{ page.title }}</h5>
                </div>
                <small>Status: <i 
                  :class="{ 'fa-eye': !page.hidden, 'fa-eye-slash': page.hidden }" 
                  class="fas"/></small>
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
  name: "ListPages",
  components: {
    Navigation
  },
  data() {
    return {
      pages: []
    };
  },
  created() {
    this.getPages();
  },
  methods: {
    getPages() {
      this.axios
        .get(`${this.api}/pages/admin`)
        .then(res => {
          this.pages = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
