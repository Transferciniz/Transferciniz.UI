<template>
  <div class="h-full w-full relative">
    <div ref="mapContainer" class="h-screen w-screen"></div>
    <div class="absolute w-full top-0 left-0 z-[10000] ">

      <div class="flex justify-center items-center">
        <p class="bg-gray-900 text-sm px-2 py-1 rounded-md mt-2">{{statusText}}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment/moment";
import 'moment/locale/tr'
import mapboxgl from "mapbox-gl";

moment.locale('tr');
const mapContainer = ref();
const mapbox = ref<mapboxgl.Map>();

const {
  tripDetails,
  myWaypoint,
  vehicleCoordinate,
    myTrip
} = storeToRefs(useCustomerTripStore());

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