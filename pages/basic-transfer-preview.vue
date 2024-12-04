<template>
  <div class="flex flex-col h-full">

    <div class="relative flex-1 w-full flex flex-col" v-show="step == 0">
      <div ref="mapboxContainer" class="rounded-md flex-1 w-full transition-all ease-in-out"></div>
      <div class="absolute bottom-0 left-0 flex flex-col p-4 w-full">
        <div class="bg-gray-900 p-4 w-full rounded-md flex flex-col">

          <div class="flex justify-between items-center w-full mb-2">
            <div class="flex justify-center flex-1 items-center gap-x-2">
              <Icon name="lets-icons:road-alt-fill" size="30" />
              <p v-if="routingSummary">{{ (routingSummary.distance / 1000).toFixed(2) }} KM</p>
              <p v-else>0 KM</p>
            </div>
            <USeparator orientation="vertical" class="h-10" />
            <div class="flex justify-center flex-1 items-center gap-x-2">
              <Icon name="material-symbols:nest-clock-farsight-analog-outline-rounded" size="30" />
              <p v-if="routingSummary">{{ (routingSummary.duration / 60).toFixed(0) }} Dakika</p>
              <p v-else>0 Dakika</p>
            </div>
          </div>


          <USeparator />
          <div class="flex justify-between items-center w-full gap-x-2 mt-2">
            <UButton label="Durak Ekle" block color="error" variant="subtle"
              @click="isAddWaypointModalVisible = true" />
            <USeparator orientation="vertical" class="h-10" />
            <UButton label="Araçları Göster" block color="neutral" variant="subtle" @click="step = 1" />
          </div>
        </div>


      </div>
    </div>


    <div class="flex flex-col p-4" v-show="step == 1">
      <div class="flex flex-col gap-y-2 p-2">
        <div class="flex justify-start items-center gap-x-2">
          <UButton label="Geri Dön" variant="subtle" color="neutral" @click="step= 0"/>
          <p class="text-xl">Aracınızı Seçin</p>
        </div>
        <div class="flex flex-col divide-y divide-gray-900 gap-y-2 bg-gray-700 rounded-md p-4"
          v-for="combinations in vehicleCombinations">
          <template v-for="vehicle in combinations.vehicles">
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
            <div class="bg-red-700 text-white text-xs px-4 py-2 rounded-md" @click="createTransfer(combinations)">Seç ve
              Ödemeye
              Devam Et</div>
          </div>
        </div>


      </div>


    </div>



    <UDrawer v-model:open="isAddWaypointModalVisible" direction="top">
      <template #body>
        <div class="flex flex-col rounded-md mt-2">
          <UInput icon="i-heroicons-magnifying-glass-20-solid" size="xl" class="w-full" color="white"
            v-model="locationSearchInput" :trailing="false" @click="locationIsSearchPanelVisible = true"
            placeholder="Bir yer arayın..." />
          <div class="flex flex-col w-full justify-center items-center" v-if="locationIsSearchPanelVisible">
            <Icon name="eos-icons:bubble-loading" :size="30" v-if="locationIsSearching" />
            <div v-else class="flex flex-col items-start justify-start gap-y-2 w-full">
              <div class="flex flex-col max-h-[300px] overflow-y-scroll gap-y-2 w-full mt-2">
                <div v-for="location in locationSearchResults" class="text-xs bg-gray-800 p-2 rounded-md"
                  @click="addNewWaypoint(location)">
                  <p class=text-lg>{{ location.name }}</p>
                  <p class="opacity-50">{{ location.address }}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </template>
    </UDrawer>
    <UDrawer v-model:open="isWaypointEditModalVisible" direction="top">
      <template #body>
        <div class="flex flex-col">
          <div class="flex justify-start items-center border-b border-b-gray-700 p-5 gap-x-2">
            <Icon name="material-symbols:arrow-back-ios-new" class="w-10" size="30"
              @click="isWaypointEditModalVisible = false" />
            <p class="w-full text-center text-lg">Rotayı Düzenle</p>
            <Icon name="material-symbols:check-rounded" class="w-10" size="30"
              @click="isWaypointEditModalVisible = false" />
          </div>
          <div class="flex flex-col h-[300px] overflow-y-scroll">
            <div class="flex justify-center items-center p-4">
              <p class="text-xl">{{ totalAddedPeopleCount }}/{{ preDefinedPeopleCount }} Kişi Eklendi</p>
            </div>
            <div class="flex flex-col p-4" v-for="waypoint in waypoints">
              <div class="flex justify-between items-center">
                <p>{{ waypoint.name }} - {{ waypoint.users.length }} Kişi</p>
                <div class="bg-gray-700 text-xs px-4 py-2 rounded-md" @click="openUserEditModal(waypoint)">Kişi Ekle
                </div>
              </div>
              <div class="flex flex-wrap justify-start items-center gap-x-2 gap-y-2 mt-2">
                <div class="flex flex-col bg-gray-700 rounded-md items-center justify-center p-4"
                  v-for="user in waypoint.users">
                  <UAvatar :src="user.profilePicture" :size="'3xl'" :alt="user.name + ' ' + user.surname" />
                  <p class="text-sm">{{ user.name }}</p>
                  <p class="text-sm">{{ user.surname }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UDrawer>
    <UDrawer v-model:open="isUserEditModalVisible" direction="top">
      <template #body>
        <UCard>
          <template #header>
            <p>Seçilen Konum: {{ selectedWaypoint?.name }}</p>
          </template>
          <template class="p-0 h-40" #default>
            <div class="flex flex-col h-fit gap-x-2">
              <UTabs color="neutral" :content="false" v-model:model-value="currentUserEditTab" :items="userEditTabs"
                class="w-full" />

              <div class="flex flex-col gap-y-2 mt-4" v-if="currentUserEditTab == '0'">
                <UInput icon="i-heroicons-magnifying-glass-20-solid" size="xl" class="w-full mb-2" color="white"
                  v-model="searchInput" :trailing="false" @click="isSearchPanelVisible = true"
                  placeholder="Kişi arayın" />
                <div v-for="user in searchResults" class="text-xs flex justify-start items-center gap-x-2 ">
                  <UAvatar :src="user.profilePicture" :alt="user.name + ' ' + user.surname" size="3xl" />
                  <p class="text-lg">{{ user.name }} {{ user.surname }}</p>
                  <div class="flex-grow flex-1"></div>
                  <UButton color="success" variant="soft" label="Ekle" @click="selectUser(user)" />
                </div>
              </div>

              <div class="flex flex-col mt-4" v-if="currentUserEditTab == '1'">
                <div class="flex flex-col h-fit gap-y-2">

                  <UFormField label="Adı" size="lg">
                    <UInput class="w-full" placeholder="Kişi adını yazınız" v-model:model-value="newUserForm.name" />
                  </UFormField>

                  <UFormField label="Soyadı" size="lg">
                    <UInput class="w-full" placeholder="Kişi soyadını yazınız"
                      v-model:model-value="newUserForm.surname" />
                  </UFormField>

                  <UButton label="Durağa Ekle" color="success" variant="soft" block @click="addNewUser" />






                </div>
              </div>

              <div class="flex flex-col mt-6 gap-y-2">
                <p class="text-xs opacity-50 mb-2">Duraktaki Kişiler</p>
                <div v-if="selectedWaypoint?.users.length == 0"
                  class="h-60 flex items-center justify-center text-center">
                  <p>Şu an bu durakta kimse yok.</p>
                </div>
                <template v-else>
                  <div class="flex flex-wrap gap-x-3 justify-start items-start">

                    <div v-for="user in selectedWaypoint?.users"
                      class="text-xs flex flex-col justify-center items-center gap-y-1">
                      <UAvatar :src="user.profilePicture" :alt="user.name + ' ' + user.surname" size="3xl"
                        class="size-24" />
                      <div class="flex flex-col justify-center items-center">
                        <p class="text-xs">{{ user.name }}</p>
                        <p class="text-xs">{{ user.surname }}</p>
                      </div>
                      <UButton label="Sil" color="error" variant="soft" icon="material-symbols:delete"
                        @click="deleteUserFromWaypoint(selectedWaypoint!, user)" />
                    </div>

                  </div>
                </template>
              </div>

            </div>
          </template>


        </UCard>
      </template>
    </UDrawer>

  </div>
</template>

<script setup lang="ts">

import type { ILocationSearchResult, IWaypoint } from "~/core/app/ITripLocation";
import mapboxgl, { Marker } from "mapbox-gl";
import type { IVehicleCombinationPricePair } from "~/core/api/modules/trip/models/IVehicleCombination";
import { routing } from "leaflet";

const mapboxContainer = ref<HTMLElement>();
const mapbox = ref<mapboxgl.Map>();
const isWaypointEditModalVisible = ref(false);
const selectedWaypointId = ref<number>();
const selectedWaypoint = computed(() => waypoints.value.find(x => x.id == selectedWaypointId.value))
const isUserEditModalVisible = ref(false);
const newUserForm = ref<{ name: string, surname: string }>({ name: '', surname: '' })
const newUserAddMethod = ref<'search' | 'add'>('search');
const isRouteDefined = ref(false);
const waypointMarkers = ref<any[]>([]);
const isAddWaypointModalVisible = ref(false);

const step = ref(0);

const userEditTabs = ref([
  {
    label: 'Kişi Ara'
  },
  {
    label: 'Yeni Kişi ekle'
  }
])
const currentUserEditTab = ref('0')
const {
  waypoints,
  preDefinedPeopleCount,
  vehicleCombinations,
  routingSummary,
  totalWaypoints,
  totalAddedPeopleCount
} = storeToRefs(useCreateTransferStore());

const {
  searchResults,
  searchInput,
  isSearching,
  isSearchPanelVisible,
} = storeToRefs(useUserSearchStore())

const {
  searchResults: locationSearchResults,
  isSearchPanelVisible: locationIsSearchPanelVisible,
  isSearching: locationIsSearching,
  searchInput: locationSearchInput,
} = storeToRefs(useLocationSearchStore())

const {
  increasePeopleCount,
  decreasePeopleCount,
  setRoutingSummary,
  addUserToWaypoint,
  deleteUserFromWaypoint,
  addWaypoint,
  createTrip,
  updateWaypointLatLang
} = useCreateTransferStore();

watch(waypoints, value => {
  if (isRouteDefined.value) {
    drawWaypointMarkers(value);
    drawRoute();
  }
}, { deep: true })

function drawWaypointMarkers(value: IWaypoint[]) {
  waypointMarkers.value.forEach((item) => {
    item.marker
    item.marker.remove();
  })
  value.forEach((waypoint) => {
    const marker = new mapboxgl.Marker({
      element: useMapbox().createWaypointMarker(waypoint.users.length),
      draggable: true,

    }).setLngLat([waypoint.longitude, waypoint.latitude]).addTo(mapbox.value!);
    marker.on('dragend', event => {
      updateWaypointLatLang(event.target._lngLat.lat, event.target._lngLat.lng, waypoint.id)
    })
    marker.getElement().addEventListener('click', () => {
      openUserEditModal(waypoint);
    })
    waypointMarkers.value.push({
      marker: marker,
      waypointId: waypoint.id
    });
  })
}


onMounted(() => {
  mapbox.value = useMapbox().createMap(mapboxContainer.value, { latitude: 0, longitude: 0 })
  mapbox.value.on('load', () => {
    useMapbox().fetchRouteData(totalWaypoints.value).then(res => {
      setRoutingSummary(res.features[0].properties.summary);
      useMapbox().drawRoute(mapbox.value!, res);
      isRouteDefined.value = true;
      drawWaypointMarkers(waypoints.value);
    })
  })
})

onBeforeUnmount(() => {
  mapbox.value?.remove();
})


function selectUser(e: any) {

  addUserToWaypoint(selectedWaypoint!.value!, {
    name: e.name,
    surname: e.surname,
    userId: e.id,
    profilePicture: e.profilePicture,
  })
}

function addNewWaypoint(location: ILocationSearchResult) {
  addWaypoint({
    id: Date.now(),
    latitude: location.latitude,
    name: location.name,
    longitude: location.longitude,
    ordering: waypoints.value.length + 1,
    users: [],
    marker: {}
  });
  isAddWaypointModalVisible.value = false;
  drawRoute();
}

function drawRoute() {
  useMapbox().fetchRouteData(totalWaypoints.value).then(res => {
    setRoutingSummary(res.features[0].properties.summary);
    useMapbox().drawRoute(mapbox.value!, res);
    isRouteDefined.value = true;
    drawWaypointMarkers(waypoints.value);
  })
}

function addNewUser() {
  addUserToWaypoint(selectedWaypoint!.value!, {
    name: newUserForm.value.name,
    surname: newUserForm.value.surname
  })
  newUserForm.value = { name: '', surname: '' };
}
function openUserEditModal(waypoint: IWaypoint) {
  selectedWaypointId.value = waypoint.id;
  isWaypointEditModalVisible.value = false;
  isUserEditModalVisible.value = true;
}

function createTransfer(selectedVehicleCombinations: IVehicleCombinationPricePair) {
  createTrip(selectedVehicleCombinations);
}
</script>