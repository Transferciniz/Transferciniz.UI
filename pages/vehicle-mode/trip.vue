<template>
  <div class="h-screen w-screen">
    <div ref="mapBoxContainer"  class="h-screen w-screen fixed top-0 left-0"></div>
    <div class="fixed bg-gray-900 bottom-0 left-0 w-screen h-1/2 rounded-t-2xl" v-if="isWaypointUsersVisible">
      <div class="flex flex-col h-full w-full px-4 pt-4 gap-y-2">
        <p>Duraktaki Kişileri Onaylayın</p>
        <div v-for="user in waypointUsers" class="bg-gray-800 rounded-md px-4 py-2 flex justify-between items-center">
          <p>{{user.name}} {{user.surname}}</p>
          <label class="inline-flex items-center me-5 cursor-pointer">
            <input type="checkbox" :value="false" class="sr-only peer" >
            <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Geldi</span>
          </label>
        </div>
        <div class="flex-grow flex justify-center items-end">
          <div class="bg-green-900 text-white w-1/2 my-2 text-center rounded-md py-2" @click="nextWaypoint">Onayla</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


definePageMeta({
  layout: "fullscreen",
})
const mapBoxContainer = ref();
const mapboxgl = ref()

const waypointIndex = ref(0);
const isWaypointUsersVisible = ref(false);
const waypointUsers = computed(() => selectedTrip.value?.trip.waypoints[waypointIndex.value].users)

const {
  selectedTrip
} = storeToRefs(useVehicleModeStore());

const {
  location
} = storeToRefs(useLocationStore());

onMounted(() => {
  mapboxgl.value = useMapbox().createMap(mapBoxContainer.value, {latitude: 0, longitude:0});
  useMapbox().fetchRouteData(selectedTrip.value!.trip.waypoints as any[]).then((res) => {
    useMapbox().drawRoute(mapboxgl.value, res)

  })
})

watch(location, (newLocation) => {
  if(waypointIndex.value == selectedTrip.value!.trip.waypoints.length - 1) {
    isWaypointUsersVisible.value = false;
  }else{
    const currentLocation = new L.LatLng(newLocation.latitude, newLocation.longitude)
    const {longitude, latitude} = selectedTrip.value!.trip.waypoints[waypointIndex.value]
    const distance = currentLocation.distanceTo(new L.LatLng(latitude, longitude))
    if(distance < 100) isWaypointUsersVisible.value = true
  }
})

function nextWaypoint() {
  waypointIndex.value = waypointIndex.value + 1
  isWaypointUsersVisible.value = false;
}




</script>