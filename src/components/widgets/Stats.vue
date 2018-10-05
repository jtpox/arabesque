<template>
  <div>
    <button 
      type="button" 
      class="btn btn-info btn-block" 
      @click.prevent="statModal">Stats</button>
    <b-modal 
      ref="statModal" 
      title="Statistics" 
      size="lg" 
      hide-footer>
      <div class="d-block black">
        <b-input-group prepend="Days">
          <input
            v-model="days"
            type="text"
            class="form-control">
          <b-input-group-append>
            <button
              class="btn btn-primary"
              @click.prevent="getStat">Update</button>
          </b-input-group-append>
        </b-input-group>
      </div>
      <b-tabs>
        <b-tab
          title="Graph"
          active>
          <div class="d-block">
            <h5>Visitors</h5>
            <line-chart 
              :data="statDate" 
              :empty="{ empty: 'No data available.' }"/>
          </div>
          <b-container fluid>
            <b-row>
              <b-col cols="6">
                <h5>Browsers</h5>
                <pie-chart 
                  :data="statBrowser" 
                  :empty="{ empty: 'No data available.' }"/>
              </b-col>
                    
              <b-col cols="6">
                <h5>Platforms</h5>
                <pie-chart 
                  :data="statOs" 
                  :empty="{ empty: 'No data available.' }"/>
              </b-col>
            </b-row>
          </b-container>
        </b-tab>

        <b-tab title="Log">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Address</th>
                <th scope="col">Platform</th>
                <th scope="col">Browser</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="log in statLog"
                :key="log._id">
                <td scope="row">{{ log.created_at | formatDate }}</td>
                <td>{{ log.address }}</td>
                <td>{{ log.platform }}</td>
                <td>{{ log.browser }}</td>
              </tr>
            </tbody>
          </table>
        </b-tab>
      </b-tabs>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: "Stats",
  props: {
    post: String,
    page: String
  },
  data() {
    return {
      days: 7,
      statDate: [],
      statBrowser: [],
      statOs: [],
      statLog: []
    };
  },
  methods: {
    statModal() {
      this.getStat();
      this.$refs.statModal.show();
    },
    getStat() {
      const url =
        this.post == null
          ? `/pages/${this.page}/stat/${this.days}`
          : `/blog/${this.post}/stat/${this.days}`;

      this.axios
        .get(`${this.api + url}/number`)
        .then(res => {
          // console.log(res);
          this.statDate = res.data;
        })
        .catch(err => {
          console.log(err);
        });

      this.axios
        .get(`${this.api + url}/browser`)
        .then(res => {
          // console.log(res);
          this.statBrowser = res.data;
        })
        .catch(err => {
          console.log(err);
        });

      this.axios
        .get(`${this.api + url}/platform`)
        .then(res => {
          // console.log(res);
          this.statOs = res.data;
        })
        .catch(err => {
          console.log(err);
        });

      this.axios
        .get(`${this.api + url}/log`)
        .then(res => {
          this.statLog = res.data;
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style>
.black {
  background: rgba(60, 59, 61, 0.2);
  /* Margin & Padding */
  padding: 20px;
  margin: 0 -20px 20px -20px;
}
</style>
