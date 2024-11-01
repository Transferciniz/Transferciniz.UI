<template>
    <div class="h-full w-full">
      <div class="flex flex-col w-full p-4 bg-gradient-to-b from-black/80 to-black/20 fixed top-0 right-0 z-10 backdrop-blur">
        <div class="flex justify-start items-center gap-x-2">
          <UAvatar :src="user.profilePicture" size="xl"/>
          <div class="flex flex-col justify-start items-start">
            <p class="text-xl">{{user.name}} {{user.surname}}</p>
            <p class="text-sm">{{user.username}}</p>
          </div>
          <div class="flex justify-end items-center flex-grow gap-x-2">
            <NuxtLink to="/notifications">
              <UChip :text="unreadCount" size="2xl">
                <Icon name="material-symbols:notifications-sharp" size="30" />
              </UChip>
            </NuxtLink>
            <Icon name="material-symbols:settings-rounded" size="30" />
          </div>
        </div>
      </div>
      <div ref="map" class="w-full h-full fixed top-0 right-0"></div>
      <!--
      <div class="bg-gray-700 m-4 p-2 px-4 rounded-lg flex justify-between items-center gap-x-4">
        <p class="text-xs w-1/2">Araçlarınızı canlı şekilde takip edin, durumları gözlemleyin.</p>
        <div class="bg-red-800 flex-grow text-white text-sm px-4 py-1 rounded flex justify-center items-center gap-x-2">
          <Icon name="mingcute:live-location-line" :size="30"/>
          <p>Canlı Takip</p>
        </div>
      </div>
      <div class="p-4 text-sm opacity-70">Transferleriniz</div>
      <div class="flex flex-col gap-y-2 px-2">
        <div class="bg-gray-700 flex flex-col p-2 rounded-md" @click="goTripDetails(trip.id)" v-for="trip in tripHeaders">
          <div class="flex justify-between items-center">
            <p>{{trip.name}}</p>
            <p>{{trip.status}}</p>
          </div>
          <div class="flex justify-start items-center">
            <p>{{trip.startDate}}</p>
          </div>
        </div>
      </div>
      -->
    </div>
</template>
<script setup lang="ts">

import {useApi} from "~/core/api/useApi";
import mapboxgl from "mapbox-gl";

const map = ref<HTMLElement>()
const mapbox = ref<mapboxgl.Map>()
onMounted(() => {
  mapbox.value = useMapbox().createMap(map.value, {latitude: 0, longitude: 0})
  useApi().account.GetAccountVehiclesForMap().then(res => {
    res.data.forEach(vehicle => {

      new mapboxgl.Marker({
        element: useMapbox().createVehicleMarker(vehicle.name),
        draggable: false,

      }).setLngLat([vehicle.longitude, vehicle.latitude]).addTo(mapbox.value!)
    })
  })
})

const {
  user
} = storeToRefs(useAuthStore())

const {
  tripHeaders
} = storeToRefs(useCompanyTripStore())

const {
  goTripDetails,
  getTripHeaders
} = useCompanyTripStore()

onMounted(() => {
  getTripHeaders();
})
</script>