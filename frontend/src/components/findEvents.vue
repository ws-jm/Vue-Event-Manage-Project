<template>
  <main>
    <div>
      <h1
        class="
          font-bold
          text-4xl text-red-700
          tracking-widest
          text-center
          mt-10
        "
      >
        List of Events
      </h1>
    </div>
    <div class="px-10 pt-20">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
      >
        <h2 class="text-2xl font-bold">Search Event By</h2>
        <!-- Displays Client Name search field -->
        <div class="flex flex-col">
          <select
            
            class="
              rounded-md
              border-gray-300
              shadow-sm
              focus:border-indigo-300
              focus:ring
              focus:ring-indigo-200
              focus:ring-opacity-50
            "
            v-model="searchBy"
          >
            <option value="" disabled selected>Select your option</option>
            <option value="Event Name">Event Name</option>
            <option value="Event Date">Event Date</option>
          </select>
        </div>
        <div class="flex flex-col" v-if="searchBy === 'Event Name'">
          <label class="block">
            <input
              type="text"
              class="
                w-full
                rounded-md
                border-gray-300
                shadow-sm
                focus:border-indigo-300
                focus:ring
                focus:ring-indigo-200
                focus:ring-opacity-50
              "
              v-model="eventName"
              v-on:keyup.enter="handleSubmitForm"
              placeholder="Enter event name"
            />
          </label>
        </div>
        <!-- Displays event date search field -->
        <div class="flex flex-col" v-if="searchBy === 'Event Date'">
          <input
          placeholder="Test"
            class="
              w-full
              rounded-md
              border-gray-300
              shadow-sm
              focus:border-indigo-300
              focus:ring
              focus:ring-indigo-200
              focus:ring-opacity-50
            "
            type="date"
            v-model="eventDate"
            v-on:keyup.enter="handleSubmitForm"
          />
        </div>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
      >
        <div></div>
   
        <div class="mt-5 grid-cols-2">
         
          <button
            class="mr-10 border border-red-700 bg-white text-red-700 rounded"
            @click="clearSearch"
            type="submit"
          >
            Clear Search
          </button>
          <button
            class="bg-red-700 text-white rounded"
            @click="handleSubmitForm"
            type="submit"
          >
            Search Event
          </button>
        </div>
      </div>
    </div>

    <hr class="mt-10 mb-10" />
    <!-- Display Found Data -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
    >
      <div class="ml-10">
        <h2 class="text-2xl font-bold">List of Events</h2>
        <h3 class="italic">Click table row to edit/display an entry</h3>
      </div>
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Event Name</th>
              <th class="p-4 text-left">Event Date</th>
              <th class="p-4 text-left">Event Address</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr
              @click="editEvent(event._id)"
              v-for="event in queryData"
              :key="event._id"
            >
              <td class="p-2 text-left">{{ event.eventName }}</td>
              <td class="p-2 text-left">{{ formattedDate(event.date) }}</td>
              <!-- Used ? in event.address?.line1 in order to catch unreadable erros
              this is because if an event doesn not have an adress line then it will give you
              an error because there is no line1 attribute in the address object -->
              <td class="p-2 text-left">{{ event.address?.line1 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
<script>
import { DateTime } from "luxon";
import axios from "axios";

export default {
  data() {
    return {
      queryData: [],
      //Parameter for search to occur
      searchBy: "",
      eventName: "",
      eventDate: "",
    };
  },
  mounted() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/eventData/`;
    console.log()
    this.queryData = [];
    axios.get(apiURL).then((resp) => {
      this.queryData = resp.data;
    });
    window.scrollTo(0, 0);
  },
  methods: {
    formattedDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
    },
    handleSubmitForm() {
      let apiURL = "";
      if (this.searchBy === "Event Name") {
        apiURL =
          import.meta.env.VITE_ROOT_API +
          `/eventdata/search/?eventName=${this.eventName}&searchBy=name`;
      } else if (this.searchBy === "Event Date") {
        apiURL =
          import.meta.env.VITE_ROOT_API +
          `/eventdata/search/?eventDate=${this.eventDate}&searchBy=date`;
      }
      axios.get(apiURL).then((resp) => {
        this.queryData = resp.data;
      });
    },
    clearSearch() {
      //Resets all the variables
      this.searchBy = "";
      this.eventName = "";
      this.eventDate = "";

      //get all entries
      let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/`;
      this.queryData = [];
      axios.get(apiURL).then((resp) => {
        this.queryData = resp.data;
      });
    },
    editEvent(eventID) {
      this.$router.push({ name: "eventdetails", params: { id: eventID } });
    },
  },
};
</script>