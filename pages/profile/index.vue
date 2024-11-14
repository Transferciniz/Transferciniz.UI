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




  </div>
</template>

<script setup lang="ts">

import {AccountType} from "~/core/api/modules/auth/models/AccountType";

const {user} = storeToRefs(useAuthStore())
const {logout} = useAuthStore()

const userType = computed(() => {
  switch (user.value.accountType) {
    case AccountType.EnterpriseCustomerCompany:
      return "Kurumsal Üye Hesabı"
      break;
    case AccountType.EnterpriseTransporterCompany:
      return "Kurumsal Firma Hesabı"
      break;
    case AccountType.Customer:
      return "Yolcu Hesabı"
      break;
    case AccountType.Driver:
      return "Sürücü Hesabı"
      break;
  }
})

function editProfile() {
  useRouter().push('/profile/edit')
}
</script>