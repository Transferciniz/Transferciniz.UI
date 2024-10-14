<template>
  <div class="h-full w-full relative">
    <div id="customerMap" class="h-screen w-screen"></div>
    <div class="absolute w-full top-0 left-0 z-[10000] ">
      <div class="flex justify-between items-center p-4">
        <div class="bg-gray-900 px-2 py-1 text-center text-xs">Durağıma Yol Tarifi Al</div>
        <div class="bg-gray-900 px-2 py-1 text-center text-xs">Canlı Konum Paylaşımı Açık</div>
      </div>
      <div class="flex justify-center items-center">
        <p class="bg-gray-900 text-sm px-2 py-1 rounded-md">Araç Bilgisi Bekleniyor...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useMapIcon} from "~/composables/useMapIcon";

const {$L:L} = useNuxtApp()
const map = ref<L.Map>();
const vehicleMarker = ref<L.Marker>();
onMounted(() => {
  map.value = useMap('customerMap')
  tripDetails.value.forEach((route, index) => {
    useRouting(map.value!, route.waypoints, index)
  });
  L.marker({lat: myWaypoint.value.latitude, lng: myWaypoint.value.longitude}, {draggable: false, riseOnHover: true, icon: useMapIcon().waypointIcon}).addTo(map.value!);
})
const {
  tripDetails,
  myWaypoint,
    vehicleCoordinate
} = storeToRefs(useCustomerTripStore());

watchDebounced(vehicleCoordinate, value => {
  if(vehicleMarker.value != null){
    vehicleMarker.value.setLatLng(new L.LatLng(value.latitude, value.longitude));
  }else{
    vehicleMarker.value =  L.marker({lat: value.latitude, lng: value.longitude}, {draggable: false, riseOnHover: true, icon: useMapIcon().carIcon}).addTo(map.value!);

  }
}, { debounce: 500})

</script>