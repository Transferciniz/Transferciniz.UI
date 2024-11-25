<template>
  <div class="flex flex-col">
    <div class="flex flex-col p-4">
      <div class="relative">
        <div ref="mapboxContainer" class="rounded-md h-[300px] w-full transition-all ease-in-out"></div>
      </div>
      <div class="flex justify-between items-center p-4 px-10" v-if="routingSummary">
        <div class="bg-gray-800 rounded-full flex justify-between items-center w-full p-2 px-8 mt-[-40px] z-[10]">
          <div class="flex justify-start items-center gap-x-2">
            <Icon name="lets-icons:road-alt-fill" size="30"/>
            <p>{{ (routingSummary.distance / 1000).toFixed(2) }} KM</p>
          </div>
          <div class="flex justify-start items-center gap-x-2">
            <Icon name="material-symbols:nest-clock-farsight-analog-outline-rounded" size="30"/>
            <p>{{ (routingSummary.duration / 60).toFixed(0) }} Dakika</p>
          </div>
        </div>
      </div>

      <div class="flex justify-center items-center">
        <div class="bg-red-700 rounded-b-full px-8 text-center py-2 text-sm mt-[-16px] z-[10]" @click="isAddWaypointModalVisible = true">Ara Durak Ekle</div>
      </div>

      <div class="flex justify-between items-center mt-4 mx-2">
        <p class="text-xl w-1/2">Kişi Sayısı</p>
        <div class="text-xs" @click="isWaypointEditModalVisible = true">Kişileri Düzenle</div>
        <div class="flex justify-end items-center gap-x-5">
          <Icon name="gravity-ui:circle-minus" size="40" @click="decreasePeopleCount"/>
          <p class="text-xl bg-gray-700 px-4 py-2 rounded-md">{{ preDefinedPeopleCount }}</p>
          <Icon name="material-symbols:add-circle-outline-rounded" size="40" @click="increasePeopleCount"/>
        </div>
      </div>

      <div class="flex flex-col gap-y-2 p-2">
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
                    <Icon name="material-symbols:person" size="20"/>
                    <p>{{ vehicle.vehicle.vehicleModel.capacity }}</p>
                  </div>
                  <div class="flex justify-start items-center gap-x-1">
                    <Icon name="streamline:baggage" size="16"/>
                    <p>{{ 4 }}</p>
                  </div>
                  <div class="bg-gray-900 px-4 py-1 text-xs text-center rounded-md">Lüks</div>
                </div>
              </div>
            </div>
          </template>
          <div class="flex justify-between items-center pt-3">
            <p class="text-2xl">{{ combinations.totalPrice }} ₺</p>
            <div class="bg-red-700 text-white text-xs px-4 py-2 rounded-md" @click="createTransfer(combinations)">Seç ve Ödemeye Devam Et</div>
          </div>
        </div>

      </div>

    </div>
    <UDrawer v-model:open="isAddWaypointModalVisible" direction="top">
      <template #body>
        <div class="flex flex-col bg-gray-900 rounded-md p-2 mt-2">
          <UInput
              icon="i-heroicons-magnifying-glass-20-solid"
              size="xl"
              class="w-full"
              color="white"
              v-model="locationSearchInput"
              :trailing="false"
              @click="locationIsSearchPanelVisible = true"
              placeholder="Bir yer arayın..."
          />
          <div class="p-4 flex flex-col justify-center items-center" v-if="locationIsSearchPanelVisible">
            <Icon name="eos-icons:bubble-loading" :size="30" v-if="locationIsSearching" />
            <div v-else class="flex flex-col items-start justify-start gap-y-2 w-full">
              <div class="flex flex-col max-h-[300px] overflow-y-scroll gap-y-2">
                <div v-for="location in locationSearchResults" class="text-xs" @click="addNewWaypoint(location)">
                  <p>{{location.name}}</p>
                  <p class="opacity-50">{{location.address}}</p>
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
            <Icon name="material-symbols:arrow-back-ios-new" class="w-10" size="30" @click="isWaypointEditModalVisible = false"/>
            <p class="w-full text-center text-lg">Rotayı Düzenle</p>
            <Icon name="material-symbols:check-rounded" class="w-10" size="30" @click="isWaypointEditModalVisible = false"/>
          </div>
          <div class="flex flex-col h-[300px] overflow-y-scroll">
            <div class="flex justify-center items-center p-4">
              <p class="text-xl">{{totalAddedPeopleCount}}/{{preDefinedPeopleCount}} Kişi Eklendi</p>
            </div>
            <div class="flex flex-col p-4" v-for="waypoint in waypoints">
              <div class="flex justify-between items-center">
                <p>{{waypoint.name}} - {{waypoint.users.length}} Kişi</p>
                <div class="bg-gray-700 text-xs px-4 py-2 rounded-md" @click="openUserEditModal(waypoint)">Kişi Ekle</div>
              </div>
              <div class="flex flex-wrap justify-start items-center gap-x-2 gap-y-2 mt-2">
                <div class="flex flex-col bg-gray-700 rounded-md items-center justify-center p-4" v-for="user in waypoint.users">
                  <UAvatar :src="user.profilePicture" :size="'3xl'" :alt="user.name + ' ' + user.surname" />
                  <p class="text-sm">{{user.name}}</p>
                  <p class="text-sm">{{user.surname}}</p>
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
            <p>Seçilen Konum: {{selectedWaypoint?.name}}</p>
          </template>
          <template class="p-0 h-40" #default>
            <div class="flex flex-col h-fit gap-x-2">
              <div class="flex justify-between gap-x-2 items-center text-xs mb-2">
                <div class="text-white px-4 py-1 rounded border flex-grow text-center opacity-50" :class="{'bg-gray-700 !opacity-100' :newUserAddMethod == 'search'}" @click="newUserAddMethod = 'search'">Kişi Ara</div>
                <div class="text-white px-4 py-1 rounded border flex-grow text-center opacity-50" :class="{'bg-gray-700 !opacity-100' :newUserAddMethod == 'add'}" @click="newUserAddMethod = 'add'">Yeni Kişi Ekle</div>
              </div>
              <div class="flex flex-col gap-y-2" v-if="newUserAddMethod == 'search'">
                <UInput
                    icon="i-heroicons-magnifying-glass-20-solid"
                    size="xl"
                    class="w-full mb-2"
                    color="white"
                    v-model="searchInput"
                    :trailing="false"
                    @click="isSearchPanelVisible = true"
                    placeholder="Kişi arayın"
                />
                <div v-for="user in searchResults" class="text-xs flex justify-start items-center gap-x-2 ">
                  <UAvatar :src="user.profilePicture" :alt="user.name + ' ' + user.surname" size="sm" />
                  <p>{{user.name}} {{user.surname}}</p>
                  <div class="flex-grow"></div>
                  <div class="bg-gray-700 px-4 py-2 rounded" @click="selectUser(user)">Durağa Ekle</div>
                </div>
              </div>

              <div class="flex flex-col" v-if="newUserAddMethod == 'add'">
                <div class="flex flex-col h-fit gap-y-2">
                  <div class="flex justify-start items-center gap-x-2">
                    <label class="text-sm font-medium text-white flex-grow">Adı:</label>
                    <input type="text"  placeholder="" v-model="newUserForm.name"
                           class="bg-gray-50 border w-3/4 text-sm border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block  px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           required>
                  </div>
                  <div class="flex justify-start items-center gap-x-2">
                    <label class="text-sm font-medium text-white flex-grow">Soyadı:</label>
                    <input type="text"  placeholder="" v-model="newUserForm.surname"
                           class="bg-gray-50 border w-3/4 text-sm border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block  px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           required>
                  </div>
                  <div class="bg-green-900 text-white text-center px-4 py-2 rounded text-sm" @click="addNewUser">Durağa Ekle</div>
                </div>
              </div>

              <div class="flex flex-col mt-6 gap-y-2">
                <p class="text-xs opacity-50 mb-2">Duraktaki Kişiler</p>
                <div v-if="selectedWaypoint?.users.length == 0" class="h-60 flex items-center justify-center text-center">
                  <p>Şu an bu durakta kimse yok.</p>
                </div>
                <template v-else>
                  <div v-for="user in selectedWaypoint?.users" class="text-xs flex justify-start items-center gap-x-2">
                    <UAvatar :src="user.profilePicture" :alt="user.name + ' ' + user.surname" size="sm" />
                    <p>{{user.name}} {{user.surname}}</p>
                    <div class="flex-grow"></div>
                    <div class="flex justify-center items-center bg-yellow-300 text-black rounded p-2 gap-x-2 opacity-25">
                      Araç Değiştir
                      <Icon name="material-symbols:car-tag-sharp" size="20"/>
                    </div>
                    <div class="flex justify-center items-center bg-red-800 text-white rounded p-2 gap-x-2" @click="deleteUserFromWaypoint(selectedWaypoint!,user)">
                      Sil
                      <Icon name="material-symbols:delete" size="20"/>
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

