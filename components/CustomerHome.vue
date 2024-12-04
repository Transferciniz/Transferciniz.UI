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
          <UButton color="error" variant="outline" @click="deleteFavorite(favorite)">Sil</UButton>
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
      <IncomingTrips/>
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
import { TripStatus } from "~/core/api/modules/trip/models/ITripHeaderDto";
import { useApi } from "~/core/api/useApi";
import type { IAccountVehicleDto } from "~/core/api/modules/accountVehicle/models/IAccountVehicle";
import { IVehicleStatus } from "~/core/api/modules/accountVehicle/models/IUpdateVehicleStatusCommand";
import type { IFavoriteTrip } from "~/core/api/modules/trip/models/IFavoriteTrip";


const { tripHeaders } = storeToRefs(useCustomerTripStore());
const { accountVehicleId } = storeToRefs(useVehicleModeStore())
const { unreadCount } = storeToRefs(useNotificationStore())
const { user } = storeToRefs(useAuthStore())
const { favoriteTrips } = storeToRefs(useCreateTransferStore())
const { goTripDetails } = useCustomerTripStore();

const accountVehicleCard = ref<IAccountVehicleDto | null>(null);
const isVehicleCardVisible = ref(false);
const liveTrips = computed(() => tripHeaders.value.filter(x => x.status == TripStatus.Live));

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

/**
 * Silinecek
 */
/*
onMounted(() => {
  const vehicleId = '61220d17-9097-4135-9d8a-220b7003e7cc'
  useApi().accountVehicle.GetAccountVehicle(vehicleId).then(res => {
        accountVehicleCard.value = res.data;
        isVehicleCardVisible.value = true;
      })
})*/

function deleteFavorite(payload: IFavoriteTrip){
  useCreateTransferStore().deleteFavorite(payload);
}

function activateVehicleMode() {
  useVehicleModeStore().setAccountVehicleId(accountVehicleCard.value!.id)
}
</script>