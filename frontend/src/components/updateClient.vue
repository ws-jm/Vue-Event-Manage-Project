<script>
import useVuelidate from "@vuelidate/core";
import { required, email, alpha, numeric, maxLength,minLength } from "@vuelidate/validators";
import VueMultiselect from "vue-multiselect";
import axios from "axios";
import { DateTime } from "luxon";

export default {
  props: ["id"],
  components: { VueMultiselect },
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  data() {
    return {
      //for multi select
      eventsChosen: [],
      //for multi select event Data
      eventData: [],
      // Client Data
      client: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumbers: 
          {
            primaryPhone: "",
            secondaryPhone: "",
          },
        address: {
          line1: "",
          line2: "",
          city: "",
          county: "",
          state: "",
          zip: "",
        },
      },
      // list of events shown in table
      clientEvents: [],
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  beforeMount() {
    axios
      .get(
        import.meta.env.VITE_ROOT_API +
          `/primarydata/id/${this.$route.params.id}`
      )
      .then((resp) => {
        let data = resp.data[0];
        console.log(data)
        this.client.firstName = data.firstName;
        this.client.middleName = data.middleName;
        this.client.lastName = data.lastName;
        this.client.email = data.email;
        this.client.phoneNumbers.primaryPhone =
          data.phoneNumbers.primaryPhone;
        this.client.phoneNumbers.secondaryPhone =
          data.phoneNumbers.secondaryPhone;
        this.client.address.line1 = data.address.line1;
        this.client.address.line2 = data.address.line2;
        this.client.address.city = data.address.city;
        this.client.address.county = data.address.county;
        this.client.address.state = data.address.state;
        this.client.address.zip = data.address.zip;
      });
    axios
      .get(
        import.meta.env.VITE_ROOT_API +
          `/eventdata/client/${this.$route.params.id}`
      )
      .then((resp) => {
        let data = resp.data;
        resp.data.forEach((event) => {
          this.clientEvents.push({
            eventName: event.eventName,
            eventDate: event.date,
          });
        });
      });
    axios.get(import.meta.env.VITE_ROOT_API + `/eventdata`).then((resp) => {
      let data = resp.data;
      for (let i = 0; i < data.length; i++) {
        this.eventData.push({
          eventName: data[i].eventName,
          _id: data[i]._id,
          attendees: data[i].attendees,
        });
      }
    });
  },
  methods: {
    formattedDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
    },
    async handleClientUpdate() {
      console.log(this.v$.client.phoneNumbers.primaryPhone.$error)
      const isFormCorrect = await this.v$.$validate();
      if (isFormCorrect) {
      let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/updateClient/${this.id}`;
      axios.put(apiURL, this.client).then(() => {
        alert("Update has been saved.");
        this.$router.back().catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
            console.log(error);
      });
    }
    },
    async addToEvent() {
      const isFormCorrect = await this.v$.$validate();
      if (isFormCorrect) {
      this.eventsChosen.forEach((event) => {
        let apiURL =
          import.meta.env.VITE_ROOT_API + `/eventdata/addAttendee/` + event._id;
        axios.put(apiURL, { attendee: this.$route.params.id }).then(() => {
          this.clientEvents = [];
          axios
            .get(
              import.meta.env.VITE_ROOT_API +
                `/eventdata/client/${this.$route.params.id}`
            )
            .then((resp) => {
              let data = resp.data;
              for (let i = 0; i < data.length; i++) {
                this.clientEvents.push({
                  eventName: data[i].eventName,
                });
              }
            });
        });
      });
    }
    },
  },
  validations() {
    return {
      client: {
        firstName: { required, alpha },
        lastName: { required, alpha },
        email: { email },
        phoneNumbers: 
          {
            primaryPhone: { required, numeric, maxLength: maxLength(10), minLength: minLength(10) },
            secondaryPhone: {numeric,maxLength: maxLength(10), minLength: minLength(10) },
          },
      },
    };
  },
};
</script>
<template>
  <main>
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Update Client</h1>
    <div class="px-10 py-20">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
          <h2 class="text-2xl font-bold">Personal Details</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">First Name</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="client.firstName"
              />
              <span class="text-black" v-if="v$.client.firstName.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.firstName.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p>
              </span>
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Middle Name</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="client.middleName"
              />
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Last Name</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="client.lastName"
              />
              <span class="text-black" v-if="v$.client.lastName.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.lastName.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p>
              </span>
            </label>
          </div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Email</span>
              <input
                type="email"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                v-model="client.email"
              />
              <span class="text-black" v-if="v$.client.email.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.email.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p>
              </span>
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Phone Number</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                v-model="client.phoneNumbers.primaryPhone"
              />
              <span class="text-black" v-if="v$.client.phoneNumbers.primaryPhone.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.client.phoneNumbers.primaryPhone.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p>
              </span>
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Alternative Phone Number</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                v-model="client.phoneNumbers.secondaryPhone"
              />
            </label>
          </div>
        </div>

        <!-- grid container -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
          <h2 class="text-2xl font-bold">Address Details</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 1</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.line1"
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 2</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.line2"
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">City</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.city"
              />
            </label>
          </div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">County</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.county"
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Zip Code</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.zip"
              />
            </label>
          </div>
            <!-- form field -->
                    <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">State</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="client.address.state"
              />
            </label>
          </div>
          <div></div>
        </div>
        <div></div>
        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <div></div>
          <div class="flex justify-between mt-10 mr-20">
            <button
              @click="handleClientUpdate"
              type="submit"
              class="bg-red-700 text-white rounded"
            >Update Client</button>
          </div>
       
          <div class="flex justify-between mt-10 mr-20">
            <button
              type="reset"
              class="border border-red-700 bg-white text-red-700 rounded"
              @click="$router.go(-1)"
            >Go back</button>
          </div>
        </div>

        <hr class="mt-10 mb-10" />

        <!-- Client Event Information -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Events for Client</h2>

          <div class="flex flex-col col-span-2">
            <table class="min-w-full shadow-md rounded">
              <thead class="bg-gray-50 text-xl">
                <tr>
                  <th class="p-4 text-left">Event Name</th>
                  <th class="p-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-300">
                <tr v-for="event in clientEvents" :key="event._id">
                  <td class="p-2 text-left">{{ event.eventName }}</td>
                  <td class="p-2 text-left">{{ formattedDate(event.eventDate) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex flex-col">
            <label class="typo__label">Select Events to be added</label>
            <VueMultiselect
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="eventsChosen"
              :options="eventData"
              :multiple="true"
              label="eventName"
            ></VueMultiselect>
            <div class="flex justify-between">
              <button
                @click="addToEvent"
                type="submit"
                class="mt-5 bg-red-700 text-white rounded"
              >Add Client to Events</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
