<template>
  <div class="h-screen w-screen flex flex-col p-4">
    <div class="flex flex-col rounded-md p-2 items-center justify-center">
      <div class="flex justify-center items-center">
        <img :src="user.profilePicture" class="rounded-full size-40"/>
      </div>
      <p class="text-xl font-bold">{{user.name}} {{user.surname}}</p>
      <p class="text-xs opacity-50">{{user.username}} - {{user.email}}</p>
      <UBadge color="primary" variant="soft" class="my-2">{{userType}}</UBadge>
    </div>
    <div class="flex justify-between gap-x-4 items-center">
      <UButton color="neutral" variant="subtle" class="justify-center w-full" @click="editProfile">Profili Düzenle</UButton>
      <UButton color="error" variant="subtle" class="justify-center w-full" @click="logout">Çıkış Yap</UButton>
    </div>

    <div class="flex flex-col mt-8">
      <div class="flex justify-start items-center">
        <UBadge icon="i-lucide-rocket" color="neutral">Transfer Geçmişiniz</UBadge>
      </div>
      <div class="flex flex-col gap-y-2 mt-2" v-if="tripHistory.length > 0">
        <div class="bg-gray-700 flex justify-start items-center px-2 py-2 rounded-md" v-for="tripHeader in tripHistory">
          <p>{{tripHeader.name}}</p>
        </div>
      </div>
      <UAlert
          class="mt-2"
          v-else
          color="neutral"
          variant="subtle"
          title="Hiç transfer yapılmamış :("
          description="Transferlerinizi tamamladıktan sonra geçmiş transferlerinizi burada görüntüleyebilirsiniz."

      />
    </div>






  </div>
</template>

<script setup lang="ts">

import {AccountType} from "~/core/api/modules/auth/models/AccountType";
import {useApi} from "~/core/api/useApi";
import type {ITripHeaderDto} from "~/core/api/modules/trip/models/ITripHeaderDto";

const {user} = storeToRefs(useAuthStore())
const {logout} = useAuthStore();
const take = ref(10);
const skip = ref(0);
const tripHistory = ref<ITripHeaderDto[]>([])
const totalCount = ref(0);

const userType = computed(() => {
  switch (user.value.accountType) {
    case AccountType.EnterpriseCustomerCompany:
      return "Kurumsal Üye Hesabı"
    case AccountType.EnterpriseTransporterCompany:
      return "Kurumsal Firma Hesabı"
    case AccountType.Customer:
      return "Yolcu Hesabı"
    case AccountType.Driver:
      return "Sürücü Hesabı"
  }
})

onMounted(() => {
  loadTripHistory();
})

function editProfile() {
  useRouter().push('/profile/edit')
}

function loadTripHistory(){
  useApi().trip.GetTripHistory({
    skip: skip.value,
    take: take.value,
  }).then(res => {
    totalCount.value = res.data.totalCount;
    res.data.data.forEach(trip => {
      tripHistory.value.push(trip);
    })
  })
}

function loadMore(){
  skip.value += take.value;
  loadTripHistory();
}
</script>