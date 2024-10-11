<template>
    <div class="flex flex-col h-full w-full">
      <div class="text-white p-4 flex flex-col gap-y-1 ">
        <div class="flex justify-start gap-x-2 items-center">
          <UAvatar :src="user.profilePicture" :alt="user.name" :chip-color="'green'" size="lg" />
          <div class="flex flex-col">
            <p>{{user.name}} {{user.surname}}</p>
            <p class="text-xs opacity-50">{{user.username}}</p>
          </div>
        </div>
      </div>
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
    </div>
</template>
<script setup lang="ts">

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