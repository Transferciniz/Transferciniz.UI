<template>
  <div class="flex flex-col w-full h-full">

    <NuxtLink to="/vehicle-mode-confirmation" v-if="user.accountType == 'Driver'">
      <div class="flex justify-center items-center gap-x-2 bg-yellow-400 text-black px-4 py-2 shadow-yellow-400 shadow-2xl">
        <Icon name="ri:steering-2-line" class=" animate-pulse" size="40" />
        <p class="animate-pulse">Sürüş Modunu Başlatmak İçin Dokunun</p>
      </div>
    </NuxtLink>

    <EnterpriseTransporterHome v-if="user.accountType == 'EnterpriseTransporterCompany'"/>

    <CustomerHome v-if="user.accountType == 'Customer' || user.accountType == 'Driver'"></CustomerHome>

  </div>
</template>
<script setup lang="ts">
import {useApi} from "~/core/api/useApi";
import {LinearGradient} from "zrender";
import * as echarts from "echarts";
import moment from "moment";
import 'moment/dist/locale/tr.js'
import {AccountType} from "~/core/api/modules/auth/models/AccountType";


const {user} = storeToRefs(useAuthStore())
moment.locale("tr");
const trips = ref<any[]>([]);
onMounted(() => {
  useApi().trip.GetMyTrips().then(res => {
    trips.value = res.data;
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

function selectTrip(trip:any) {
  useTripDetailStore().selectTrip(trip);
  useRouter().push('/trip-detail')
}

const myTrips = ref([])

onMounted(() => {
  useApi().trip.GetMyTrips().then(res => {
    myTrips.value = res.data;
  })
})

function goTrip(trip: any){
  useClientTripStore().setTrip(trip)
}

</script>