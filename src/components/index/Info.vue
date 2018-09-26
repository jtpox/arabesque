<template>
  <div class="wrapper">
    <Navigation/>
    <div class="main-content">
      <div class="container-fluid">
        <div class="row text-center">
          <div class="col-md-6 offset-md-3">
            <h4>You are running</h4>
          </div>
          <div class="col-md-3 offset-md-3">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">ribbon</h4>
                <h5 class="card-title text-primary">{{ currentRibbonBuild }}</h5>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">arabesque</h4>
                <h5 class="card-title text-info">{{ currentArabesqueBuild }}</h5>
              </div>
            </div>
          </div>
          <div class="col-md-6 offset-md-3">
            <h4>A heartfelt thanks and <font-awesome-icon icon="heart" /> for using ribbon</h4>
            <p>
              <a 
                href="https://ribbon.jtpox.com/" 
                target="_blank">Official Website</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from "../Navigation.vue";

import { version } from "../../../package.json";

export default {
  name: "Info",
  components: {
    Navigation
  },
  data() {
    return {
      currentRibbonBuild: null,
      currentArabesqueBuild: version
    };
  },
  created() {
    this.getCurrentBuild();
  },
  methods: {
    getCurrentBuild() {
      this.axios
        .get(this.api)
        .then(res => {
          this.currentRibbonBuild = res.data.ribbon_version;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
