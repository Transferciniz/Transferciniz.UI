<template>
  <div class="m-0 p-0 relative">
    <div id="map" class="h-full w-full "></div>
    <div class="absolute top-0 right-0 w-full z-[1000] flex justify-between gap-x-4 items-start p-2">
      <div class="bg-gray-900 rounded text-white flex justify-center items-center p-2" @click="isSearchOpen = true">
        <Icon name="ic:outline-search" size="20"/>
      </div>
      <div class="flex flex-col flex-grow items-center">
        <div class="bg-gray-900 rounded text-white w-full flex justify-center p-2">
          <p class="text-md px-2" @click="openNamePopup">{{tripName == '' ? 'İsimsiz Etkinlik' : tripName}}</p>
        </div>
        <div class="bg-gray-900 mt-[-10px] rounded-b-3xl text-white flex  justify-center items-center pb-2">
          <p class="text-xs px-6">Toplam {{totalPeople ?? 0}} Kişi | {{waypoints.length}} Durak</p>
        </div>
      </div>

      <div class="bg-gray-900 rounded text-white flex justify-center items-center p-2" @click="openDateEditPopup">
        <Icon name="material-symbols:date-range" size="20"/>
      </div>
    </div>
    <div class="absolute bottom-0 right-0 w-full z-[1000]">
        <div class="flex justify-center items-center">
          <p class="text-sm text-center p-2 mb-2 rounded-md w-2/6 m-auto bg-gray-900" @click="isAddWaypointModalOpen = true">Durak Ekle</p>
          <p class="text-sm text-center p-2 mb-2 rounded-md w-2/6 m-auto bg-gray-900" @click="setFinalDestination">Varış Noktası Ekle</p>
      </div>
    </div>



    <!-- Add Waypoint -->
    <UModal v-model="isAddWaypointModalOpen" :overlay="true" :prevent-close="false" :class="'z-[10000]'" :ui="{height: 'h-full'}">
      <UCard>
        <template #header>
          <p>Durak Ekle</p>
        </template>
        <template class="p-0 h-40" #default>
          <div class="flex flex-col h-fit gap-x-2">
            <div class="flex justify-start items-center">
              <label class="block mb-2 text-sm font-medium text-white">Durak İsmi:</label>
              <input type="text"  placeholder="" v-model="newWaypointName"
                     class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between">
            <div class="bg-gray-700 text-white px-10 py-2 w-full text-center text-sm rounded-lg" @click="addWaypoint">Onayla</div>
          </div>
        </template>

      </UCard>
    </UModal>
    <!-- Add Waypoint -->


    <!-- Edit TripName -->
    <UModal v-model="isNameEditPopupOpen" :overlay="true" :prevent-close="false" :class="'z-[10000]'" :ui="{height: 'h-full'}">
      <UCard>
        <template #header>
          <p>İsim Düzenle</p>
        </template>
        <template class="p-0 h-40" #default>
          <div class="flex flex-col h-fit gap-x-2">
            <div class="flex justify-start items-center">
              <label class="block mb-2 text-sm font-medium text-white">Etkinlik İsmi:</label>
              <input type="text"  placeholder="" v-model="tripName"
                     class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between">
            <div class="bg-gray-700 text-white px-10 py-2 w-full text-center text-sm rounded-lg" @click="isNameEditPopupOpen = false">Onayla</div>
          </div>
        </template>

      </UCard>
    </UModal>
    <!-- Edit TripName -->

    <!-- Edit TripName -->
    <UModal v-model="isDateEditPopupOpen" :overlay="true" :prevent-close="false" :class="'z-[10000]'" :ui="{height: 'h-full'}">
      <UCard>
        <template #header>
          <p>Tarih Seçin</p>
        </template>
        <template class="p-0 h-40" #default>
          <div class="flex flex-col h-fit gap-x-2">
            <div class="flex justify-start items-center">
              <label class="block mb-2 text-sm font-medium text-white">Gidiş Tarihi:</label>
              <input type="datetime-local"  placeholder="" v-model="date"
                     class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between">
            <div class="bg-gray-700 text-white px-10 py-2 w-full text-center text-sm rounded-lg" @click="isDateEditPopupOpen = false">Onayla</div>
          </div>
        </template>

      </UCard>
    </UModal>
    <!-- Edit TripName -->

    <UModal v-model="isWaypointEditModalVisible" :overlay="true" :prevent-close="false" :class="'z-[10000]'" :ui="{height: 'h-full'}">
      <UCard>
        <template #header>
          <p>Durak: {{selectedWaypoint?.name}}</p>
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
              <div v-for="user in userSearchResults" class="text-xs flex justify-start items-center gap-x-2 ">
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
                  <div class="flex justify-center items-center bg-red-800 text-white rounded p-2 gap-x-2" @click="removeUser(user)">
                    Sil
                    <Icon name="material-symbols:delete" size="20"/>
                  </div>
                </div>

              </template>
            </div>

          </div>
        </template>


      </UCard>
    </UModal>


    <UModal v-model="isSearchOpen"  :overlay="true" :prevent-close="false" class="z-[10000]">
      <UCard>
        <template #header>
          <p>Konum Seç</p>
        </template>
        <template class="p-0" #default>
          <div class="flex flex-col h-[100%] gap-x-2">
            <div class="rounded-md ">
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
                    <div v-for="user in userSearchResults" class="text-xs flex justify-start items-center gap-x-2">
                      <UAvatar :src="user.profilePicture" :alt="user.name + ' ' + user.surname" size="sm" />
                      <p>{{user.name}} {{user.surname}}</p>
                    </div>
                    <div class="text-xs text-gray-600" v-if="searchResults.length > 0">Harita Sonuçları</div>
                    <div class="flex flex-col max-h-[300px] overflow-y-scroll gap-y-2">
                      <div v-for="location in searchResults" class="text-xs" @click="selectGeoLocation(location)">
                        <p>{{location.name}}</p>
                        <p class="opacity-50">{{location.address}}</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>
        </template>
        <template #footer>
          <div class="flex justify-between">
            <div class="bg-gray-700 text-white px-10 py-2 w-full text-center text-sm rounded-lg">Konumu Onayla</div>
          </div>
        </template>

      </UCard>
    </UModal>


  </div>
