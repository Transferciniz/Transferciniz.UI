<template>
  <div class="h-full w-full relative">
    <div ref="mapContainer" class="h-full w-full"></div>
    <div class="absolute w-full bottom-0 left-0 z-[10000] ">
      <div class="flex flex-col justify-center items-center p-4 gap-y-2">

        <div v-if="selectedTrip.status == TripStatus.Live && selectedTrip!!" class="flex flex-col justify-center items-center p-4 gap-y-2 w-full bg-gray-900 border-gray-700 border rounded-md">
          <div class="flex justify-between items-center w-full gap-x-2">
            <div class="flex justify-start items-center gap-x-2">
              <UAvatar :src="selectedTrip.driverPhoto" :alt="selectedTrip.driverName" size="3xl" />
              <div class="flex flex-col">
                <p class="text-sm font-bold">{{ selectedTrip.driverName }}</p>
                <p class="text-xs">{{ selectedTrip.plate }}</p>
              </div>
            </div>
            <img :src="selectedTrip.vehiclePhoto" class="h-20" alt="vehicle-photo">
          </div>

          <div class="flex flex-col w-full gap-y-4">
            <div class="flex justify-between items-center">
              <p class="w-1/4 text-sm text-center tracking-tight"
                :class="{ 'text-[var(--ui-success)]': sliderValue >= 12.5 }">Araç Yolda</p>
              <p class="w-1/4 text-sm text-center tracking-tight"
                :class="{ 'text-[var(--ui-success)]': sliderValue >= 37.5 }">Araç Geldi</p>
              <p class="w-1/4 text-sm text-center tracking-tight"
                :class="{ 'text-[var(--ui-success)]': sliderValue >= 62.5 }">Transfer Başladı</p>
              <p class="w-1/4 text-sm text-center tracking-tight"
                :class="{ 'text-[var(--ui-success)]': sliderValue >= 87.5 }">Transfer Bitti</p>
            </div>
            <USlider color="success" disabled v-model:model-value="sliderValue" :step="12.5" />
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { TripStatus } from "~/core/api/modules/trip/models/ITripHeaderDto";
import { IWaypointStatus } from "~/core/api/modules/trip/models/IWaypointStatus";



const mapContainer = ref();
const mapbox = ref<mapboxgl.Map>();
const vehicleMarker = ref<mapboxgl.Marker>();

const {
  selectedTrip,
  vehicleCoordinate,
} = storeToRefs(useCustomerTripStore());

const sliderValue = computed(() => {
  switch (selectedTrip.value?.waypointStatus) {
    case IWaypointStatus.OnRoad:
      return 12.5
    case IWaypointStatus.Near1Km:
      return 12.5
    case IWaypointStatus.Near500Mt:
      return 12.5
    case IWaypointStatus.Near200Mt:
      return 12.5
    case IWaypointStatus.OnWaypoint:
      return 37.5
    case IWaypointStatus.InProgress:
      return 62.5
    case IWaypointStatus.Finished:
      return 100
    default:
      return 0
  }

})

onMounted(() => {
  mapbox.value = useMapbox().createMap(mapContainer.value, { latitude: selectedTrip.value!.waypointLatitude, longitude: selectedTrip.value!.waypointLongitude });
  mapbox.value.on('load', () => {

      useMapbox().drawRoute(mapbox.value!, useDecodePolyline(selectedTrip.value!.route))
      new mapboxgl.Marker({
        element: useMapbox().createLiveWaypointMarker(),
        draggable: false,
        offset: [0, -36]
      }).setLngLat([selectedTrip.value!.waypointLongitude, selectedTrip.value!.waypointLatitude]).addTo(mapbox.value!);





  })
})

onBeforeUnmount(() => {
  mapbox.value?.remove();
})



watch(vehicleCoordinate, value => {
  if(vehicleMarker.value!!){
    vehicleMarker.value.setLngLat([value.longitude, value.latitude])
  }else{
    vehicleMarker.value = new mapboxgl.Marker({
        element: useMapbox().createCustomerCarMarker(),
        draggable: false,
        
      }).setLngLat([value.longitude, value.latitude]).addTo(mapbox.value!);
  }
}, {deep: true})

</script>