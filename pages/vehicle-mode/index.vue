<template>
  <div class="flex flex-col">
    <div class="flex justify-between items-center p-4">
      
      <p class="text-3xl font-bold flex-1">Sürüş Modu</p>
      <div class="flex flex-col justify-end items-end">
        <div>
          <UBadge :label="`${user.name} ${user.surname}`" color="neutral" />
        </div>
        <p class="text-xs">{{ accountVehicle?.name }} - {{ accountVehicle?.plate }}</p>
      </div>

    </div>

    <div class="p-4">
      <VehicleProblems :problems="vehicleProblems" @on-update="getProblems()"/>
    </div>


    <div class="flex flex-col px-4 gap-y-2">
      <div class="flex justify-between items-center gap-x-2">
        <UButton label="Sorun Bildirimi Yap" block color="warning" variant="subtle" icon="mingcute:warning-line"
          @click="isAddProblemDrawerOpen = true" />
        <UButton label="Araçla İlişkimi Kes" block color="error" variant="subtle" @click="removeAccountToVehicle"
          icon="material-symbols:close-rounded" />
      </div>
    </div>

    <div class="flex flex-col backdrop-blur-sm p-4 m-4 border-white/20 border rounded-md" v-if="trips.length > 0">
      <p class="text-xs">Sıradaki İşiniz</p>
      <div class="flex flex-col justify-between">
        <p class="text-lg">{{ trips[0].name }}</p>
        <p class="text-xs">{{ trips[0].trip.startDate }}</p>
        <div ref="map" class="w-full rounded-md h-[300px] mt-2"></div>
        <div class="bg-red-600 text-white text-center px-8 py-2 rounded-md mt-2" @click="startTrip(trips[0])">
          <span v-if="trips[0].trip.status == 1">Transferi Başlat</span>
          <span v-if="trips[0].trip.status == 2">Transfere Devam Et</span>
        </div>
      </div>
    </div>

    <div class="p-4 flex flex-col gap-y-2" v-if="incomingTrips.length > 0">
      <div class="text-lg">Yaklaşan İşleriniz ({{ incomingTrips.length }})</div>
      <div v-for="trip in incomingTrips" class="bg-gray-700 p-2 px-4 rounded-md flex justify-between">
        <div class="flex justify-start items-center gap-x-2">
          <p>{{ trip.name }}</p>
          <p class="text-xs opacity-50">{{ trip.trip.waypoints.length }} Durak</p>
        </div>
      </div>
    </div>


    <UDrawer direction="bottom" should-scale-background v-model:open="isAddProblemDrawerOpen" title="Sorun Bildirim Yap"
      description="Araçla alakalı sorunları araç sahibi firmaya bildirin.">
      <template #body>
        <UTextarea autoresize placeholder="Lütfen araçla alakalı yaşadığınız sorunu yazınız..." class="w-full"
          v-model:model-value="drawerProblemText" />
      </template>
      <template #footer>
        <div class="flex items-center justify-between gap-x-3">
          <UButton block label="Gönder" color="success" variant="solid" loading-auto @click="addProblem" />
          <UButton block label="İptal Et" color="neutral" variant="soft" @click="isAddProblemDrawerOpen = false" />
        </div>
      </template>
    </UDrawer>


  </div>
</template>

<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { TripStatus } from "~/core/api/modules/trip/models/ITripHeaderDto";
import { useApi } from "~/core/api/useApi";

const {
  accountVehicle,
  trips,
  accountVehicleId
} = storeToRefs(useVehicleModeStore());

const incomingTrips = computed(() => {
  return trips.value.filter(x => x.trip.status == TripStatus.Approved)
})

const { user } = storeToRefs(useAuthStore());


const map = ref();
const mapbox = ref<mapboxgl.Map>()

const isAddProblemDrawerOpen = ref(false);
const drawerProblemText = ref("");
const vehicleProblems = ref<any[]>([]);

function startTrip(trip: any) {
  useVehicleModeStore().startTrip(trip)
}


onMounted(() => {
  useVehicleModeStore().getVehicleTrips().then(() => {
    mapbox.value = useMapbox().createMap(map.value, { latitude: 0, longitude: 0 });
    mapbox.value.on('load', () => {
      useMapbox().fetchRouteData(trips.value[0].trip.waypoints as any[]).then((res) => {
        useMapbox().drawRoute(mapbox.value!, res)
        new mapboxgl.Marker({
          element: useMapbox().createStartMarker(),
          draggable: false,

        }).setLngLat([res.features[0].geometry.coordinates[0][0], res.features[0].geometry.coordinates[0][1]]).addTo(mapbox.value!);
        new mapboxgl.Marker({
          element: useMapbox().createFinishMarker(),
          draggable: false,

        }).setLngLat([res.features[0].geometry.coordinates[res.features[0].geometry.coordinates.length - 1][0], res.features[0].geometry.coordinates[res.features[0].geometry.coordinates.length - 1][1]]).addTo(mapbox.value!);

      });
    })
  })
  getProblems();
})

function addProblem(): Promise<any> {
  return useApi().accountVehicle.AddProblem({
    message: drawerProblemText.value,
    accountVehicleId: accountVehicleId.value
  }).then(() => {
    isAddProblemDrawerOpen.value = false;
    getProblems();
  })
}

function getProblems() {
  useApi().accountVehicle.GetProblems(accountVehicleId.value).then(res => {
    vehicleProblems.value = res.data;
  })
}

onBeforeUnmount(() => {
  mapbox.value?.remove();
})

function removeAccountToVehicle(){
  useVehicleModeStore().removeAccountToVehicle();
}
</script>