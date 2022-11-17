<template>
    <h2 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10 mb-5">Total</h2>
    <table class="table border p-2" id="datatable">
    <thead>
        <tr>
        <th class="border">ID</th>
        <th class="border">Event Name</th>
        <th class="border">Description</th>
        <th class="border">Event Count</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="item in products" :key="item.id">
        <td class="border">{{item.id}}</td>
        <td class="border">{{item.event_Name}}</td>
        <td class="border">{{item.description}}</td>
        <td class="border">{{item.event_Count}}</td>
        </tr>       
    </tbody>
    </table>    
</template>
 
<script>

  import axios from "axios";

  export default {
    data: function() {
        return {
            products:[],
        }
    },
    beforeMount() {
      axios
        .get(
          import.meta.env.VITE_ROOT_API + `/eventdata/allData`
        )
        .then((resp) => {
          let data = resp.data;
          for(let i = 0; i < data.length; i++){
            if(data[i].attendees != ""){
              this.products.push({
                id : i+1,
                event_Name : data[i].eventName,
                description : data[i].description,
                event_Count : data[i].attendees.length
              })
            }         
          }
        });
    }
  }
</script>