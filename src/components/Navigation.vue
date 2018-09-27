<template>
  <div class="sidebar">
    <div class="logo">
      <div class="d-md-none d-lg-none d-xl-none">
        <span class="float-left diavlo">ribbon</span>
        <span class="float-right">
          <a v-b-toggle="'main-nav'"><font-awesome-icon icon="bars" /></a>
        </span>
      </div>
      <span class="d-none d-md-block">arabesque for</span>
      <h1 class="d-none d-md-block diavlo"><router-link :to="{ name: 'Info' }">ribbon</router-link></h1>
    </div>
    <b-collapse
      id="main-nav"
      class="vert-nav">
      <b-btn 
        v-b-toggle="'profile-nav'" 
        class="profile-heading"><font-awesome-icon icon="user" /> {{ currentUser.username }}</b-btn>
      <b-collapse id="profile-nav">
        <ul>
          <li><router-link 
            :to="{ name: 'About' }" 
            active-class="current"><font-awesome-icon icon="address-card" /> About Me</router-link></li>
          <li><router-link 
            :to="{ name: 'Avatar' }" 
            active-class="current"><font-awesome-icon icon="user-circle" /> Avatar</router-link></li>
          <li><router-link 
            :to="{ name: 'Password' }" 
            active-class="current"><font-awesome-icon icon="key" /> Password</router-link></li>
          <li @click.prevent="logOut()"><a href=""><font-awesome-icon icon="sign-out-alt" /> Log Out</a></li>
        </ul>
      </b-collapse>
      <div class="heading">Blog</div>
      <ul>
        <li><router-link 
          :to="{ name: 'Posts' }" 
          active-class="current"><font-awesome-icon icon="list-alt" /> Posts</router-link></li>
        <li><router-link 
          :to="{ name: 'NewPost' }" 
          active-class="current"><font-awesome-icon icon="pencil-alt" /> New Post</router-link></li>
      </ul>

      <div class="heading">Content</div>
      <ul>
        <li><router-link 
          :to="{ name: 'Users' }" 
          active-class="current"><font-awesome-icon icon="users" /> Users</router-link></li>
        <li><router-link 
          :to="{ name: 'Tags' }" 
          active-class="current"><font-awesome-icon icon="tags" /> Tags</router-link></li>
        <li><router-link 
          :to="{ name: 'Pages' }" 
          active-class="current"><font-awesome-icon icon="book" /> Pages</router-link></li>
        <li><router-link 
          :to="{ name: 'Navigation' }" 
          active-class="current"><font-awesome-icon icon="link" /> Navigation</router-link></li>
        <li><router-link 
          :to="{ name: 'Images' }" 
          active-class="current"><font-awesome-icon icon="images" /> Images</router-link></li>
      </ul>
    </b-collapse>
  </div>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {};
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },
  methods: {
    logOut() {
      this.axios
        .post(`${this.api}/auth/logout`, {
          session_id: this.$store.state.currentUser.session_id
        })
        .then(res => {
          // alert(res.data.error)
          this.$store.commit("unAuth");
          this.$store.commit("unSetCurrentUser");
          this.$router.push("/");
          // alert(res.data.error)
        })
        .catch(err => {
          alert(err);
        });
    }
  }
};
</script>
