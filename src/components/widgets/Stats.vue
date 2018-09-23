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
      statDate: [],
      statBrowser: [],
      statOs: []
    };
  },
  methods: {
    statModal() {
      this.getStat();
      this.$refs.statModal.show();
    },
    getStat(days = 7) {
      const url =
        this.post == null
          ? `/pages/${this.page}/stat/${days}`
          : `/blog/${this.post}/stat/${days}`;

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
    }
  }
};
</script>
