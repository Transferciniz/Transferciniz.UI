<template>
  <div class="flex flex-col w-full h-full">

      <div class="flex justify-center items-center gap-x-2 bg-yellow-400 text-black px-4 py-2 shadow-yellow-400 shadow-2xl"  @click="onVehicleModeClick" v-if="user.accountType == 'Driver'">
        <Icon name="ri:steering-2-line" class=" animate-pulse" size="40" />
        <p class="animate-pulse">Sürüş Modunu Başlatmak İçin Dokunun</p>
      </div>

    <EnterpriseTransporterHome v-if="user.accountType == 'EnterpriseTransporterCompany'"/>

    <CustomerHome v-if="user.accountType == 'Customer' || user.accountType == 'Driver'"></CustomerHome>

  </div>
</template>
<script setup lang="ts">
import moment from "moment";
import 'moment/dist/locale/tr.js'

const {user} = storeToRefs(useAuthStore())
moment.locale("tr");

function onVehicleModeClick(){
  useVehicleModeStore().startVehicleMode();
}
</script>