<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    </div>

    <div class="padding">
        <BarChart :chartData="chartData"/>
        <Table/>
    </div>

  </main>
</template>
<script>

import BarChart from './barChart';
import Table from './Table.vue';
import axios from "axios";

export default {
  data() {
    return{
      chartData : {
        labels: [],
        datasets: []
      },
      length : [],
    }
  },
  components: {
    BarChart,
    Table
  },
  methods: {
    routePush(routeName) {
      this.$router.push({ name: routeName });
    },
  },
  beforeMount() {
    axios
      .get(
        import.meta.env.VITE_ROOT_API + `/eventdata/allData`
      )
      .then((resp) => {
        let data = resp.data;
        for(let i = 0; i < data.length; i++){
          this.chartData.labels.push(data[i].eventName);
          this.length.push(data[i].attendees.length);
        }

        this.chartData.datasets.push({
          label: 'Number of event requests',
          backgroundColor: '#f87979',
          data : this.length
        });

      });
  }
};
</script>
