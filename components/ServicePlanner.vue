<template>
  <div class="flex flex-col p-4">
    <div class="flex justify-start items-center gap-x-2">
      <p class="text-lg">Servis Konumu Seçin</p>
      <USeparator orientation="horizontal" class="flex-1" />
    </div>
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <p class="text-bold text-2xl">{{ serviceLocation?.name ?? address.displayAddress }}</p>
        <p class="text-xs opacity-50">{{ serviceLocation?.address ?? address.address }}</p>
      </div>
      <UButton label="Değiştir" color="neutral" variant="subtle" @click="isLocationSelectorVisible = true" />
    </div>

    <div class="flex justify-start items-center gap-x-2 my-4">
      <p class="text-lg">Servis Yönü Seçin</p>
      <USeparator orientation="horizontal" class="flex-1" />
    </div>
    <div class="flex justify-center gap-x-2 items-stretch rounded-md">
      <div class="flex flex-col items-center justify-center p-4 border border-gray-500/0 rounded-md flex-1" :class="{'bg-gray-700 border !border-gray-500' : directionType == 'oneWay'}" @click="directionType = 'oneWay'">
        <div class="flex justify-start items-center gap-x-2">
          <Icon name="line-md:arrow-up" mode="svg" size="30"/>
          <p class="text-xl">Tek Yön</p>
        </div>
        <p class="text-xs opacity-50 text-center mt-2">Sadece toplama veya dağıtım servisi yapmak istiyorsanız.</p>
      </div>
      <div class="flex flex-col items-center justify-center p-4 border border-gray-500/0 rounded-md flex-1" :class="{'bg-gray-700 border !border-gray-500' : directionType == 'twoWay'}" @click="directionType = 'twoWay'">
        <div class="flex justify-start items-center gap-x-2">
          <Icon name="line-md:arrows-vertical-alt" mode="svg" size="30"/>
          <p class="text-xl">Çift Yön</p>
        </div>
        <p class="text-xs opacity-50 text-center mt-2">Hem toplama hem dağıtım servisi yapmak istiyorsanız.</p>
      </div>
    </div>
    <div class="flex flex-col bg-gray-500 rounded-md mt-[10px]" v-if="directionType != 'none'">
      <div class="flex justify-between items-center relative top-[-29px]">
        <div class="flex flex-1 items-center justify-center">
          <Icon name="ic:sharp-arrow-drop-up" size="50" class="bg-gray-500/0" :class="{'!bg-gray-500' : directionType == 'oneWay'}"/>
        </div>
      
        <div class="flex flex-1 items-center justify-center">
          <Icon name="ic:sharp-arrow-drop-up" size="50" class="bg-gray-500/0" :class="{'!bg-gray-500' : directionType == 'twoWay'}"/>
        </div>
      </div>
    </div>

  </div>
  <UDrawer title="Kişilerinizde arayın" description="Servisinizi kullanacak kişileri ayarların"
    v-model:open="isPeopleEditDrawerVisible" direction="bottom">
    <template #body>
      <div class="flex flex-col w-full gap-y-2 items-center flex-center">
        <UInput type="text" v-model:model-value="employeeSearchInput" class="w-full"
          icon="material-symbols:search-rounded" placeholder="Kişilerinizde arayın" />

        <div class="flex justify-start items-center flex-wrap gap-x-4 gap-y-4 mt-2">
          <div class="flex flex-col gap-y-2 items-center justify-center p-2 rounded-md"
            :class="{ 'bg-gray-700 text-white': user.isSelected }" :key="user.id" v-for="user in employeeView"
            @click="toggleEmployee(user)">
            <UAvatar :src="user.profilePicture" class="size-20" />
            <div class="flex flex-col justify-center items-center">
              <p class="text-lg">{{ user.name }}</p>
              <p class="text-sm">{{ user.surname }}</p>
            </div>
          </div>
        </div>
      </div>

    </template>
    <template #footer>
      <UButton label="Seçilen Kişiler İle Servis Oluştur" block color="neutral"
        @click="isPeopleEditDrawerVisible = false" />
    </template>
  </UDrawer>
  <LocationSelector v-model:open="isLocationSelectorVisible" @on-location-selected="onLocationSelected" />
</template>

<script lang="ts" setup>
import type { IEmployee } from '~/core/api/modules/account/models/IEmployee';
import { useApi } from '~/core/api/useApi';
import type { ILocationSearchResult } from '~/core/app/ITripLocation';

const {
  address,
} = storeToRefs(useLocationStore())
const serviceLocation = ref<ILocationSearchResult>();
const isLocationSelectorVisible = ref(false);

const employeeDataSource = ref(<IEmployee[]>[]);
const employeeSearchInput = ref('')
const isPeopleEditDrawerVisible = ref(false);
const employeeView = computed(() => {
  if (employeeSearchInput.value != '') {
    return employeeDataSource.value.filter(x => x.name.startsWith(employeeSearchInput.value) || x.surname.startsWith(employeeSearchInput.value)).toSorted((a, b) => (b.isSelected ? 1 : 0) - (a.isSelected ? 1 : 0))
  }
  return employeeDataSource.value.toSorted((a, b) => (a.isSelected ? 1 : 0) - (b.isSelected ? 1 : 0))
});

const directionType = ref<'oneWay' | 'twoWay' | 'none'>('none');


function toggleEmployee(payload: IEmployee) {
  employeeDataSource.value.find(x => x == payload)!.isSelected = !employeeDataSource.value.find(x => x == payload)!.isSelected
}

function onLocationSelected(payload: ILocationSearchResult): void {
  serviceLocation.value = payload;
  isLocationSelectorVisible.value = false;
}








onMounted(() => {
  useApi().account.GetEmployee().then(res => {
    employeeDataSource.value = res.data.map(x => {
      return { ...x, isSelected: false }
    })
  })
})

function calculate() {
  useApi().trip.OptimizeRoute({
    jobs: selectedEmployee.value.map((x, index) => {
      return {
        id: index + 1,
        description: x.id,
        location: [x.longitude, x.latitude],
        amount: [1]
      }
    }),
    vehicles: [
      {
        capacity: [2],
        description: '2 Kişilik Araç',
        id: 1,
        start: [selectedEmployee.value[0].longitude, selectedEmployee.value[0].latitude]
      },
      {
        capacity: [8],
        description: '8 Kişilik Araç',
        id: 2,
        start: [selectedEmployee.value[0].longitude, selectedEmployee.value[0].latitude]
      }
    ],
    options: {
      format: 'geojson'
    }
  }).then(res => {
    console.log(res.data)
  })
}
</script>
