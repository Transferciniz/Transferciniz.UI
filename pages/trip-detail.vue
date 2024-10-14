<template>
  <div class="flex flex-col">
    <div class="m-4 bg-gray-700 flex flex-col justify-center items-center p-4 rounded-md">
      <p>{{tripHeader.name}}</p>
      <p class="text-sm opacity-50">{{tripDetail.length}} Hat {{formatDate(tripHeader.startDate)}}</p>
      <div id="totalMap" class="w-full h-[400px]"></div>
    </div>
    <Route v-for="route in tripDetail" :route="route" />
  </div>
</template>
<script setup lang="ts">
import moment from "moment/moment";
import 'moment/dist/locale/tr.js'
import {OpenRouteService} from "~/core/OpenRouteService";

moment.locale("tr");
const {tripDetail, tripHeader} = storeToRefs(useTripDetailStore())
const {$L: L} = useNuxtApp()
function formatDate(date: Date) {
  return moment(date).fromNow()
}
const map = ref<L.Map>()

watch(tripDetail, value => {
  if(value.length> 0){
    tripDetail.value.forEach(x => {
      x.wayPoints.sort((a: any, b: any) => a.ordering - b.ordering);
    })
    tripDetail.value.forEach((tripDetail, index) => {
      const dbWaypoints = tripDetail.wayPoints.map((x: any) => {
        return new L.LatLng(x.latitude, x.longitude)
      })
      const colors = ['#ff0000', '#00ff00', '#0000ff']; // Her rota için farklı renkler
      const routing =  L.Routing.control({
        router: new OpenRouteService({}),
        show: false,
        routeWhileDragging: false,
        waypoints: dbWaypoints,
        lineOptions: {
          styles: [{ color: colors[index % colors.length], weight: 4, opacity: 0.7 }] // Farklı renkler
        }
      }).addTo(map.value!)

      routing.on('routesfound', e =>  {
        const routes = e.routes;
        const bounds = L.latLngBounds(routes[0].coordinates[0], routes[0].coordinates[routes[0].coordinates.length - 1]);// Sınırlar için boş bir obje oluştur
        routes[0].coordinates.forEach((coord: any) => {
          bounds.extend(L.latLng(coord.lat, coord.lng)); // Tüm koordinatları sınırlara ekle
        });
        map.value!.fitBounds(bounds, {animate: true, duration: 2}); // Haritayı sınırlarla ortala ve zoom'u ayarla
      });
    })
  }
})

onMounted(() => {
  map.value = L.map("totalMap", {
    zoomControl: false,
    zoomAnimation: true,            // Yakınlaştırma animasyonunu etkinleştirir
    fadeAnimation: true,            // Katmanların solma animasyonunu etkinleştirir
    worldCopyJump: false
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);
  map?.value?.setView([30.68, 36.68], 17, {animate: true, duration: 1});

})
</script>
