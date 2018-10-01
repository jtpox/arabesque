<template>
  <div class="wrapper">
    <Navigation/>
    <div class="main-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-9">

            <div class="page-header">
              <h1>Users</h1>
            </div>
            <div class="list-group list-group-flush">
              <a 
                v-for="(user, index) in users" 
                href="#" 
                class="list-group-item" 
                @click.prevent="selectUser(index)">
                <div class="justify-content-between">
                  <h5 class="mb-1">{{ user.username }}</h5>
                </div>
                <small>{{ user.about }}</small>
              </a>
            </div>

          </div>

          <div class="col-md-3">
            <div 
              v-show="alerts.new.success" 
              class="alert alert-success text-center"><font-awesome-icon icon="thumbs-up" /></div>
            <div 
              v-show="alerts.new.error" 
              class="alert alert-danger text-center">Error creating user.</div>

            <div class="card">
              <div class="card-body">
                <h4 class="card-title">New User</h4>
                <form @submit.prevent="create_user()">
                  <div class="form-group">
                    <input 
                      v-model="new_user.username" 
                      type="text" 
                      placeholder="Username" 
                      class="form-control" >
                  </div>
                  <div class="form-group">
                    <input 
                      v-model="new_user.email" 
                      type="email" 
                      placeholder="Email" 
                      class="form-control" >
                  </div>
                  <div class="form-group">
                    <input 
                      v-model="new_user.password" 
                      type="password" 
                      placeholder="Password" 
                      class="form-control" >
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text">User is</span>
                    </div>
                    <button 
                      v-b-tooltip.hover
                      type="button" 
                      class="btn btn-info form-control" 
                      title="Click to change."
                      @click.prevent="(new_user.group === 1)? new_user.group = 2: new_user.group = 1">
                      {{ (new_user.group === 1) ? 'Admin' : 'Editor' }}
                    </button>
                  </div>
                  <div class="form-group">
                    <button 
                      type="submit" 
                      class="btn btn-primary">Create</button>
                  </div>
                </form>
              </div>
            </div>

            <div 
              v-if="selected_user !== null" 
              class="card">
              <div class="card-body">
                <h4 class="card-title">Edit User</h4>
                <form @submit.prevent="edit_user()">
                  <div 
                    v-show="alerts.edit.success" 
                    class="alert alert-success text-center"><font-awesome-icon icon="thumbs-up" /></div>
                  <div 
                    v-show="alerts.edit.error" 
                    class="alert alert-danger text-center">Error updating user.</div>
                  <div class="form-group">
                    <input 
                      v-model="selected_user.username" 
                      type="text" 
                      placeholder="Username" 
                      class="form-control" >
                  </div>
                  <div class="form-group">
                    <input 
                      v-model="selected_user.email" 
                      type="email" 
                      placeholder="Email" 
                      class="form-control" >
                  </div>
                  <div class="form-group">
                    <input 
                      v-model="selected_user.password" 
                      type="password" 
                      placeholder="Password" 
                      class="form-control" >
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text">User is</span>
                    </div>
                    <button 
                      v-b-tooltip.hover
                      type="button" 
                      class="btn btn-info form-control" 
                      title="Click to change."
                      @click.prevent="(selected_user.group === 1)? selected_user.group = 2: selected_user.group = 1">
                      {{ (selected_user.group === 1) ? 'Admin' : 'Editor' }}
                    </button>
                  </div>
                  <div class="form-group">
                    <button 
                      type="submit" 
                      class="btn btn-success">Edit</button>
                    <button 
                      type="button" 
                      class="btn btn-danger" 
                      @click.prevent="delete_user()">Delete</button>
                  </div>
                </form>
              </div>
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
  name: "UsersList",
  components: {
    Navigation
  },
  data() {
    return {
      users: [],
      selected_user: null,
      selected_index: null,
      new_user: {
        username: null,
        password: null,
        email: null,
        group: 1
      },
      alerts: {
        edit: {
          success: false,
          error: false
        },
        new: {
          success: false,
          error: false
        }
      }
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.axios
        .get(`${this.api}/users`)
        .then(res => {
          this.users = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectUser(index) {
      this.selected_user = this.users[index];
      this.selected_index = index;
    },
    create_user() {
      this.alerts.new.success = false;
      this.alerts.new.error = false;
      this.axios
        .post(`${this.api}/users`, this.new_user)
        .then(res => {
          if (res.data.error == 0) {
            this.alerts.new.success = true;

            this.users.push(res.data.user);
          } else {
            this.alerts.new.error = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    edit_user() {
      this.alerts.edit.success = false;
      this.alerts.edit.error = false;
      this.axios
        .put(`${this.api}/users/${this.selected_user._id}`, {
          username: this.selected_user.username,
          password: this.selected_user.password
            ? this.selected_user.password
            : null,
          email: this.selected_user.email,
          group: this.selected_user.group
        })
        .then(res => {
          if (res.data.error == 0) {
            this.alerts.edit.success = true;
            // Change username in array from index.
            this.users[
              this.selected_index
            ].username = this.selected_user.username;
          } else {
            this.alerts.edit.error = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delete_user() {
      this.axios
        .post(`${this.api}/users/delete/${this.selected_user._id}`)
        .then(res => {
          if (res.data.error == 0) {
            this.users.splice(this.selected_index, 1);

            // Log user out if deleted.
            if (
              this.$store.state.currentUser.user_id == this.selected_user._id
            ) {
              this.$store.commit("unAuth");
              this.$store.commit("unSetCurrentUser");
              this.$router.push("/");
            }
            // Clear variables.
            this.selected_user = null;
            this.selected_index = null;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