</template>

<script setup lang="ts">
import {MapContext} from "~/core/app/MapContext";
import {GoogleProvider} from "leaflet-geosearch";
import {
  type ILocationSearchResult,
  ITripLocationType,
  type IWaypoint,
  type IWaypointUser
} from "~/core/app/ITripLocation";

const isSearchOpen = ref(false)
const isAddWaypointModalOpen = ref(false);
const newWaypointName = ref<string>("")
const newUserForm = ref<{name: string, surname: string}>({name: '', surname: ''})
const newUserAddMethod = ref<'search' | 'add'>('search');
const isNameEditPopupOpen = ref(false)
const isDateEditPopupOpen = ref(false);
function selectGeoLocation(location: ILocationSearchResult) {
  selectLocation(location);
  isSearchOpen.value = false;
}
const {
  searchInput,
    isSearchPanelVisible,
    searchResults,
    isSearching,
    userSearchResults,
    selectedWaypoint,
    isWaypointEditModalVisible,
    waypoints,
    totalPeople,
    tripName,
    date
} = storeToRefs(useCreateTripStore())

const {
  addLocation,
    selectLocation,
    createMap,
    createWaypoint,
    addUserToWaypoint,
    deleteUserFromWaypoint,
    deleteWaypoint,
    setFinalDestination
} = useCreateTripStore();

function addWaypoint(){
  isAddWaypointModalOpen.value = false;
  createWaypoint(newWaypointName.value);
  newWaypointName.value = "";
}

function selectUser(e: any){
  console.log(e)
  addUserToWaypoint(selectedWaypoint!.value!.id, e.name, e.surname, e.id, e.profilePicture)
}

function addNewUser(){
  addUserToWaypoint(selectedWaypoint!.value!.id, newUserForm.value.name, newUserForm.value.surname)
  newUserForm.value = {name: '', surname: ''};
}

function removeUser(user: IWaypointUser){
  deleteUserFromWaypoint(selectedWaypoint!.value!.id, user)
}

function openNamePopup(){
  isNameEditPopupOpen.value = true;
}

function openDateEditPopup(){
  isDateEditPopupOpen.value = true;
}

onMounted(() => {
  nextTick(() => {
    createMap();
  })
})

</script>