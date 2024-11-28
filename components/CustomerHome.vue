<template>
  <div class="flex flex-col">
    <div class="relative flex flex-col overflow-hidden">

      <div class="flex flex-col p-4">
        <div class="flex justify-start items-center gap-x-2">
          <UAvatar :src="user.profilePicture" size="xl" />
          <div class="flex flex-col justify-start items-start">
            <p class="text-xl">{{ user.name }} {{ user.surname }}</p>
            <p class="text-sm">{{ user.username }}</p>
          </div>
          <div class="flex-grow flex justify-end flex-1">
            <UChip position="top-right" :show="unreadCount > 0">
              <UButton to="/notifications" icon="material-symbols:notifications-sharp" color="neutral" size="lg"
                variant="soft" />
            </UChip>
          </div>
        </div>

      </div>
      <div class="p-4" v-if="user.accountType === 'Driver'">
        <UAlert title="Merhaba Sürücü!" description="Hemen sürüş modunu başlatarak, iş almaya başlayabilirsin."
          color="neutral" icon="ri:steering-2-line" variant="subtle" :actions="[
            {
              label: 'Sürüş moduna geçiş yap',
              onClick(event) {
                onVehicleModeClick();
              },
            },
          ]" />

      </div>
      <div class="flex flex-col p-4" v-if="favoriteTrips.length > 0">
        <p>Favori Rotalarınız</p>
        <div class="px-4 py-2 bg-gray-800 text-md rounded-md flex justify-between items-center"
          v-for="favorite in favoriteTrips">
          <p>{{ favorite.name }}</p>
          <UButton color="neutral" variant="outline">Seç</UButton>
        </div>
      </div>
      <BasicTransfer />
    </div>


    <div class="p-4">
      <div class="bg-white flex flex-col rounded-md" v-if="liveTrips.length > 0">

        <div class="flex flex-col p-4">
          <p class="text-black text-3xl">Aracın Yola Çıktı!</p>
          <p class="text-black text-md">Hemen aracını canlı olarak takip edebilir, sana varış süresini
            öğrenebilirsin.</p>
          <div class="flex flex-col gap-y-2 mt-2">
            <div class="text-black flex gap-x-4 justify-between items-center p-2 rounded-md"
              v-for="trip in liveTrips.slice(0, 1)">
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
      <template v-for="trip in incomingTrips">
        <div class="flex flex-col gap-y-2">
          <p class="text-md font-bold">{{ trip.name }}</p>
          <UAlert
            color="warning"
            variant="soft"
            title="Bu transfere katılmayacağınızı belirttiniz!"
            v-if="trip.willCome === false"
          />
          <div class="flex justify-start gap-x-2 items-center rounded-md">
            <div class="flex flex-col justify-center items-center">
              <p class=text-3xl>{{ getDay(trip.startDate) }}</p>
              <p class="mt-[-5px] text-xs opacity-80">{{ getMonth(trip.startDate) }}</p>
            </div>
            <div class="flex flex-col">
              <div class="flex justify-start items-center gap-x-1">
                <UIcon name="material-symbols:nest-clock-farsight-analog-outline" />
                <p class="text-lg">{{ getClock(trip.startDate) }}</p>
              </div>
              <UBadge :label="trip.plate" variant="subtle" size="sm" />
            </div>
            <USeparator orientation="vertical" class="w-4" />
            <UButtonGroup size="lg">
              <UButton label="İncele"  icon="ic:twotone-search" color="neutral" variant="soft" />
              <UButton label="Gelmeyeceğim" trailing-icon="gridicons:cross-circle" color="warning" variant="soft" loading-auto @click="updateWillComeStatus(trip)" v-if="trip.willCome === true"/>
              <UButton label="Geleceğim" trailing-icon="material-symbols:check-rounded" color="success" variant="soft" loading-auto  @click="updateWillComeStatus(trip)" v-if="trip.willCome === false"/>
            </UButtonGroup>
          </div>
          <USeparator orientation="horizontal" />

        </div>
      </template>


    </div>

    <UDrawer should-scale-background :direction="'bottom'" v-model:open="isVehicleCardVisible">
      <template #body>
        <div class="flex flex-col rounded-md p-2 mt-2">
          <p class="text-xl font-bold text-center">{{ accountVehicleCard?.name }}</p>
          <div class="flex justify-center items-center gap-x-4 mt-2">
            <UBadge color="neutral" size="lg" variant="subtle" :label="accountVehicleCard?.plate" />
            <UBadge color="neutral" variant="subtle" size="lg" label="Çevrimdışı"
              v-if="accountVehicleCard?.status === IVehicleStatus.Offline" />
            <UBadge color="success" variant="subtle" size="lg" label="Çevrimiçi"
              v-if="accountVehicleCard?.status === IVehicleStatus.Online" />
            <UBadge color="warning" variant="subtle" size="lg" label="Bakımda"
              v-if="accountVehicleCard?.status === IVehicleStatus.InMaintenance" />
            <UBadge color="error" variant="subtle" size="lg" label="Araç Meşgul"
              v-if="accountVehicleCard?.status === IVehicleStatus.Busy" />
          </div>
          <img :src="accountVehicleCard?.photo" alt="vehicle-photo" class="w-full">

          <UAlert color="warning" variant="subtle" title="Araç bakımda!"
            v-if="accountVehicleCard?.status === IVehicleStatus.InMaintenance"
            description="Seçmiş olduğunuz araç bakımda gözüküyor, aracı bakımdan çıkarmak istediğinize emin misiniz?"
            icon="si:warning-duotone" />
          <UAlert color="error" variant="subtle" title="Araç kullanımda!"
            v-if="accountVehicleCard?.status === IVehicleStatus.Busy"
            description="Bu araç şu anda bir transfer gerçekleştiriyor, araç kullanımını kendi üzerinize almak istediğinize emin misiniz?"
            icon="si:warning-duotone" />
          <UAlert color="neutral" variant="subtle" title="Araç kullanımda!"
            v-if="accountVehicleCard?.status === IVehicleStatus.Online"
            description="Bu araç bir başka sürücü ile çevrim içi durumda. Araç kullanımını kendi üzerinize almak istediğinize emin misiniz?"
            icon="si:warning-duotone" />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center items-center gap-x-2">
          <UButton aria-current-value="false" block class="text-center" label="Aracı Benimle İlişkilendir"
            @click="activateVehicleMode" />
          <UButton color="neutral" variant="soft" block class="text-center" aria-current-value="false" label="İptal Et"
            @click="isVehicleCardVisible = false" />
        </div>


      </template>

    </UDrawer>

  </div>

