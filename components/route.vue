<template>
  <div class="bg-gray-700 p-4 rounded-md flex flex-col m-4">
    <div class="flex justify-start items-center gap-x-2">
      <p class="text-lg">{{route.accountVehicle.vehicle.vehicleBrand.name}} {{route.accountVehicle.vehicle.vehicleModel.name}}</p>
      <p class="bg-white border-black px-2 py-1 border-2 font-bold text-black rounded-md text-xs">{{route.accountVehicle.plate}}</p>
    </div>
    <img src="/sprinter.png" class="h-30 object-contain" alt="vehicle"/>
    <p class="text-xs opacity-50 mb-2">Araçtaki Kişiler</p>
    <div class="flex flex-col gap-x-2 gap-y-2  justify-start items-start">
      <div v-for="(waypoint, index) in route.wayPoints" class="flex flex-col">
        <template v-if="index != route.wayPoints.length -1">
        <p>{{waypoint.name}}</p>
        <div class="flex flex-wrap gap-x-2 gap-y-2">
          <div class="flex flex-col items-center justify-center bg-gray-900 px-2 py-3 rounded" v-for="user in waypoint.wayPointUsers">
            <UAvatar :src="user.profilePicture" :alt="user.name + ' ' + user.surname" size="lg" />
            <p class="text-xs">{{user.name}}</p>
            <p class="text-xs">{{user.surname}}</p>
          </div>
        </div>
        </template>

      </div>

    </div>
  </div>

</template>
<script setup lang="ts">

defineProps<{
  route: any
}>()
</script>