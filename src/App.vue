<template>
  <div id="app">
    
    <router-view/>

  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated
    },
    currentUser() {
      return this.$store.state.currentUser
    }
  }
}
</script>

<style src="./assets/css/ribbon.css"></style>
<style src="./assets/css/simplemde.min.css"></style>
