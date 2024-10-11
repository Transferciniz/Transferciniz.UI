<template>
  <div class="h-screen w-screen">
    <div id="trip-map" class="h-screen w-screen fixed top-0 left-0"></div>

  </div>
</template>

<script setup lang="ts">
import {OpenRouteService} from "~/core/OpenRouteService";

definePageMeta({
  layout: "fullscreen",
})

const {$L: L} = useNuxtApp();
const map = ref<L.Map>();
const vehicleMarker = ref<L.Marker>()
const {selectedTrip} = storeToRefs(useDriverStore())
const {location} = storeToRefs(useLocationStore())
const waypointMarkers = ref<L.Marker[]>([])
onMounted(() => {
  map.value = L.map('trip-map', {
    zoomControl: false,
    zoomAnimation: true,
    fadeAnimation: true,
    worldCopyJump: false
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);
  map!.value!.setView([30.68, 36.68], 17, {animate: true, duration: 1});
  const icon = L.divIcon({
    html: '<span></span>',
    className: 'rounded-full ring-1 ring-white flex items-center justify-center text-white font-medium whitespace-nowrap h-2 min-w-[0.5rem] text-[7px] p-0.5 transform bg-blue-500 ',
  });
  vehicleMarker.value = L.marker({lat: location.value.latitude, lng: location.value.longitude}, {
    draggable: false,
    riseOnHover: true,
    title: 'Konumunuz',
    icon: icon
  }).addTo(map.value);

  map.value?.on('click', event => {
    const {lat, lng} = event.latlng;
    useDriverStore().updateLocation(lat, lng);
  })
  setRouting()
})

function setRouting() {
    selectedTrip.value.trip.wayPoints.sort((a: any, b: any) => a.ordering - b.ordering);
    const dbWaypoints = selectedTrip.value.trip.wayPoints.map((x: any) => {
    return new L.LatLng(x.latitude, x.longitude)
  })
  const colors = ['#ff0000', '#00ff00', '#0000ff']; // Her rota için farklı renkler
  const routing =  L.Routing.control({
    router: new OpenRouteService({}),
    show: false,
    routeWhileDragging: false,
    waypoints: dbWaypoints,
    lineOptions: {
      styles: [{ color: colors[0], weight: 4, opacity: 0.7 }] // Farklı renkler
    }
  }).addTo(map.value!)
  const waypointIcon = L.divIcon({
    html: '<span class="border-blue-700 border-2 rounded-sm text-sm text-black bg-white py-0.5 px-2 font-black flex items-center justify-center">D</span>',
  })
  selectedTrip.value.trip.wayPoints.forEach(waypoint => {
    const marker = L.marker({lat: waypoint.latitude, lng: waypoint.longitude}, {draggable: false, riseOnHover: true, icon: waypointIcon}).addTo(map.value!);
  })


  routing.on('routesfound', e =>  {
    const routes = e.routes;
    console.log(routes);
    const bounds = L.latLngBounds(routes[0].coordinates[0], routes[0].coordinates[routes[0].coordinates.length - 1]);// Sınırlar için boş bir obje oluştur
    routes[0].coordinates.forEach((coord: any) => {
      bounds.extend(L.latLng(coord.lat, coord.lng)); // Tüm koordinatları sınırlara ekle
    });
    map.value!.fitBounds(bounds, {animate: true, duration: 2}); // Haritayı sınırlarla ortala ve zoom'u ayarla
  });
}


</script>