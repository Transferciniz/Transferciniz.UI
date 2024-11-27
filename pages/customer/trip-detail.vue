<template>
  <div class="h-full w-full relative">
    <div ref="mapContainer" class="h-full w-full"></div>
    <div class="absolute w-full bottom-0 left-0 z-[10000] ">
      <div class="flex flex-col justify-center items-center p-4 gap-y-2">
        
        <div class="flex flex-col justify-center items-center p-4 gap-y-2 w-full bg-gray-900 border-gray-700 border rounded-md">
          <div class="flex justify-between items-center w-full gap-x-2">
          <div class="flex justify-start items-center gap-x-2">
            <UAvatar :src="myTrip?.driverPhoto" :alt="myTrip?.driverName" size="3xl"/>
            <div class="flex flex-col">
              <p class="text-sm font-bold">{{ myTrip?.driverName }}</p>
              <p class="text-xs">{{ myTrip?.vehiclePlate }}</p>
            </div>
          </div>
            <img :src="myTrip?.vehiclePhoto" class="h-20" alt="vehicle-photo">
        </div>

        <div class="flex flex-col w-full gap-y-4">
          <div class="flex justify-between items-center">
            <p class="w-1/4 text-sm text-center tracking-tight" :class="{'text-[var(--ui-success)]': sliderValue >= 12.5}">Araç Yolda</p>
            <p class="w-1/4 text-sm text-center tracking-tight" :class="{'text-[var(--ui-success)]': sliderValue >= 37.5}">Araç Geldi</p>
            <p class="w-1/4 text-sm text-center tracking-tight" :class="{'text-[var(--ui-success)]': sliderValue >= 62.5}">Transfer Başladı</p>
            <p class="w-1/4 text-sm text-center tracking-tight" :class="{'text-[var(--ui-success)]': sliderValue >= 87.5}">Transfer Bitti</p>
          </div>
          <USlider color="success" disabled v-model:model-value="sliderValue" :step="12.5" />
        </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment/moment";
import 'moment/locale/tr'
import mapboxgl from "mapbox-gl";
import { ITripStatusForUser } from "~/core/api/modules/trip/models/ITripStatusForUser";

moment.locale('tr');
const mapContainer = ref();
const mapbox = ref<mapboxgl.Map>();

const {
  tripDetails,
  myWaypoint,
  vehicleCoordinate,
    myTrip
} = storeToRefs(useCustomerTripStore());

const sliderValue = computed(() => {
  switch (myTrip.value?.userStatus) {
    case ITripStatusForUser.OnRoad:
      return 12.5
      case ITripStatusForUser.OnWaypoint:
        return 37.5
        case ITripStatusForUser.OnVehicle:
          return 62.5
          case ITripStatusForUser.Finished:
            return 100
    default:
      return 0
  }

})

onMounted(() => {
  mapbox.value = useMapbox().createMap(mapContainer.value, {latitude: 0, longitude: 0});
  mapbox.value.on('load',() => {
    useMapbox().fetchRouteData(myTrip.value!.waypoints as any[]).then((res) => {
      useMapbox().drawRoute(mapbox.value!, res)
      new mapboxgl.Marker({
        element: useMapbox().createDefaultMarker(),
        draggable: false,
      }).setLngLat([myWaypoint.value.longitude, myWaypoint.value.latitude]).addTo(mapbox.value!);

      vehicleMarker.value = new mapboxgl.Marker({
        element: useMapbox().createCustomerCarMarker(),
        draggable: false,
      }).setLngLat([0,0]).addTo(mapbox.value!);

    })
  })
})

onBeforeUnmount(() => {
  mapbox.value?.remove();
})

const vehicleMarker = ref<mapboxgl.Marker>();
const vehicleArrivalDate = ref<Date>();
const statusText = computed(() => {

  if(vehicleArrivalDate.value){
    return `Aracınızın Tahmini Varışı: ${moment(vehicleArrivalDate.value).fromNow()}`
  }else{
    return 'Araç Bilgisi Bekleniyor...'
  }
})



watchDebounced(vehicleCoordinate, value => {
  if(vehicleMarker.value != undefined){
    vehicleMarker.value.setLngLat([value.longitude, value.latitude])
  }
})

</script>