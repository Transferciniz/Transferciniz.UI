<template>
  <div class="flex flex-col">
    <div class="flex flex-col p-4">
      <div class="flex flex-col gap-y-2 p-2">
        <div class="flex justify-start items-center gap-x-2">
          <UButton label="Geri Dön" variant="subtle" color="neutral" to="/"/>
          <p class="text-xl">Aracınızı Seçin</p>
        </div>
        <div class="flex flex-col divide-y divide-gray-900 gap-y-2 bg-gray-700 rounded-md p-4" v-for="combinations in vehicleCombinationsDataSource">
          <template v-for="vehicle in combinations.combinations">
            <div class="flex justify-between items-center gap-x-2">
              <img :src="vehicle.vehicle.vehicleModel.photo" alt="vito" class="w-40 object-contain" />
              <p class="text-3xl">{{ vehicle.usage }}x</p>
              <div class="flex flex-col">
                <p class="text-xs">{{ vehicle.vehicle.vehicleBrand.name }}</p>
                <p class="text-3xl mt-[-5px]">{{ vehicle.vehicle.vehicleModel.name }}</p>
                <div class="flex justify-start items-center gap-x-3">
                  <div class="flex justify-start items-center gap-x-1">
                    <Icon name="material-symbols:person" size="20" />
                    <p>{{ vehicle.vehicle.vehicleModel.capacity }}</p>
                  </div>
                  <div class="flex justify-start items-center gap-x-1">
                    <Icon name="streamline:baggage" size="16" />
                    <p>{{ 4 }}</p>
                  </div>
                  <div class="bg-gray-900 px-4 py-1 text-xs text-center rounded-md">Lüks</div>
                </div>
              </div>
            </div>
          </template>
          <div class="flex justify-between items-center pt-3">
            <p class="text-2xl">{{ combinations.totalPrice }} ₺</p>
            <div class="bg-red-700 text-white text-xs px-4 py-2 rounded-md" @click="setSelectedVehicleCombination(combinations)">Seç ve
              Ödemeye
              Devam Et</div>
          </div>
        </div>


      </div>


    </div>

  </div>
</template>

<script lang="ts" setup>

const {vehicleCombinationsDataSource} = storeToRefs(useServicePlannerStore())
const {setSelectedVehicleCombination} = useServicePlannerStore()
</script>

<style>

</style>