<template>
    <div class="row no-gutters wrapper">
        <Navigation></Navigation>
        <div class="col-md-10 main-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-8 offset-md-2">

                        <div class="page-header">
                            <h1>Pages <router-link :to="{ name: 'NewPage' }" class="btn btn-primary btn-sm">New Page</router-link></h1>
                        </div>
                        <div class="list-group list-group-flush">
                            <router-link v-for="page in pages" :key="page._id" :to="{ name: 'EditPage', params: { id: page._id } }" class="list-group-item">
                                <div class="justify-content-between">
                                    <h5 class="mb-1">{{ page.title }}</h5>
                                </div>
                                <small>Status: <i class="fas" v-bind:class="{ 'fa-eye': !page.hidden, 'fa-eye-slash': page.hidden }"></i></small>
                            </router-link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navigation from '../Navigation.vue'

export default {
  name: 'ListPages',
  components: {
      Navigation
  },
  created() {
      this.getPages()
  },
  data () {
    return {
        pages: []
    }
  },
  methods: {
      getPages() {
          this.axios.get(this.api + '/pages/admin').then((res) => {
              this.pages = res.data
          })
          .catch((err) => {
              console.log(err);
          });
      }
  }
}
</script>