import type {ILocationSearchResult, IWaypoint} from "~/core/app/ITripLocation";
import mapboxgl, {Marker} from "mapbox-gl";
import type {IVehicleCombinationPricePair} from "~/core/api/modules/trip/models/IVehicleCombination";

const {location} = storeToRefs(useLocationStore())
const mapboxContainer = ref<HTMLElement>();
const mapbox = ref<mapboxgl.Map>();
const isWaypointEditModalVisible = ref(false);
const selectedWaypointId = ref<number>();
const selectedWaypoint = computed(() => waypoints.value.find(x => x.id == selectedWaypointId.value))
const isUserEditModalVisible = ref(false);
const newUserForm = ref<{name: string, surname: string}>({name: '', surname: ''})
const newUserAddMethod = ref<'search' | 'add'>('search');
const isRouteDefined = ref(false);
const waypointMarkers = ref<any[]>([]);
const isAddWaypointModalVisible = ref(false);
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
  if(isRouteDefined.value){
    drawWaypointMarkers(value);
    drawRoute();
  }
}, {deep: true})

function drawWaypointMarkers(value: IWaypoint[]){
  waypointMarkers.value.forEach((item) => {
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
    waypointMarkers.value.push({
      marker: marker,
      waypointId: waypoint.id
    });
  })
}


