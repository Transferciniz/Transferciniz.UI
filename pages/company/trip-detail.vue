<template>
  <div class="h-screen w-screen fixed top-0 left-0">
    <div class="absolute inset-0 w-full top-0 left-0 z-[11]">
      <div class="flex justify-between items-center p-4">
        <div class="bg-gray-900 px-2 py-1 text-center text-xs" @click="isVehiclesModalVisible = true">Araçları Göster</div>
        <div class="bg-gray-900 px-2 py-1 text-center text-xs">Seçili Rotaları Göster</div>
      </div>
    </div>
    <div id="company-map" class="h-screen w-screen z-[10]"></div>
    <UModal v-model="isVehiclesModalVisible" :overlay="true" :prevent-close="false" :class="'z-[10000]'" :ui="{height: 'h-full'}">
      <UCard>
        <template #header>
          <p>Araçlar</p>
        </template>
        <template  #default>
          <div class="flex flex-col gap-y-2">
            <div class="bg-gray-800 flex flex-col p-2 rounded"  v-for="trip in tripDetails" >
              <div class="flex justify-between items-center ">
                <p class="text-sm">{{trip.vehicleName}}</p>
                <p class="text-xs bg-white border-black rounded text-black px-4 py-1">{{trip.vehiclePlate}}</p>
              </div>
              <template v-for="(waypoint, index) in trip.waypoints">
                <div class="flex flex-col" v-if="index != trip.waypoints.length - 1">
                  <ol class="relative border-s border-gray-700 text-gray-400 ml-4 mt-2" :class="{'border-s': index != trip.waypoints.length - 2}">
                    <li class="mb-10 ms-6">
                      <Icon mode="svg" name="material-symbols:person-pin-circle-outline-rounded" size="2" class=" p-1 absolute flex items-center justify-center w-8 h-8  rounded-full -start-4 ring-4 ring-gray-900 bg-gray-700"/>
                      <h3 class="font-medium leading-tight">{{waypoint.name}}</h3>
                      <UAvatarGroup size="md" :max="4" class="mt-2">
                        <UAvatar :src="user.profilePicture" :alt="user.name + ' ' + user.surname" v-for="user in waypoint.users"/>
                      </UAvatarGroup>
                    </li>
                    <li class="mb-10 ms-6" v-if="index == trip.waypoints.length - 2">
                      <Icon mode="svg" name="lets-icons:road-finish-fill" size="2" class=" p-1 absolute flex items-center justify-center w-8 h-8 text-white  rounded-full -start-4 ring-4 ring-green-900 bg-green-700"/>
                      <h3 class="font-medium leading-tight">Varış Noktası</h3>

                    </li>
                  </ol>
                </div>
              </template>

            </div>
          </div>
        </template>


      </UCard>
    </UModal>
  </div>
</template>
<script setup lang="ts">
const {$L: L} = useNuxtApp()

const {
  tripDetails
} = storeToRefs(useCompanyTripStore())

const map = ref<L.Map>();
const routings = ref<Map<string, typeof L.Routing.Control>>(new Map<string, typeof L.Routing.Control>())
const isVehiclesModalVisible = ref(false);
onMounted(() => {
  map.value = useMap('company-map');
  tripDetails.value.map((trip, index) => {
    routings.value.set(trip.id, useRouting(map.value!, trip.waypoints, index))
  })
})


</script>

<style lang="css">
.leaflet-control-container{
  display: none;
}
</style>