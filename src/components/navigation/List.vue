<template>
  <div class="row no-gutters wrapper">
    <Navigation/>
    <div class="col-md-10 main-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-9">

            <div class="page-header">
              <h1>Navigation</h1>
            </div>

            <div
              v-show="links.length < 1"
              class="alert alert-warning">
              Navigation is empty.
            </div>

            <draggable 
              v-model="links" 
              :options="{ handle: '.movable' }" 
              class="list-group list-group-flush">
              <a 
                v-for="(link, index) in links" 
                :key="index" 
                href="#" 
                class="list-group-item" 
                @click.prevent="editLink(index)">
                <div class="justify-content-between">
                  <h5><span class="badge badge-danger movable"><i class="fas fa-arrows-alt-v"/></span> {{ link.title }}</h5>
                  <small v-if="link.link !== undefined">Link: {{ link.link }}</small>
                  <small v-if="link.page !== undefined">Page: {{ translatePage(link.page).title }}</small>
                </div>
              </a>
            </draggable>
          </div>

          <div class="col-md-3">
            <div 
              v-show="alerts.update.success" 
              class="alert alert-success text-center"><i class="far fa-thumbs-up"/></div>
            <div 
              v-show="alerts.update.error" 
              class="alert alert-danger text-center">Error saving.</div>
            <div class="card">
              <div class="card-body">
                <p class="card-text">
                  <button 
                    type="button" 
                    class="btn btn-success btn-lg btn-block" 
                    @click.prevent="saveChanges()">Save Changes</button>
                </p>
              </div>
            </div>

            <div 
              v-show="edit.index !== null" 
              class="card">
              <div class="card-body">
                <h4 class="card-title">Edit Link</h4>
                <form @submit.prevent="changeEdit(edit.index)">
                  <div class="form-group">
                    <input 
                      v-model="edit.title" 
                      type="text" 
                      class="form-control" 
                      placeholder="Title" >
                  </div>

                  <div class="form-group input-group">
                    <div class="input-group-prepend">
                      <select 
                        v-model="edit.selection" 
                        class="form-control">
                        <option value="1">Link</option>
                        <option value="2">Page</option>
                      </select>
                    </div>
                    <input 
                      v-show="edit.selection == 1" 
                      v-model="edit.link" 
                      type="text" 
                      class="form-control" 
                      placeholder="URL" >

                    <select 
                      v-show="edit.selection == 2" 
                      v-model="edit.page" 
                      class="form-control">
                      <option 
                        v-show="edit.page" 
                        :value="translatePage(edit.page)._id" 
                        selected>{{ translatePage(edit.page).title }}</option>
                      <option 
                        v-for="(page, index) in pages" 
                        v-if="!(translatePage(edit.page)._id == page._id)" 
                        :value="page._id">{{ page.title }}</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <button 
                      type="submit" 
                      class="btn btn-primary">Edit</button>
                    <button 
                      type="button" 
                      class="btn btn-danger" 
                      @click.prevent="deleteLink(edit.index)">Delete</button>
                  </div>
                </form>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h4 class="card-title">Add Link</h4>
                <form @submit.prevent="addLink()">
                  <div class="form-group">
                    <input 
                      v-model="add.title" 
                      type="text" 
                      class="form-control" 
                      placeholder="Title" >
                  </div>

                  <div class="form-group input-group">
                    <div class="input-group-prepend">
                      <select 
                        v-model="add.selection" 
                        class="form-control">
                        <option value="1">Link</option>
                        <option value="2">Page</option>
                      </select>
                    </div>
                    <input 
                      v-show="add.selection == 1" 
                      v-model="add.link" 
                      type="text" 
                      class="form-control" 
                      placeholder="URL" >

                    <select 
                      v-show="add.selection == 2" 
                      v-model="add.page" 
                      class="form-control">
                      <option 
                        v-for="(page, index) in pages" 
                        :key="page._id" 
                        :value="page._id">{{ page.title }}</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <button 
                      type="submit" 
                      class="btn btn-primary" >Add</button>
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
import draggable from "vuedraggable";
import Navigation from "../Navigation.vue";

export default {
  name: "NavigationList",
  components: {
    Navigation,
    draggable
  },
  data() {
    return {
      links: [],
      pages: [],
      alerts: {
        update: {
          success: false,
          error: false
        }
      },
      add: {
        selection: 1, // 1 = link, 2 = page
        title: null,
        link: null,
        page: null
      },
      edit: {
        index: null,
        selection: 1, // 1 = link, 2 = page
        title: null,
        link: null,
        page: null
      }
    };
  },
  created() {
    this.getPages();
    this.getNav();
  },
  methods: {
    getNav() {
      this.axios
        .get(`${this.api}/nav`)
        .then(res => {
          // console.log(res.data)
          // this.links = res.data;
          res.data.forEach((item, index) => {
            if (item.page) {
              this.links.push({
                title: item.title,
                page: item.page._id
              });
            } else {
              this.links.push({
                title: item.title,
                link: item.link
              });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    getPages() {
      this.axios
        .get(`${this.api}/pages/admin`)
        .then(res => {
          this.pages = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    translatePage(id) {
      let page = "";
      this.pages.forEach((item, index) => {
        if (item._id === id) {
          page = item;
        }
      });
      // console.log(page);
      return page;
    },
    addLink() {
      if (this.add.selection == 1) {
        this.links.push({
          title: this.add.title,
          link: this.add.link
        });
      } else if (this.add.selection == 2) {
        this.links.push({
          title: this.add.title,
          page: this.add.page
        });
        // console.log(this.pages[this.add.page])
      }

      // Clear inputs
      this.add.title = null;
      this.add.link = null;
      this.add.page = null;
    },
    editLink(index) {
      this.edit.index = index;
      this.edit.title = this.links[index].title;
      // console.log(this.links[index]);

      if (this.links[index].link) {
        this.edit.selection = 1;
        this.edit.link = this.links[index].link;
      } else if (this.links[index].page) {
        this.edit.selection = 2;
        this.edit.page = this.links[index].page;
      }
    },
    changeEdit(index) {
      if (this.edit.selection == 1) {
        this.$set(this.links, index, {
          title: this.edit.title,
          link: this.edit.link
        });
      } else if (this.edit.selection == 2) {
        this.$set(this.links, index, {
          title: this.edit.title,
          page: this.edit.page
        });
      }
    },
    deleteLink(index) {
      // Reset edit.
      this.edit.index = null;
      this.edit.selection = 1;
      this.edit.title = null;
      this.edit.link = null;
      this.edit.page = null;

      this.links.splice(index, 1);
    },
    saveChanges() {
      this.axios
        .post(`${this.api}/nav`, { nav: JSON.stringify(this.links) })
        .then(res => {
          if (res.data.error == 0) {
            this.alerts.update.success = true;
          } else {
            this.alerts.update.error = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
