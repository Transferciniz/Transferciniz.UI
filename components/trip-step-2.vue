<template>
  <div class="m-0 p-0 relative">
    <div id="map" class="h-full w-full "></div>
    <div class="absolute bottom-0 right-0 w-full z-[1000]" v-if="selectedLocation">
      <div class="mx-4 my-4 rounded-md bg-gray-900">
        <div class="p-4 flex flex-col">
          <p class="text-lg">Seçilen konum rotanızda nedir?</p>
          <p class="text-sm text-red-600" v-if="selectedLocation.name != ''">{{selectedLocation.name}}</p>
          <p class="text-xs text-gray-400" v-if="selectedLocation.address != ''">{{selectedLocation.address}}</p>
          <div class="flex justify-between items-center gap-x-2 my-2">
            <div class="bg-gray-700 px-4 py-2 text-xs rounded-md flex-grow text-center" @click="addLocation(ITripLocationType.point)">Durak</div>
            <div class="bg-gray-700 px-4 py-2 text-xs rounded-md flex-grow text-center" @click="addLocation(ITripLocationType.station)">İstasyon</div>
            <div class="bg-gray-700 px-4 py-2 text-xs rounded-md flex-grow text-center" @click="addLocation(ITripLocationType.waitPoint)">Mola Alanı</div>
            <div class="bg-gray-700 px-4 py-2 text-xs rounded-md flex-grow text-center" @click="addLocation(ITripLocationType.finalDestination)">Varış Noktası</div>
          </div>
          <div class="flex justify-between my-2">
            <div class="bg-red-700 text-white px-4 py-2 text-xs rounded-md flex-grow text-center" @click="selectedLocation = null">İptal</div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 right-0 w-full z-[1000]" v-if="selectedLocation == null">
      <div class="bg-gray-900 rounded-md mx-4 my-4 py-4 text-center text-white" v-if="isRouteShowing == false && isRouteCanShow" @click="calculateRoute()">Rotayı Göster</div>

      <div class="mx-4 my-4 rounded-md bg-gray-900" v-if="isRouteShowing">
        <div class="p-4 flex flex-col gap-y-2">
          <div class="grid grid-cols-2 divide-x">
            <div class="flex flex-col items-center justify-center">
              <Icon name="material-symbols:timer" size="30"/>
              <p>{{totalTimeAsMinute}} Dakika</p>
            </div>
            <div class="flex flex-col items-center justify-center">
              <Icon name="lets-icons:road-alt-light" size="30"/>
              <p>{{totalDistanceTextAsKilometer}} Km</p>
            </div>
          </div>

          <div class="flex justify-between gap-x-4 my-2">
            <div class="bg-gray-700 px-4 py-2 text-sm rounded-md flex-grow text-center" @click="isRouteShowing =false" >Düzenle</div>
            <div class="bg-green-900 px-4 py-2 text-sm rounded-md flex-grow text-center" @click="selectedLocation = null">Rotayı Onayla</div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute top-0 right-0 w-full z-[1000]">
      <div class="mx-2 my-4 rounded-md p-4 ">
        <div class="flex flex-col bg-gray-900 rounded-md">
          <UInput
              icon="i-heroicons-magnifying-glass-20-solid"
              size="xl"
              class="w-full"
              color="white"
              v-model="searchInput"
              :trailing="false"
              @click="isSearchPanelVisible = true"
              placeholder="Kişi, işletme, cadde yada bir sokak arayın."
          />
          <div class="p-4 flex flex-col justify-center items-center" v-if="isSearchPanelVisible">
            <Icon name="eos-icons:bubble-loading" :size="30" v-if="isSearching" />
            <div v-else class="flex flex-col items-start justify-start gap-y-2 w-full">
              <div class="text-xs text-gray-600" v-if="userSearchResults.length > 0">Kişiler</div>
              <div v-for="user in userSearchResults" class="text-xs flex justify-start items-center gap-x-2 ">
                <UAvatar :src="user.profilePicture" :alt="user.name + ' ' + user.surname" size="sm" />
                <p>{{user.name}} {{user.surname}}</p>
              </div>
              <div class="text-xs text-gray-600" v-if="searchResults.length > 0">Harita Sonuçları</div>
              <div class="flex flex-col max-h-[300px] overflow-y-scroll gap-y-2">
                <div v-for="location in searchResults" class="text-xs" @click="selectLocation(location)">
                  <p>{{location.name}}</p>
                  <p class="opacity-50">{{location.address}}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {MapContext} from "~/core/app/MapContext";
import {GoogleProvider} from "leaflet-geosearch";
import {type ILocationSearchResult, ITripLocationType} from "~/core/app/ITripLocation";

const {
  searchInput,
    totalDistanceTextAsKilometer,
    isSearchPanelVisible,
    searchResults,
    totalTimeAsMinute,
    isSearching,
    isRouteShowing,
    isRouteCanShow,
    endDate,
    tripType,
    totalPeople,
    selectedLocation,
    tripName,
    startDate,
    userSearchResults
} = storeToRefs(useCreateTripStore())

const {
  addLocation,
    selectLocation,
    createMap,
    calculateRoute
} = useCreateTripStore();

onMounted(() => {
  nextTick(() => {
    createMap();
  })
})

</script>