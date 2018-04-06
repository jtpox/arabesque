<template>
    <div class="row no-gutters wrapper">
        <Navigation></Navigation>
        <div class="col-md-10 main-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-9">

                        <div class="page-header">
                            <h1>Users</h1>
                        </div>
                        <div class="list-group list-group-flush">
                            <a href="#" v-for="(user, index) in users" v-on:click.prevent="selectUser(index)" class="list-group-item">
                                <div class="justify-content-between">
                                    <h5 class="mb-1">{{ user.username }}</h5>
                                </div>
                                <small>{{ user.about }}</small>
                            </a>
                        </div>

                    </div>

                    <div class="col-md-3">
                        <div class="card" v-if="selected_user !== null">
                            <div class="card-body">
                                <h4 class="card-title">Edit User</h4>
                                <form v-on:submit.prevent="edit_user()">
                                    <div class="alert alert-success text-center" v-show="alerts.edit.success"><i class="far fa-thumbs-up"></i></div>
                                    <div class="alert alert-danger text-center" v-show="alerts.edit.error">Error updating user.</div>
                                    <div class="form-group">
                                        <input type="text" v-model="selected_user.username" placeholder="Username" class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <input type="email" v-model="selected_user.email" placeholder="Email" class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <input type="password" v-model="selected_user.password" placeholder="Password" class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <button type="submit" class="btn btn-success">Edit</button>
                                        <button type="button" class="btn btn-danger" v-on:click.prevent="delete_user()">Delete</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">New User</h4>
                                <form v-on:submit.prevent="create_user()">
                                    <div class="alert alert-success text-center" v-show="alerts.new.success"><i class="far fa-thumbs-up"></i></div>
                                    <div class="alert alert-danger text-center" v-show="alerts.new.error">Error creating user.</div>
                                    <div class="form-group">
                                        <input type="text" v-model="new_user.username" placeholder="Username" class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <input type="email" v-model="new_user.email" placeholder="Email" class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <input type="password" v-model="new_user.password" placeholder="Password" class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <button type="submit" class="btn btn-primary">Create</button>
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
import Navigation from '../Navigation.vue'

export default {
  name: 'UsersList',
  components: {
      Navigation
  },
  created() {
      this.getUsers()
  },
  data () {
    return {
        users: [],
        selected_user: null,
        selected_index: null,
        new_user: {
            username: null,
            password: null,
            email: null
        },
        alerts: {
            edit: {
                success: false,
                error: false,
            },
            new: {
                success: false,
                error: false,
            }
        }
    }
  },
  methods: {
      getUsers() {
          this.axios.get(this.api + '/users').then((res) => {
              this.users = res.data
          })
          .catch((err) => {
              console.log(err);
          });
      },
      selectUser(index) {
          this.selected_user = this.users[index]
          this.selected_index = index
      },
      create_user() {
          this.alerts.new.success = false
          this.alerts.new.error = false
          this.axios.post(this.api + '/users', this.new_user).then((res) => {
              if (res.data.error == 0){
                  this.alerts.new.success = true;

                  this.users.push(res.data.user)
              }
              else
              {
                  this.alerts.new.error = true;
              }
          })
          .catch((err) => {
              console.log(err)
          })
      },
      edit_user() {
          this.alerts.edit.success = false
          this.alerts.edit.error = false
          this.axios.put(this.api + '/users/' + this.selected_user._id, { username: this.selected_user.username, password: (this.selected_user.password) ? this.selected_user.password : null, email: this.selected_user.email }).then((res) => {
              if (res.data.error == 0){
                  this.alerts.edit.success = true
                  //Change username in array from index.
                  this.users[this.selected_index].username = this.selected_user.username
              }
              else
              {
                  this.alerts.edit.error = true;
              }
          })
          .catch((err) => {
              console.log(err)
          })
      },
      delete_user() {
          this.axios.post(this.api + '/users/delete/' + this.selected_user._id).then((res) => {
              if (res.data.error == 0){
                  this.users.splice(this.selected_index, 1)

                  //Log user out if deleted.
                  if (this.$store.state.currentUser.user_id == this.selected_user._id){
                      this.$store.commit('unAuth')
                      this.$store.commit('unSetCurrentUser')
                      this.$router.push('/')
                  }
                  // Clear variables.
                  this.selected_user = null
                  this.selected_index = null
              }
          })
          .catch((err) => {
              console.log(err)
          })
      }
  }
}
</script>
