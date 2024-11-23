<template>
  <div class="flex flex-col">
    <div class="relative flex flex-col overflow-hidden">

      <div class="flex flex-col p-4">
        <div class="flex justify-start items-center gap-x-2">
          <UAvatar :src="user.profilePicture" size="xl"/>
          <div class="flex flex-col justify-start items-start">
            <p class="text-xl">{{ user.name }} {{ user.surname }}</p>
            <p class="text-sm">{{ user.username }}</p>
          </div>
          <div class="flex justify-end items-center flex-grow flex-1 gap-x-2">
            <NuxtLink to="/notifications">
              <UChip :text="unreadCount" size="3xl">
                <Icon name="material-symbols:notifications-sharp" size="30"/>
              </UChip>
            </NuxtLink>
          </div>
        </div>

      </div>
      <div class="p-4" v-if="user.accountType === 'Driver'">
        <UAlert
            title="Merhaba Sürücü!"
            description="Hemen sürüş modunu başlatarak, iş almaya başlayabilirsin."
            color="neutral"
            icon="ri:steering-2-line"
            variant="subtle"
            :actions="[
      {
        label: 'Sürüş moduna geçiş yap',
         onClick(event) {
          onVehicleModeClick();
        },
      },
    ]"
        />

      </div>
      <div class="flex flex-col p-4">
        <p>Favori Rotalarınız</p>
        <div class="px-4 py-2 bg-gray-800 text-md rounded-md flex justify-between items-center"
             v-for="favorite in favoriteTrips">
          <p>{{ favorite.name }}</p>
          <UButton color="neutral" variant="outline">Seç</UButton>
        </div>
      </div>
      <BasicTransfer/>
    </div>


    <div class="p-4">
      <div class="bg-white flex flex-col rounded-md" v-if="liveTrips.length > 0">

        <div class="flex flex-col p-4">
          <p class="text-black text-3xl">Aracın Yola Çıktı!</p>
          <p class="text-black text-md">Hemen aracını canlı olarak takip edebilir, sana varış süresini
            öğrenebilirsin.</p>
          <div class="flex flex-col gap-y-2 mt-2">
            <div class="text-black flex gap-x-4 justify-between items-center p-2 rounded-md"
                 v-for="trip in liveTrips.slice(0,1)">
              <div class="w-1/2 flex flex-col">
                <p>{{ trip.name }}</p>
              </div>
              <div class="w-1/2">
                <div class="bg-red-800 py-2 text-white text-center rounded-md" @click="goTripDetails(trip.id)">Canlı
                  Takip
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>

    <div class="p-4 flex flex-col gap-y-2">

      <p class="text-sm opacity-50" v-if="incomingTrips.length > 0">Yaklaşan Transferleriniz</p>
      <div class="bg-gray-700 flex gap-x-4 justify-between items-center p-2 rounded-md" v-for="trip in incomingTrips">
        <div class="flex flex-col">
          <p>{{ trip.name }}</p>

        </div>


      </div>
    </div>

    <UDrawer should-scale-background :direction="'bottom'" v-model:open="isVehicleCardVisible">
      <template #body>
        <div class="flex flex-col rounded-md p-2 mt-2">
          <img ref="parallaxSource" :src="accountVehicleCard?.photo" :style="cardStyle" alt="vehicle-photo" class="w-full">
        </div>
      </template>

    </UDrawer>


  </div>

</template>

<script setup lang="ts">
import {TripStatus} from "~/core/api/modules/trip/models/ITripHeaderDto";
import {useApi} from "~/core/api/useApi";
import type {IAccountVehicleDto} from "~/core/api/modules/accountVehicle/models/IAccountVehicle";

let interval: any;


const {tripHeaders} = storeToRefs(useCustomerTripStore());
const {accountVehicleId} = storeToRefs(useVehicleModeStore())
const {unreadCount} = storeToRefs(useNotificationStore())
const {user} = storeToRefs(useAuthStore())
const {favoriteTrips} = storeToRefs(useCreateTransferStore())
const accountVehicleCard = ref<IAccountVehicleDto | null>(null);
const isVehicleCardVisible = ref(false);
const parallaxSource =ref();
const {roll, tilt} = useParallax(parallaxSource.value)
const cardStyle = computed(() => ({
  transition: '.3s ease-out all',
  transform: `rotateX(${roll.value * 50}deg) rotateY(${
    tilt.value * 50
  }deg)`,
}))

const liveTrips = computed(() => tripHeaders.value.filter(x => x.status == TripStatus.Live));
const incomingTrips = computed(() => tripHeaders.value.filter(x => x.status == TripStatus.Approved))

const {goTripDetails, getTripHeaders} = useCustomerTripStore();

onMounted(() => {
  useApi().accountVehicle.GetAccountVehicle('4c1bc9fd-b152-448e-8813-9e47b39541ea').then(res => {
    accountVehicleCard.value = res.data;
    isVehicleCardVisible.value = true;
  })
  getTripHeaders();
  interval = setInterval(() => {
    getTripHeaders();
  }, 2000)
})

onUnmounted(() => {
  clearInterval(interval)
})

function onVehicleModeClick() {
  if (accountVehicleId.value != ''){
    useRouter().push('/vehicle-mode')
  }else{
    useCamera('qr').then(res => {
      useApi().accountVehicle.GetAccountVehicle(res).then(res => {

      })
      useVehicleModeStore().setAccountVehicleId(res)
    })
  }
}


</script>