<template>
  <div class="flex flex-col w-full h-full">
    <EnterpriseTransporterHome v-if="user.accountType == 'EnterpriseTransporterCompany'"/>
    <CustomerHome v-if="user.accountType == 'Customer' || user.accountType == 'Driver'"></CustomerHome>
  </div>
</template>
<script setup lang="ts">
import moment from "moment";
import 'moment/dist/locale/tr.js'

const {user, isAuthenticated} = storeToRefs(useAuthStore())
moment.locale("tr");

onMounted(() => {

  if(user.value.isAccountCompleted == 'False' && isAuthenticated.value == true){
    useRouter().push('/complete-profile')
  }
})

</script>