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
      <p class="text-lg">Kişileri Seçin</p>
      <USeparator orientation="horizontal" class="flex-1" />
    </div>
    <div class="flex justify-start items-center flex-wrap gap-x-2 gap-y-2" v-if="selectedEmployee.length > 0" @click="isPeopleEditDrawerVisible = true">
      <UAvatar v-for="user in selectedEmployee" :src="user.profilePicture" :alt="`${user.name} ${user.surname}`" size="3xl" />
    </div>
    <div class="flex flex-col justify-center items-center p-4 bg-gray-800 rounded-md" v-else @click="isPeopleEditDrawerVisible = true">
      <p class="text-xs">Hiç Kişi Eklememişsiniz, Eklemek için dokunun.</p>
    </div>

    <div class="flex justify-start items-center gap-x-2 my-4">
      <p class="text-lg">Servis Yönü Seçin</p>
      <USeparator orientation="horizontal" class="flex-1" />
    </div>
    <div class="flex justify-center gap-x-2 items-stretch rounded-md">
      <div class="flex flex-col items-center justify-center p-4 border border-gray-500/0 rounded-md flex-1" :class="{'bg-gray-700 border !border-gray-500' : directionType == 'oneWay'}" @click="setDirectionType('oneWay'); isOneWayDetailDrawerVisible = true;">
        <div class="flex justify-start items-center gap-x-2">
          <Icon name="line-md:arrow-up" mode="svg" size="30"/>
          <p class="text-xl">Tek Yön</p>
        </div>
        <p class="text-xs opacity-50 text-center mt-2">Sadece toplama veya dağıtım servisi yapmak istiyorsanız.</p>
      </div>
      <div class="flex flex-col items-center justify-center p-4 border border-gray-500/0 rounded-md flex-1" :class="{'bg-gray-700 border !border-gray-500' : directionType == 'twoWay'}" @click="setDirectionType('twoWay')">
        <div class="flex justify-start items-center gap-x-2">
          <Icon name="line-md:arrows-vertical-alt" mode="svg" size="30"/>
          <p class="text-xl">Çift Yön</p>
        </div>
        <p class="text-xs opacity-50 text-center mt-2">Hem toplama hem dağıtım servisi yapmak istiyorsanız.</p>
      </div>
    </div>

    <!--TEK YÖN-->
    <div class="flex justify-start items-center gap-x-2 my-4" v-if="directionType == 'oneWay' && oneWayDetail != 'none'">
      <p class="text-lg">Tarih ve Saat</p>
      <USeparator orientation="horizontal" class="flex-1" />
    </div>
    <div class="flex flex-col items-start justify-start" v-if="directionType == 'oneWay' && oneWayDetail != 'none'">

      <div class="flex justify-between items-center w-full">
        <p class="w-1/2">Tarih:</p>
        <UPopover>
          <!--
           {{ df.format(modelValue.toDate(getLocalTimeZone())) }}
          -->
          <UButton color="neutral" variant="subtle" icon="i-lucide-calendar" block>
            {{ oneWayDetail == 'from' ? fromDatesView : toDatesView }}
          </UButton>

          <template #content>
            <UCalendar :multiple="true" v-model="fromDates" class="p-2" v-if="oneWayDetail == 'from'"/>
            <UCalendar :multiple="true" v-model="toDates" class="p-2" v-if="oneWayDetail == 'to'"/>
          </template>
        </UPopover>
      </div>

      <div class="flex justify-start items-center w-full mt-2" v-if="directionType == 'oneWay'">
        <p v-if="oneWayDetail == 'from'" class="w-1/2">Varış Saati Seçin:</p>
        <p v-if="oneWayDetail == 'to'" class="w-1/2">Çıkış Saati Seçin:</p>
        <div class="flex justify-end items-center w-full gap-x-2" v-if="oneWayDetail == 'from'">
          <USelect :items="hours" class="flex-1" v-model:model-value="fromHour"/>
          <p>:</p>
          <USelect :items="minutes" class="flex-1" v-model:model-value="fromMinute"/>
        </div>
        <div class="flex justify-end items-center w-full gap-x-2" v-if="oneWayDetail == 'to'">
          <USelect :items="hours" class="flex-1" v-model:model-value="toHour"/>
          <p>:</p>
          <USelect :items="minutes" class="flex-1" v-model:model-value="toMinute"/>
        </div>
      </div>
    </div>


    <div class="flex justify-start items-center gap-x-2 my-4" v-if="directionType == 'twoWay'">
      <p class="text-lg">Toplama Tarih ve Saati</p>
      <USeparator orientation="horizontal" class="flex-1" />
    </div>
    <div class="flex flex-col items-start justify-start" v-if="directionType == 'twoWay'">

      <div class="flex justify-between items-center w-full">
        <p class="w-1/2">Tarih:</p>
        <UPopover>
          <!--
           {{ df.format(modelValue.toDate(getLocalTimeZone())) }}
          -->
          <UButton color="neutral" variant="subtle" icon="i-lucide-calendar" block>
            {{ fromDatesView }}
          </UButton>

          <template #content>
            <UCalendar :multiple="true" v-model="fromDates" class="p-2" />
          </template>
        </UPopover>
      </div>

      <div class="flex justify-start items-center w-full mt-2">
        <p class="w-1/2">Varış Saati Seçin:</p>
        <div class="flex justify-end items-center w-full gap-x-2">
          <USelect :items="hours" v-model:model-value="fromHour" class="flex-1"/>
          <p>:</p>
          <USelect :items="minutes" v-model:model-value="fromMinute"class="flex-1"/>
        </div>
      </div>
    </div>

    <div class="flex justify-start items-center gap-x-2 my-4" v-if="directionType == 'twoWay'">
      <p class="text-lg">Dağıtım Tarih ve Saati</p>
      <USeparator orientation="horizontal" class="flex-1" />
    </div>
    <div class="flex flex-col items-start justify-start" v-if="directionType == 'twoWay'">

      <div class="flex justify-between items-center w-full">
        <p class="w-1/2">Tarih:</p>
        <UPopover>
          <!--
           {{ df.format(modelValue.toDate(getLocalTimeZone())) }}
          -->
          <UButton color="neutral" variant="subtle" icon="i-lucide-calendar" block>
            {{toDatesView}}
          </UButton>

          <template #content>
            <UCalendar :multiple="true" v-model="toDates" class="p-2" />
          </template>
        </UPopover>
      </div>

      <div class="flex justify-start items-center w-full mt-2">
        <p class="w-1/2">Çıkış Saati Seçin:</p>
        <div class="flex justify-end items-center w-full gap-x-2">
          <USelect :items="hours" v-model:model-value="toHour" class="flex-1"/>
          <p>:</p>
          <USelect :items="minutes" v-model:model-value="toMinute" class="flex-1"/>
        </div>
      </div>
    </div>

    <UButton label="Araç Seçeneklerini Göster" color="neutral" block class="mt-4" v-if="directionType != 'none'" @click="getVehicles"/>
   

  </div>
  <UDrawer title="Kişilerinizde arayın" description="Servisinizi kullanacak kişileri ayarların"
    v-model:open="isPeopleEditDrawerVisible" direction="top">
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
  <UDrawer title="Tek Yön Servis Tipini Seçin" v-model:open="isOneWayDetailDrawerVisible" direction="top" :handle="false" >
    <template #body>
      <div class="flex flex-col gap-y-1 my-2 border border-white/10 p-2 rounded-md" @click="selectOneWayDetail('from')">
        <p class="text-lg">Toplama Servisi</p>
        <p class="text-xs opacity-50">Kişilerinizi konumlarından alarak, servis konumuna taşıyın.</p>
      </div>
      <div class="flex flex-col gap-y-1 my-2 border border-white/10 p-2 rounded-md" @click="selectOneWayDetail('to')">
        <p class="text-lg">Dağıtım Servisi</p>
        <p class="text-xs opacity-50">Kişilerinizi servis konumundan başlayarak, konumlarına taşıyın.</p>
      </div>
    </template>
  </UDrawer>
  <LocationSelector v-model:open="isLocationSelectorVisible" @on-location-selected="onLocationSelected" />
</template>

<script lang="ts" setup>
import { useApi } from '~/core/api/useApi';
import type { ILocationSearchResult } from '~/core/app/ITripLocation';
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'


const {
  address,
} = storeToRefs(useLocationStore())

const isLocationSelectorVisible = ref(false);
const isPeopleEditDrawerVisible = ref(false);
const isOneWayDetailDrawerVisible = ref(false);

const {
  directionType,
  employeeView,
  fromHour,
  fromMinute,
  hours,
  minutes,
  oneWayDetail,
  selectedEmployee,
  serviceLocation,
  toHour,
  toMinute,
  employeeSearchInput,
  fromDates,
  toDates,
  fromDatesView,
  toDatesView
} = storeToRefs(useServicePlannerStore())

const {
setServiceLocation,
setDirectionType,
setOneWayDetail,
toggleEmployee,
getVehicles
} = useServicePlannerStore()


function selectOneWayDetail(payload: 'to' | 'from'){
  setOneWayDetail(payload);
  isOneWayDetailDrawerVisible.value = false;
}


function onLocationSelected(payload: ILocationSearchResult): void {
  setServiceLocation(payload);
  isLocationSelectorVisible.value = false;
}













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
