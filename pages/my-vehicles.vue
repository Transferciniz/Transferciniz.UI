<template>
  <div class="flex flex-col p-4">
    <div class="flex items-center justify-between">
      <p class="text-xl">Araçlarınız</p>
      <div class="bg-gray-700 text-center text-white rounded px-4 py-1" @click="isAddVehicleModalOpen = true">Araç
        Ekle
      </div>
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
    <UModal v-model="isAddVehicleModalOpen" :overlay="true" :prevent-close="false" :class="'z-[10000]'"
            :ui="{height: 'h-full'}">
      <UCard>
        <template #header>
          <p>Araç Ekle</p>
        </template>
        <template class="p-0 h-40" #default>
          <div class="flex flex-col h-fit gap-x-2 gap-y-5">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Araç Seçin:</label>
              <select v-model="addVehicleForm.vehicleId"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option :value="vehicle.id" v-for="vehicle in vehiclesDataSource">{{ vehicle.name }}
                  ({{ vehicle.capacity }} Kişi)
                </option>
              </select>
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-white">Plaka:</label>
              <input type="text" placeholder="Lütfen araç plakasını yazınız" v-model="addVehicleForm.plate"
                     class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between">
            <div class="bg-gray-700 text-white px-10 py-2 w-full text-center text-sm rounded-lg"
                 @click="confirmAddVehicle">Aracı Ekle
            </div>
          </div>
        </template>

      </UCard>
    </UModal>
    <!-- Add Vehicle -->

  </div>
</template>
<script setup lang="ts">

import {AccountType} from "~/core/api/modules/auth/models/AccountType";
import {IVehicleStatus} from "~/core/api/modules/accountVehicle/models/IUpdateVehicleStatusCommand";
import VehicleCard from "~/components/VehicleCard.vue";

const {
  myVehicles,
  vehiclesDataSource
} = storeToRefs(useMyVehiclesStore())

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