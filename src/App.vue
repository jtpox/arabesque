<template>
  <div id="app">
    
    <router-view/>

  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    currentUser() {
      return this.$store.state.currentUser;
    }
  }
};
</script>

<style lang="scss">
@import "assets/scss/ribbon";
</style>
