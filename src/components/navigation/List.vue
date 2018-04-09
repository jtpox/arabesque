<template>
    <div class="row no-gutters wrapper">
        <Navigation></Navigation>
        <div class="col-md-10 main-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-9">

                        <div class="page-header">
                            <h1>Navigation</h1>
                        </div>

                        <draggable v-model="links" :options="{ handle: '.movable' }" class="list-group list-group-flush">
                            <a href="#" class="list-group-item" v-for="(link, index) in links" :key="index" v-on:click.prevent="editLink(index)">
                                <div class="justify-content-between">
                                    <h5><i class="fas fa-arrows-alt-v movable"></i> {{ link.title }}</h5>
                                    <small v-if="link.link">Link: {{ link.link }}</small>
                                    <small v-if="link.page">Page: {{ link.page.title }}</small>
                                </div>
                            </a>
                        </draggable>
                    </div>

                    <div class="col-md-3">
                        <div class="alert alert-success text-center" v-show="alerts.update.success"><i class="far fa-thumbs-up"></i></div>
                        <div class="alert alert-danger text-center" v-show="alerts.update.error">Error saving.</div>
                        <div class="card">
                            <div class="card-body">
                                <p class="card-text">
                                    <button type="button" class="btn btn-success btn-lg btn-block" v-on:click.prevent="saveChanges()">Save Changes</button>
                                </p>
                            </div>
                        </div>

                        <div class="card" v-show="edit.index !== null">
                            <div class="card-body">
                                <h4 class="card-title">Edit Link</h4>
                                <form v-on:submit.prevent="changeEdit(edit.index)">
                                    <div class="form-group">
                                        <input type="text" class="form-control" placeholder="Title" v-model="edit.title" />
                                    </div>

                                    <div class="form-group input-group">
                                        <div class="input-group-prepend">
                                            <select v-model="edit.selection" class="form-control">
                                                <option value="1">Link</option>
                                                <option value="2">Page</option>
                                            </select>
                                        </div>
                                        <input type="text" class="form-control" placeholder="URL" v-show="edit.selection == 1" v-model="edit.url" />

                                        <select v-model="edit.page" class="form-control" v-show="edit.selection == 2">
                                            <option v-for="(page, index) in pages" :key="index" :value="index">{{ page.title }}</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <button type="submit" class="btn btn-primary">Edit</button>
                                        <button type="button" class="btn btn-danger" v-on:click.prevent="deleteLink(edit.index)">Delete</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Add Link</h4>
                                <form v-on:submit.prevent="addLink()">
                                    <div class="form-group">
                                        <input type="text" class="form-control" placeholder="Title" v-model="add.title" />
                                    </div>

                                    <div class="form-group input-group">
                                        <div class="input-group-prepend">
                                            <select v-model="add.selection" class="form-control">
                                                <option value="1">Link</option>
                                                <option value="2">Page</option>
                                            </select>
                                        </div>
                                        <input type="text" class="form-control" placeholder="URL" v-show="add.selection == 1" v-model="add.url" />

                                        <select v-model="add.page" class="form-control" v-show="add.selection == 2">
                                            <option v-for="(page, index) in pages" :key="page._id" :value="index">{{ page.title }}</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <button type="submit" class="btn btn-primary" >Add</button>
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
import Navigation from "../Navigation.vue"
import draggable from 'vuedraggable'

export default {
  name: "NavigationList",
  components: {
    Navigation,
    draggable,
  },
  created() {
    this.getPages();
    this.getNav();
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
        url: null,
        page: null
      },
      edit: {
          index: null,
          selection: 1, // 1 = link, 2 = page
          title: null,
          url: null,
          page: null,
      }
    };
  },
  methods: {
    getNav() {
      this.axios
        .get(this.api + "/nav")
        .then(res => {
          // console.log(res.data)
          this.links = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getPages() {
      this.axios
        .get(this.api + "/pages/admin")
        .then(res => {
          this.pages = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    addLink() {
      if (this.add.selection == 1) {
        this.links.push({
          title: this.add.title,
          link: this.add.url
        });
      } else if(this.add.selection == 2) {
        this.links.push({
            title: this.add.title,
            page: this.pages[this.add.page]
        })
        //console.log(this.pages[this.add.page])
      }

      // Clear inputs
        this.add.title = null
        this.add.url = null
        this.add.page = null
    },
    editLink(index) {
        this.edit.index = index
        this.edit.title = this.links[index].title
        
        if (this.links[index].link){
            this.edit.selection = 1
            this.edit.url = this.links[index].link
        } else if(this.links[index].page) {
            this.edit.selection = 2
        }
    },
    changeEdit(index) {
        this.links[index].title = this.edit.title
        //console.log(this.links[index])
        if (this.edit.selection == 1){
            this.links[index].url = this.edit.url
        } else if(this.edit.selection == 2) {
            this.links[index].page = this.pages[this.edit.page]
        }
    },
    deleteLink(index) {
        //Reset edit.
        this.edit.index = null
        this.edit.selection = 1
        this.edit.title = null
        this.edit.url = null
        this.edit.page = null

        this.links.splice(index, 1)
    },
    saveChanges() {
        var data = []
        for (var i = 0; i < this.links.length; i++){
            if (this.links[i].page){
                data.push({
                    title: this.links[i].title,
                    page: this.links[i].page._id,
                })
            } else if(this.links[i].url) {
                data.push({
                    title: this.links[i].title,
                    url: this.links[i].url,
                })
            }
        }

        this.axios.post(this.api + '/nav', { nav: JSON.stringify(data) }).then((res) => {
            if (res.data.error == 0){
                this.alerts.update.success = true;
            } else {
                this.alerts.update.error = true;
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
  }
};
</script>
