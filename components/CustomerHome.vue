<template>
  <div class="flex flex-col">
    <div class="relative flex flex-col overflow-hidden">
      <div>
        <img :src="user.profilePicture" class="h-[170px] w-full object-cover object-center filter blur-[3px] brightness-[0.3]" alt="profilePicture">
      </div>
      <div class="absolute inset-0 flex flex-col p-4">
        <div class="flex justify-start items-center gap-x-2">
          <UAvatar :src="user.profilePicture" size="xl"/>
          <div class="flex flex-col justify-start items-start">
            <p class="text-xl">{{user.name}} {{user.surname}}</p>
            <p class="text-sm">{{user.username}}</p>
          </div>
          <div class="flex justify-end items-center flex-grow gap-x-2">
            <Icon name="material-symbols:notifications-sharp" size="30" />
            <Icon name="material-symbols:settings-rounded" size="30" />
          </div>
        </div>
        <div class="flex justify-start gap-x-4 items-center mt-5">
          <Icon name="hugeicons:wallet-03" size="50"/>
          <div class="flex flex-col">
            <p class="text-xs">Cüzdan Bakiyesi:</p>
            <p class="text-2xl">0,00₺</p>
          </div>
          <div class="flex flex-col gap-y-2 flex-grow">
            <div class="bg-white text-black text-xs px-4 py-1 rounded-md text-center">Kendin İçin Yükleme Yap</div>
            <div class="bg-white text-black text-xs px-4 py-1 rounded-md text-center">Başkası İçin Yükleme Yap</div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 flex flex-col gap-y-2">
      <p class="text-sm opacity-50">Yaklaşan Transferleriniz</p>
      <div class="bg-gray-700 flex gap-x-4 justify-between items-center p-2 rounded-md" v-for="trip in tripHeaders">
        <div class="w-1/2 flex flex-col">
          <p>{{trip.name}}</p>
        </div>
        <div class="w-1/2">
          <div class="bg-red-800 py-2 text-white text-center rounded-md" @click="goTripDetails(trip.id)">Canlı Takip</div>
        </div>

      </div>
    </div>

  </div>

</template>

<script setup lang="ts">

const {user} =  storeToRefs(useAuthStore())

const{
  tripHeaders
} = storeToRefs(useCustomerTripStore());

const {goTripDetails, getTripHeaders} = useCustomerTripStore();

onMounted(() => {
  getTripHeaders();
})
</script>