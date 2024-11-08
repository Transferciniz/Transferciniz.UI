<template>
  <div class="h-screen w-screen">
    <div ref="mapBoxContainer"  class="h-screen w-screen fixed top-0 left-0"></div>
    <div class="fixed w-screen bottom-10 left-0 flex justify-center">
      <div class="bg-red-600 text-white text-center px-8 py-2" @click="getRouteForStartPoint">Başlangıç Konumuna Navigasyon Başlat</div>
    </div>
  </div>
</template>

<script setup lang="ts">


definePageMeta({
  layout: "fullscreen",
})
const mapBoxContainer = ref();
const mapbox = ref()

const waypointIndex = ref(0);
const isWaypointUsersVisible = ref(false);
const isNavigationStarted = ref(false);
const waypointUsers = computed(() => selectedTrip.value?.trip.waypoints[waypointIndex.value].users)

const {
  selectedTrip
} = storeToRefs(useVehicleModeStore());

const {
  location,
  bearing
} = storeToRefs(useLocationStore());

watch(location, value => {
  if(isNavigationStarted.value){
    mapbox.value?.easeTo({
      center: [value.longitude, value.latitude],
      bearing: bearing.value ?? 0,
      pitch: 60,  // Navigasyon gibi bir bakış açısı için eğim
      duration: 1000,
      zoom: 18
    })
  }
})

/*
watch(bearing, value => {
  if(isNavigationStarted.value){
    mapbox.value?.easeTo({
      center: [location.value.longitude, location.value.latitude],
      bearing: value ?? 0,
      pitch: 60,  // Navigasyon gibi bir bakış açısı için eğim
      duration: 1000,
      zoom: 18
    })
  }
})*/

function getRouteForStartPoint(){
  useMapbox().fetchRouteData([
      {latitude: location.value.latitude, longitude: location.value.longitude},
      {longitude: selectedTrip.value!.trip.waypoints[0].longitude, latitude: selectedTrip.value!.trip.waypoints[0].latitude},
  ]).then(res => {
    useMapbox().drawRoute(mapbox.value!, res, 'startNavigationSource', 'startNavigationLayer', false);
    mapbox.value?.easeTo({
      center: [location.value.longitude, location.value.latitude],
      bearing: bearing.value ?? 0,
      pitch: 60,  // Navigasyon gibi bir bakış açısı için eğim
      duration: 3000,
      zoom: 18
    })
    isNavigationStarted.value = true;
  })
}

onMounted(() => {
  mapbox.value = useMapbox().createMap(mapBoxContainer.value, {latitude: 0, longitude:0});
  useMapbox().fetchRouteData(selectedTrip.value!.trip.waypoints as any[]).then((res) => {
   /* useMapbox().drawRoute(mapbox.value, res)
    setTimeout(() => {
      mapbox.value?.easeTo({
        center: [selectedTrip.value!.trip.waypoints[0].longitude, selectedTrip.value!.trip.waypoints[0].latitude],
        bearing: bearing.value ?? 0,
        pitch: 60,  // Navigasyon gibi bir bakış açısı için eğim
        duration: 3000,
        zoom: 18
      })
    }, 5000)*/
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