onMounted(() => {
  mapbox.value = useMapbox().createMap(mapboxContainer.value, {latitude: 0, longitude: 0})
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


function selectUser(e: any){
  addUserToWaypoint(selectedWaypoint!.value!, {
    name: e.name,
    surname: e.surname,
    userId: e.id,
    profilePicture: e.profilePicture,
  })
}

function addNewWaypoint(location: ILocationSearchResult){
  addWaypoint({
    id: Date.now(),
    latitude: location.latitude,
    name: location.name,
    longitude: location.longitude,
    ordering: waypoints.value.length +1,
    users: [],
    marker: {}
  });
  isAddWaypointModalVisible.value = false;
  drawRoute();
}

function drawRoute(){
  useMapbox().fetchRouteData(totalWaypoints.value).then(res => {
    setRoutingSummary(res.features[0].properties.summary);
    useMapbox().drawRoute(mapbox.value!, res);
    isRouteDefined.value = true;
    drawWaypointMarkers(waypoints.value);
  })
}

function addNewUser(){
  addUserToWaypoint(selectedWaypoint!.value!, {
    name: newUserForm.value.name,
    surname:  newUserForm.value.surname
  })
  newUserForm.value = {name: '', surname: ''};
}
function openUserEditModal(waypoint: IWaypoint){
  selectedWaypointId.value = waypoint.id;
  isWaypointEditModalVisible.value = false;
  isUserEditModalVisible.value = true;
}

function createTransfer(selectedVehicleCombinations: IVehicleCombinationPricePair){
  createTrip(selectedVehicleCombinations);
}
</script>