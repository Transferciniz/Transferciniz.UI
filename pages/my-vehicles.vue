<template>
  <div class="flex flex-col p-4">
    <div class="flex items-center justify-between">
      <p class="text-xl">Araçlarınız</p>
      <UButton label="Araç Ekle" color="neutral" variant="subtle" size="lg" @click="isAddVehicleModalOpen = true"/>
   
    </div>
    <div class="flex flex-col mt-5">
      <p class="text-sm text-gray-400 border-b border-gray-700 w-full py-2 mb-2">Aktif Araçlar
        ({{ onlineVehicles.length }})</p>
      <div class="flex flex-wrap items-center justify-start gap-x-4 gap-y-4">
        <VehicleCard chip-color="green" :vehicle="vehicle" v-for="vehicle in onlineVehicles"/>
      </div>
    </div>
    <div class="flex flex-col mt-5">
      <p class="text-sm text-gray-400 border-b border-gray-700 w-full py-2 mb-2">Meşgul Araçlar
        ({{ busyVehicles.length }})</p>
      <div class="flex flex-wrap items-center justify-start gap-x-4 gap-y-4">
        <VehicleCard chip-color="red" :vehicle="vehicle" v-for="vehicle in busyVehicles"/>
      </div>
    </div>
    <div class="flex flex-col mt-5">
      <p class="text-sm text-gray-400 border-b border-gray-700 w-full py-2 mb-2">Pasif Araçlar
        ({{ offlineVehicles.length }})</p>
      <div class="flex flex-wrap items-center justify-start gap-x-4 gap-y-4">
        <VehicleCard chip-color="gray" :vehicle="vehicle" v-for="vehicle in offlineVehicles"/>
      </div>
    </div>
    <div class="flex flex-col mt-5">
      <p class="text-sm text-gray-400 border-b border-gray-700 w-full py-2 mb-2">Bakımdaki Araçlar
        ({{ inMaintenanceVehicles.length }})</p>
      <div class="flex flex-wrap items-center justify-start gap-x-4 gap-y-4">
        <VehicleCard chip-color="orange" :vehicle="vehicle" v-for="vehicle in inMaintenanceVehicles"/>
      </div>
    </div>


    <!-- Add Vehicle -->
    <UDrawer should-scale-background v-model:open="isAddVehicleModalOpen" >

        <template class="p-0 h-40" #body>
          <div class="flex flex-col h-fit gap-x-2 gap-y-5">
              <USelect v-model="addVehicleForm.vehicleId" :items="vehicles" class="w-full" size="xl" placeholder="Araç Seçin" />
              <UInput placeholder="Plaka Yazınız" v-model="addVehicleForm.plate" size="xl" class="w-full" />
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between">
            <UButton block label="Aracı Ekle" @click="confirmAddVehicle"/>
          </div>
        </template>

    </UDrawer>
    <!-- Add Vehicle -->

  </div>
</template>
<script setup lang="ts">

import {IVehicleStatus} from "~/core/api/modules/accountVehicle/models/IUpdateVehicleStatusCommand";
import VehicleCard from "~/components/VehicleCard.vue";

const {
  myVehicles,
  vehiclesDataSource
} = storeToRefs(useMyVehiclesStore());

const vehicles = computed(() => {
  return vehiclesDataSource.value.map(x => {
    return {
      label: `${x.name} - ${x.capacity} Kişi`,
      value: x.id
    }
  })
})

const selectedVehicle = ref();

const {
  addVehicle
} = useMyVehiclesStore();


const addVehicleForm = ref({
  vehicleId: '',
  plate: ''
})
const isAddVehicleModalOpen = ref(false);

const onlineVehicles = computed(() => myVehicles.value.filter(x => x.status === IVehicleStatus.Online))
const busyVehicles = computed(() => myVehicles.value.filter(x => x.status === IVehicleStatus.Busy))
const offlineVehicles = computed(() => myVehicles.value.filter(x => x.status === IVehicleStatus.Offline))
const inMaintenanceVehicles = computed(() => myVehicles.value.filter(x => x.status === IVehicleStatus.InMaintenance))

function confirmAddVehicle() {
  addVehicle(addVehicleForm.value.vehicleId, addVehicleForm.value.plate);
  isAddVehicleModalOpen.value = false;
}

</script>