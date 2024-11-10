<template>
  <div class="h-screen w-screen">
    <div ref="mapBoxContainer"  class="h-screen w-screen fixed top-0 left-0"></div>
    <div class="fixed w-screen bottom-10 left-0 flex justify-center">
      <div class="bg-red-600 text-white text-center px-8 py-2 rounded-md" @click="getRouteForStartPoint">Navigasyon Başlat</div>
    </div>

    <UDrawer
        v-if="selectedWaypoint"
        :title="selectedWaypoint.name + ' Durağına Geldiniz'"
        description="Lütfen araca binen kişileri onaylayınız."
        :open="isWaypointDrawerOpen"
    >
      <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

      <template #body>
        <div class="mx-4 rounded-t-md bg-gray-900 flex flex-col w-full p-4">
          <div class="flex justify-between items-center mt-2" v-for="user in selectedWaypoint.users">
            <div class="flex flex-col rounded-md p-4 justify-center items-center">
              <UAvatar :src="user.profilePicture" :alt="user.name + ' ' + user.surname " size="xl" />
              <p class="text-lg">{{user.name}}</p>
              <p class="text-xs">{{user.surname}}</p>
            </div>
            <CustomerCheckBox :is-came="user.isCame" />
          </div>
        </div>

      </template>
    </UDrawer>
  </div>
</template>

<script setup lang="ts">


import mapboxgl from "mapbox-gl";
import type {IWayPointDto} from "~/core/api/modules/trip/models/IWayPointDto";

definePageMeta({
  layout: "fullscreen",
})
const mapBoxContainer = ref();
const mapbox = ref()

const isNavigationStarted = ref(false);
const carMarker = ref<mapboxgl.Marker>();
const selectedWaypoint = ref<IWayPointDto>();
const isWaypointDrawerOpen = ref(false);
const {
  selectedTrip
} = storeToRefs(useVehicleModeStore());

const {
  location,
  bearing
} = storeToRefs(useLocationStore());

watch(location, value => {
  carMarker.value?.setLngLat([location.value.longitude, location.value.latitude]);
  checkWaypointDistances(value);
  if(isNavigationStarted.value){
    mapbox.value?.easeTo({
      center: [value.longitude, value.latitude],
      bearing: bearing.value ?? 0,
      duration: 1000,
    })
  }
})


watch(bearing, value => {
  if(isNavigationStarted.value && value){
    mapbox.value?.easeTo({
      center: [location.value.longitude, location.value.latitude],
      bearing: value,
      duration: 1000,
    })
  }
})

function checkWaypointDistances(value: any){
  selectedTrip.value?.trip.waypoints.forEach(waypoint => {
    if(useHaversineDistance([value.longitude, value.latitude], [waypoint.longitude, waypoint.latitude]) < 70){
      selectedWaypoint.value = waypoint;
      isWaypointDrawerOpen.value = true;
    }
  })
}

function getRouteForStartPoint(){
  useMapbox().fetchRouteData([
      {latitude: location.value.latitude, longitude: location.value.longitude},
      {longitude: selectedTrip.value!.trip.waypoints[0].longitude, latitude: selectedTrip.value!.trip.waypoints[0].latitude},
  ]).then(res => {
    useMapbox().drawRoute(mapbox.value!, res, 'startNavigationSource', 'startNavigationLayer', false);
    mapbox.value?.easeTo({
      center: [location.value.longitude, location.value.latitude],
      bearing: bearing.value ?? 0,
     // pitch: 60,  // Navigasyon gibi bir bakış açısı için eğim
      duration: 0,
      zoom: 18
    })
    isNavigationStarted.value = true;
  })
}

onMounted(() => {
  mapbox.value = useMapbox().createMap(mapBoxContainer.value, {latitude: 0, longitude:0}, false);
  useMapbox().fetchRouteData(selectedTrip.value!.trip.waypoints as any[]).then((res) => {
    useMapbox().drawRoute(mapbox.value, res)
    carMarker.value = new mapboxgl.Marker({
      element: useMapbox().createCustomerCarMarker(),
      draggable: false,
    }).setLngLat([location.value.longitude, location.value.latitude]).addTo(mapbox.value!);
    selectedTrip.value!.trip.waypoints.forEach((waypoint, index) => {
      if(index === selectedTrip.value!.trip.waypoints.length-1){
        new mapboxgl.Marker({
          element: useMapbox().createFinishMarker(),
          draggable: false,
        }).setLngLat([waypoint.longitude, waypoint.latitude]).addTo(mapbox.value!);
      }else{
        const waypointMarker = new mapboxgl.Marker({
          element: useMapbox().createWaypointMarker(waypoint.users.length),
          draggable: false,

        }).setLngLat([waypoint.longitude, waypoint.latitude]).addTo(mapbox.value!);
        waypointMarker.getElement().addEventListener('click', () => {
          selectedWaypoint.value = waypoint
        })
      }

    })
  })
})






</script>