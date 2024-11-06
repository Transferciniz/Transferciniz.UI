<template>
  <div class="flex flex-col bg-black h-full bg-contain bg-no-repeat bg-[linear-gradient(to_bottom,rgba(0,0,0,0.3),rgba(0,0,0,1)),url('/vehicle-mode-background.png')]">
    <div class="w-full flex flex-col p-4">
      <p class="text-lg ">Hoş Geldiniz, {{user.name}} {{user.surname}}</p>
      <p class="text-xs">{{ accountVehicle?.vehicle.vehicleBrand.name }} {{ accountVehicle?.vehicle.vehicleModel.name }} - {{accountVehicle?.plate}}</p>
    </div>

    <div class="flex flex-col backdrop-blur-sm p-4 m-4 border-white/20 border rounded-md" v-if="trips.length > 0">
      <p class="text-xs">Sıradaki İşiniz</p>
      <div class="flex flex-col justify-between">
        <p class="text-lg">{{trips[0].name}}</p>
        <p class="text-xs">{{trips[0].trip.startDate}}</p>
        <div ref="map" class="w-full rounded-md h-[300px] mt-2"></div>
        <div class="bg-red-600 text-white text-center px-8 py-2 rounded-md mt-2" @click="startTrip(trips[0])">Transferi Başlat</div>
      </div>
    </div>

    <div class="p-4 flex flex-col gap-y-2">
      <div class="text-lg">Yaklaşan İşleriniz ({{trips.length}})</div>
      <div v-for="trip in trips" class="bg-gray-700 p-2 px-4 rounded-md flex justify-between">
        <div class="flex justify-start items-center gap-x-2">
          <p>{{trip.name}}</p>
          <p class="text-xs opacity-50">{{trip.trip.waypoints.length}} Durak</p>
        </div>
      </div>
    </div>



  </div>
</template>

<script setup lang="ts">


import mapboxgl from "mapbox-gl";

const {
  accountVehicle,
  trips
} = storeToRefs(useVehicleModeStore());

const {user} = storeToRefs(useAuthStore());

const map = ref();
const mapbox = ref<mapboxgl.Map>()

function startTrip(trip: any){
  useVehicleModeStore().startTrip(trip)
}

onMounted(() => {
  useVehicleModeStore().getVehicleTrips().then(() => {
    mapbox.value = useMapbox().createMap(map.value, {latitude: 0, longitude:0});
    mapbox.value.on('load', () => {
      useMapbox().fetchRouteData(trips.value[0].trip.waypoints as any[]).then((res) => {
        useMapbox().drawRoute(mapbox.value!, res)
        new mapboxgl.Marker({
          element: useMapbox().createStartMarker(),
          draggable: false,

        }).setLngLat([res.features[0].geometry.coordinates[0][0], res.features[0].geometry.coordinates[0][1]]).addTo(mapbox.value!);
        new mapboxgl.Marker({
          element: useMapbox().createFinishMarker(),
          draggable: false,

        }).setLngLat([res.features[0].geometry.coordinates[res.features[0].geometry.coordinates.length -1][0], res.features[0].geometry.coordinates[res.features[0].geometry.coordinates.length -1][1]]).addTo(mapbox.value!);

      });
    })
  })
})
</script>