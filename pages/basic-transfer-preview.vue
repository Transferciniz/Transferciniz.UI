<template>
  <div class="flex flex-col">
    <div class="flex flex-col p-4">
      <div class="relative">
        <div id="preview-map" class="rounded-md h-[300px] w-full transition-all ease-in-out" :class="{'!h-[600px]': isMapFullScreen == true}"></div>
      </div>
      <div class="flex justify-between items-center p-4 px-10" v-if="routingSummary">
        <div class="bg-gray-800 rounded-full flex justify-between items-center w-full p-2 px-8 mt-[-40px] z-[9999]">
          <div class="flex justify-start items-center gap-x-2">
            <Icon name="lets-icons:road-alt-fill" size="30"/>
            <p>{{(routingSummary.totalDistance / 1000).toFixed(2)}} KM</p>
          </div>
          <div class="flex justify-start items-center gap-x-2">
            <Icon name="material-symbols:nest-clock-farsight-analog-outline-rounded" size="30"/>
            <p>{{(routingSummary.totalTime / 60).toFixed(0)}} Dakika</p>
          </div>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-xl">Kişi Sayısı</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

const{$L: L} = useNuxtApp()
const map = ref<L.Map>();
const routing = ref<L.Routing.Control>();
const routingSummary = ref<any>();
const isMapFullScreen = ref(false);
const {
  waypoints
} = storeToRefs(useCreateTripStore())

onMounted(() => {
  map.value = useMap('preview-map')
  useRouting(map.value, waypoints.value, 0).then(res => {
    routing.value = res.routing;
    routingSummary.value = res.summary;
  })

})

function toggleMapFullScreen() {
 /* isMapFullScreen.value = !isMapFullScreen.value;
  setTimeout(() => {
    map.value?.invalidateSize();
  },500)*/
}
</script>