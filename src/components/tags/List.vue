<template>
  <div class="wrapper">
    <Navigation/>
    <div class="main-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-9">

            <div class="page-header">
              <h1>Tags</h1>
            </div>

            <div
              v-show="tags.length < 1"
              class="alert alert-warning">
              No tags yet.
            </div>

            <div class="list-group list-group-flush">
              <a 
                v-for="(tag, index) in tags" 
                href="#" 
                class="list-group-item" 
                @click.prevent="selectTag(index)">
                <div class="justify-content-between">
                  <h5 class="mb-1">{{ tag.title }}</h5>
                </div>
                <small>{{ tag.content }}</small>
              </a>
            </div>

          </div>

          <div class="col-md-3">
            <div 
              v-if="selected_tag !== null" 
              class="card">
              <div class="card-body">
                <h4 class="card-title">Edit Tag</h4>
                <form @submit.prevent="edit_tag()">
                  <div 
                    v-show="alerts.edit.success" 
                    class="alert alert-success text-center"><font-awesome-icon icon="thumbs-up" /></div>
                  <div 
                    v-show="alerts.edit.error" 
                    class="alert alert-danger text-center">Error updating user.</div>
                  <div class="form-group">
                    <input 
                      v-model="selected_tag.title" 
                      type="text" 
                      placeholder="Title" 
                      class="form-control" >
                  </div>
                  <div class="form-group">
                    <textarea 
                      v-model="selected_tag.content" 
                      placeholder="Description" 
                      class="form-control"/>
                  </div>
                  <div class="form-group">
                    <button 
                      type="submit" 
                      class="btn btn-success">Edit</button>
                    <button 
                      type="button" 
                      class="btn btn-danger" 
                      @click.prevent="delete_tag()">Delete</button>
                  </div>
                </form>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h4 class="card-title">New Tag</h4>
                <form @submit.prevent="create_tag()">
                  <div 
                    v-show="alerts.new.success" 
                    class="alert alert-success text-center"><font-awesome-icon icon="thumbs-up" /></div>
                  <div 
                    v-show="alerts.new.error" 
                    class="alert alert-danger text-center">Error creating user.</div>
                  <div class="form-group">
                    <input 
                      v-model="new_tag.title" 
                      type="text" 
                      placeholder="Title" 
                      class="form-control" >
                  </div>
                  <div class="form-group">
                    <textarea 
                      v-model="new_tag.content" 
                      placeholder="Description" 
                      class="form-control"/>
                  </div>
                  <div class="form-group">
                    <button 
                      type="submit" 
                      class="btn btn-primary">Create</button>
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
  name: "TagsList",
  components: {
    Navigation
  },
  data() {
    return {
      tags: [],
      selected_tag: null,
      selected_index: null,
      new_tag: {
        username: null,
        password: null,
        email: null
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
    this.getTags();
  },
  methods: {
    getTags() {
      this.axios
        .get(`${this.api}/tags`)
        .then(res => {
          this.tags = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectTag(index) {
      this.selected_tag = this.tags[index];
      this.selected_index = index;
    },
    create_tag() {
      this.alerts.new.success = false;
      this.alerts.new.error = false;
      this.axios
        .post(`${this.api}/tags`, this.new_tag)
        .then(res => {
          if (res.data.error == 0) {
            this.alerts.new.success = true;

            this.tags.push(res.data.tag);
          } else {
            this.alerts.new.error = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    edit_tag() {
      this.alerts.edit.success = false;
      this.alerts.edit.error = false;
      this.axios
        .put(`${this.api}/tags/${this.selected_tag._id}`, {
          title: this.selected_tag.title,
          content: this.selected_tag.content
        })
        .then(res => {
          if (res.data.error == 0) {
            this.alerts.edit.success = true;
            // Change username in array from index.
            this.tags[this.selected_index].title = this.selected_tag.title;
            this.tags[this.selected_index].content = this.selected_tag.content;
          } else {
            this.alerts.edit.error = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delete_tag() {
      this.axios
        .post(`${this.api}/tags/delete/${this.selected_tag._id}`)
        .then(res => {
          if (res.data.error == 0) {
            this.tags.splice(this.selected_index, 1);

            // Clear variables.
            this.selected_tag = null;
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
