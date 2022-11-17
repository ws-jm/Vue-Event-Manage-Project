<template>
  <main class="flex flex-row">
    <div id="_container">
      <header class="w-full">
        <section class="text-center">
          <img class="m-auto" src="@\assets\DanPersona.svg" />
        </section>
        <nav class="mt-10">
          <ul class="flex flex-col gap-4">
            <li>
              <router-link to="/">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >dashboard</span
                >
                Dashboard
              </router-link>
            </li>
            <li>
              <router-link to="/intakeform">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >people</span
                >
                Client Intake Form
              </router-link>
            </li>
            <li>
              <router-link to="/eventform">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >event</span
                >
                Create Event
              </router-link>
            </li>
            <li>
              <router-link to="/findclient">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >search</span
                >
                Find Client
              </router-link>
            </li>
            <li>
              <router-link to="/findEvents">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >search</span
                >
                Find Event
              </router-link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
    <div class="grow w-4/5">
      <section
        class="justify-end items-center h-24 flex"
        style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)"
      >
        <!-- for every object in the queryData response it will display the organization name
          since there is only 1 that is going to be returned, since it uses unique id, 
          it is only going to display the name of the org that is currently running the backend instance
     -->
        <h1
          class="mr-20 text-3xl text-white"
          v-for="org in queryData"
          :key="org"
        >
          {{ org.name }}
        </h1>
      </section>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>


<script>
import axios from "axios";

export default {
  name: "App",
  // return the queryData that is retrieved from the api request
  data() {
    return {
      queryData: [],
    };
  },
  mounted() {
    // make a api request to get the orgName then store it in the queryData variable
    let apiURL = import.meta.env.VITE_ROOT_API + `/orgData/orgName`;
    this.queryData = [];
    axios.get(apiURL).then((resp) => {
      this.queryData = resp.data;
    });
    window.scrollTo(0, 0);
  },
};
</script>

<style>
#_container {
  background-color: #c8102e;
  color: white;
  padding: 18px;
}
</style>
