<template>
  <div class="flex flex-col">
    <div class="relative flex flex-col overflow-hidden">

      <div class="flex flex-col p-4">
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
        <!--
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
        -->
      </div>
      <BasicTransfer/>
    </div>

    <!--
    <div class="bg-white flex flex-col" v-if="liveTrips.length > 0">
      <Vue3Lottie
          animationLink="/animations/car-animation.json"
          :width="'100%'"
      />
      <div class="flex flex-col p-4">
        <p class="text-black text-3xl mt-[-41px]">Sana Geliyoruz!</p>
        <p class="text-black text-md">Hemen aracını canlı olarak takip edebilir, sana ne zaman geleceğimizi öğrenebilirsin.</p>
        <div class="flex flex-col gap-y-2 mt-2">
          <div class="text-black flex gap-x-4 justify-between items-center p-2 rounded-md" v-for="trip in liveTrips.slice(0,1)">
            <div class="w-1/2 flex flex-col">
              <p>{{trip.name}}</p>
            </div>
            <div class="w-1/2">
              <div class="bg-red-800 py-2 text-white text-center rounded-md" @click="goTripDetails(trip.id)">Canlı Takip</div>
            </div>

          </div>
        </div>
      </div>

    </div>
    <div class="p-4 flex flex-col gap-y-2">

      <p class="text-sm opacity-50">Yaklaşan Transferleriniz</p>
      <div class="bg-gray-700 flex gap-x-4 justify-between items-center p-2 rounded-md" v-for="trip in incomingTrips">
        <div class="flex flex-col">
          <p>{{trip.name}}</p>
        </div>


      </div>
    </div>
    -->

  </div>

</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'
import {TripStatus} from "~/core/api/modules/trip/models/ITripHeaderDto";
import BasicTransfer from "~/components/BasicTransfer.vue";

const {user} =  storeToRefs(useAuthStore())
const {unreadCount} = storeToRefs(useNotificationStore())
let interval: any;
const{
  tripHeaders
} = storeToRefs(useCustomerTripStore());

const liveTrips = computed(() => tripHeaders.value.filter(x => x.status == TripStatus.Live));
const incomingTrips = computed(() => tripHeaders.value.filter(x => x.status == TripStatus.Approved))

const {goTripDetails, getTripHeaders} = useCustomerTripStore();

onMounted(() => {
  getTripHeaders();
  interval = setInterval(() => {
    getTripHeaders();
  }, 2000)
})

onUnmounted(() => {
  clearInterval(interval)
})


</script>