</template>

<script setup lang="ts">
import { TripStatus, type ITripHeaderDto } from "~/core/api/modules/trip/models/ITripHeaderDto";
import { useApi } from "~/core/api/useApi";
import type { IAccountVehicleDto } from "~/core/api/modules/accountVehicle/models/IAccountVehicle";
import { IVehicleStatus } from "~/core/api/modules/accountVehicle/models/IUpdateVehicleStatusCommand";
import moment from "moment";
import type { ITripDto } from "~/core/api/modules/trip/models/ITripDto";
let interval: any;


const { tripHeaders } = storeToRefs(useCustomerTripStore());
const { accountVehicleId } = storeToRefs(useVehicleModeStore())
const { unreadCount } = storeToRefs(useNotificationStore())
const { user } = storeToRefs(useAuthStore())
const { favoriteTrips } = storeToRefs(useCreateTransferStore())
const accountVehicleCard = ref<IAccountVehicleDto | null>(null);
const isVehicleCardVisible = ref(false);


const liveTrips = computed(() => tripHeaders.value.filter(x => x.status == TripStatus.Live));
const incomingTrips = computed(() => tripHeaders.value.filter(x => x.status == TripStatus.Approved))

const { goTripDetails, getTripHeaders } = useCustomerTripStore();

onMounted(() => {
  useApi().accountVehicle.GetAccountVehicle('4c1bc9fd-b152-448e-8813-9e47b39541ea').then(res => {

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
  if (accountVehicleId.value != '') {
    useRouter().push('/vehicle-mode')
  } else {
    useCamera('qr').then(res => {
      useApi().accountVehicle.GetAccountVehicle(res).then(res => {
        accountVehicleCard.value = res.data;
        isVehicleCardVisible.value = true;
      })
    })
  }
}

function getDay(date: Date): string {
  return moment(date).get('D').toString()
}

function getMonth(date: Date): string {
  return moment(date).format('MMMM')
}

function getClock(date: Date): string {
  return moment(date).format('HH:mm')
}

function activateVehicleMode() {
  useVehicleModeStore().setAccountVehicleId(accountVehicleCard.value!.id)
}

function updateWillComeStatus(trip: ITripHeaderDto){
  trip.willCome = !trip.willCome;
  return useApi().trip.UpdateUserWillCome({
    waypointUserId: trip.waypointUserId,
    willCome: trip.willCome
  });
}


</script>