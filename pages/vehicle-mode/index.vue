<template>
  <div class="flex flex-col gap-y-2">
    <div class="bg-gray-700 flex flex-col">
      <div class="m-4 flex flex-col p-4">
        <p class="text-lg ">Hoş Geldiniz, {{user.name}} {{user.surname}}</p>
        <p class="text-xs">{{ accountVehicle?.vehicle.vehicleBrand.name }} {{ accountVehicle?.vehicle.vehicleModel.name }} - {{accountVehicle?.plate}}</p>
      </div>
    </div>

    <div class="p-4 flex flex-col gap-y-2">
      <div class="text-lg">Yaklaşan İşleriniz ({{trips.length}})</div>
      <div v-for="trip in trips" class="bg-gray-700 p-2 px-4 rounded-md flex justify-between">
        <div class="flex justify-start items-center gap-x-2">
          <p>{{trip.name}}</p>
          <p class="text-xs opacity-50">{{trip.trip.waypoints.length}} Durak</p>
        </div>
        <div class="bg-gray-900 rounded-lg px-2 py-1 text-sm" @click="startTrip(trip)">Transferi Başlat</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  accountVehicle,
  trips
} = storeToRefs(useVehicleModeStore());
const {user} = storeToRefs(useAuthStore())

function startTrip(trip: any){
  useVehicleModeStore().startTrip(trip)
}

onMounted(() => {
  useVehicleModeStore().getVehicleTrips()
})
</script>