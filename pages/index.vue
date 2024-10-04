<template>
  <div class="flex flex-col w-full h-full">
    <NuxtLink to="/vehicle-mode-confirmation">
      <div class="flex justify-center items-center gap-x-2 bg-yellow-400 text-black px-4 py-2 shadow-yellow-400 shadow-2xl">
        <Icon name="ri:steering-2-line" class=" animate-pulse" size="40" />
        <p class="animate-pulse">Sürüş Modunu Başlatmak İçin Dokunun</p>
      </div>
    </NuxtLink>

    <!-- Header Section-->
    <div class="bg-gray-700 text-white p-4 flex flex-col rounded-b-2xl gap-y-2 shadow-2xl">
      <div class="flex justify-start gap-x-2 items-center">
        <UAvatar :src="user.profilePicture" :alt="user.name" :chip-color="'green'" size="lg" />
        <div class="flex flex-col">
          <p>{{user.name}} {{user.surname}}</p>
          <p class="text-xs opacity-50">erdogansonmez</p>
        </div>
        <div class="flex flex-grow justify-around">
          <div class="flex flex-col items-center justify-center">
            <p class="text-md">0</p>
            <p class="text-xs opacity-50">Takipçi</p>
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="text-md">0</p>
            <p class="text-xs opacity-50">Takip</p>
          </div>
        </div>

      </div>

      <div class=" py-1">
        <p class="text-xs">Burası benim biyografi alanım aynı instagramda olduğu gibi burayı kişiselleştirebiliyorum</p>
      </div>
      <div class="flex justify-around items-center gap-x-2">
        <div class="bg-gray-900 text-white text-sm flex-grow px-4 py-1 text-center rounded">Profili Düzenle</div>
        <div class="bg-gray-900 text-white text-sm flex-grow px-4 py-1 text-center rounded">Profesyonel Pano</div>
      </div>

    </div>
    <!-- Header Section-->
    <div class="flex flex-col justify-start items-start p-4">
      <p class="text-sm opacity-50">Hesap Bakiyeniz</p>
      <p class="text-5xl text-white font-medium">120.00₺</p>
    </div>
    <VChart class="max-h-[200px] mt-[-80px]" :option="option"/>
    <div class="flex flex-col gap-y-4 px-4 mt-2">
      <p class="text-sm opacity-50">Yaklaşan Transferleriniz</p>
      <div class="bg-gray-700 rounded px-4 py-2 flex justify-between items-center text-white" v-for="trip in trips">
        <div class="flex flex-col justify-start items-start">
          <p class="text-md">{{trip.name}}</p>
          <p class="text-xs opacity-50">{{formatDate(trip.startDate)}}</p>
        </div>
        <div>
          <UBadge color="gray" variant="solid">Onay Bekliyor</UBadge>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useApi} from "~/core/api/useApi";
import {LinearGradient} from "zrender";
import * as echarts from "echarts";
import moment from "moment";
import 'moment/dist/locale/tr.js'


const {user} = storeToRefs(useAuthStore())
echarts.use;
moment.locale("tr");
const trips = ref<any[]>([]);
onMounted(() => {
  useApi().trip.GetMyTrips().then(res => {
    trips.value = res.data;
    console.log(res.data)
  })
})
function formatDate(date: Date) {
  return moment(date).fromNow()
}
const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },

  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    containLabel: false
  },
  xAxis: [
    {
      axisLine:{
        show: false
      },
      splitLine: {
        show: false // x ekseni grid çizgilerini gizler
      },
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  yAxis: [
    {
      axisLine:{
        show: false
      },
      splitLine: {
        show: false // x ekseni grid çizgilerini gizler
      },
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Yapılan Transfer',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 2
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(73,116,201)'
          },
          {
            offset: 1,
            color: 'rgb(16, 24, 39)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [10, 15, 8, 14, 8, 14, 16]
    },

  ]
};

</script>