<template>
  <div class="col-md-2 main-nav">
    <div class="logo">
      <div class="d-md-none d-lg-none d-xl-none">
        <span class="float-left diavlo">ribbon</span>
        <span class="float-right">
          <a v-b-toggle="'main-nav'"><i class="fas fa-bars"/></a>
        </span>
      </div>
      <h1 class="d-none d-md-block diavlo"><router-link :to="{ name: 'Info' }">ribbon</router-link></h1>
    </div>
    <b-collapse 
      id="main-nav" 
      class="vert-nav">
      <b-btn 
        v-b-toggle="'profile-nav'" 
        class="profile-heading">{{ currentUser.username }}</b-btn>
      <b-collapse id="profile-nav">
        <ul>
          <li><router-link 
            :to="{ name: 'About' }" 
            active-class="current"><span class="badge badge-light"><i class="far fa-address-card"/></span> About Me</router-link></li>
          <li><router-link 
            :to="{ name: 'Avatar' }" 
            active-class="current"><span class="badge badge-light"><i class="far fa-user-circle"/></span> Avatar</router-link></li>
          <li><router-link 
            :to="{ name: 'Password' }" 
            active-class="current"><span class="badge badge-light"><i class="fas fa-key"/></span> Password</router-link></li>
          <li @click.prevent="logOut()"><a href=""><span class="badge badge-light"><i class="fas fa-sign-out-alt"/></span> Log Out</a></li>
        </ul>
      </b-collapse>
      <div class="heading">Blog</div>
      <ul>
        <li><router-link 
          :to="{ name: 'Posts' }" 
          active-class="current"><span class="badge badge-light"><i class="far fa-list-alt"/></span> Posts</router-link></li>
        <li><router-link 
          :to="{ name: 'NewPost' }" 
          active-class="current"><span class="badge badge-light"><i class="fas fa-pencil-alt"/></span> New Post</router-link></li>
      </ul>

      <div class="heading">Content</div>
      <ul>
        <li><router-link 
          :to="{ name: 'Users' }" 
          active-class="current"><span class="badge badge-light"><i class="fas fa-users"/></span> Users</router-link></li>
        <li><router-link 
          :to="{ name: 'Tags' }" 
          active-class="current"><span class="badge badge-light"><i class="fas fa-tags"/></span> Tags</router-link></li>
        <li><router-link 
          :to="{ name: 'Pages' }" 
          active-class="current"><span class="badge badge-light"><i class="fas fa-book"/></span> Pages</router-link></li>
        <li><router-link 
          :to="{ name: 'Navigation' }" 
          active-class="current"><span class="badge badge-light"><i class="fas fa-link"/></span> Navigation</router-link></li>
        <li><router-link 
          :to="{ name: 'Images' }" 
          active-class="current"><span class="badge badge-light"><i class="far fa-images"/></span> Images</router-link></li>
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
