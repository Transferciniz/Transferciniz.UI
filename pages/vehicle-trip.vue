<template>
  <div class="h-screen w-screen">
    <div id="driver-map" class="h-screen w-screen fixed top-0 left-0"></div>
    <div class="fixed bg-gray-900 bottom-0 left-0 w-screen h-1/2" v-if="isWaypointUsersVisible">
      <div class="flex flex-col w-full">
        <p>Duraktaki Kişileri Onaylayın</p>
        <div v-for="user in waypointUsers">{{user.name}} {{user.surname}}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


definePageMeta({
  layout: "fullscreen",
})

const {$L: L} = useNuxtApp();
const map = ref<L.Map>();

const waypointIndex = ref(0);
const isWaypointUsersVisible = ref(false);
const waypointUsers = computed(() => selectedTrip.value?.trip.waypoints[waypointIndex.value].users)

const {
  selectedTrip
} = storeToRefs(useDriverStore());

const {
  location
} = storeToRefs(useLocationStore());

onMounted(() => {
  map.value = useMap('driver-map');
  useRouting(map.value!, selectedTrip.value!.trip.waypoints)
})

watch(location, (newLocation) => {
  const currentLocation = new L.LatLng(newLocation.latitude, newLocation.longitude)
  const {longitude, latitude} = selectedTrip.value!.trip.waypoints[waypointIndex.value]
  const distance = currentLocation.distanceTo(new L.LatLng(latitude, longitude))
  if(distance < 100) isWaypointUsersVisible.value = true
})




</script>