<template>
  <div class="h-screen w-screen">
    <div id="client-map" class="fixed h-screen w-screen top-0 left-0"></div>
    <div class="fixed top-0 left-0 bg-gray-900 h-[100px] w-full z-[1000] p-4 text-center text-white flex justify-center items-center">
      <p class="w-full text-center">{{statusText}}</p>
    </div>

  </div>
</template>
<script setup lang="ts">
import {OpenRouteService} from "~/core/OpenRouteService";
import * as signalR from "@microsoft/signalr";
import {HttpTransportType} from "@microsoft/signalr";

definePageMeta({
  layout: "fullscreen",
})
const toggle = ref(false);
const{$L: L} = useNuxtApp()
const {waypoints, trip} = storeToRefs(useClientTripStore())
const map = ref()
const {location} = storeToRefs(useLocationStore())
const myMarker = ref<L.Marker>();
const vehicleMarker = ref<L.Marker>()
const statusText = ref<string>("Araç Bekleniyor")

setInterval(() => {
  statusText.value =  changeStatus()
}, 1000)
function changeStatus(){
  if(myLatLang.value && vehicleMarker.value){
    console.log('Giriyor')
    const distance = vehicleMarker.value?.getLatLng()?.distanceTo(myLatLang!.value!)
    if(distance > 1000) return "Aracınız yolda lütfen bekleyin"
    if(distance < 100) return  "Aracınız durakta sizi bekliyor"
    if(distance < 200) return "Çok az kaldı varmak üzereyiz"
    if(distance < 500) return "Az kaldı aracınız geliyor"

  }
  return "";
}
const myLatLang = ref<L.LatLng>()
onMounted(() => {
  connectSocket()

  map.value = L.map('client-map', {
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
  myMarker.value = L.marker({lat: location.value.latitude, lng: location.value.longitude}, {
    draggable: false,
    riseOnHover: true,
    title: 'Konumunuz',
    icon: icon
  }).addTo(map.value);
  vehicleMarker.value =L.marker({lat: 0, lng: 0}, {
    draggable: false,
    riseOnHover: true,
    title: 'Konumunuz',
    icon: icon
  }).addTo(map.value);
  console.log(trip.value);
  setRouting();
})

function setRouting() {
  const points = trip.value.trips[0].wayPoints.map(x => new L.LatLng(x.latitude, x.longitude))
  myLatLang.value = points[0];
  const colors = ['#ff0000', '#00ff00', '#0000ff']; // Her rota için farklı renkler
  const routing =  L.Routing.control({
    router: new OpenRouteService({}),
    show: false,
    routeWhileDragging: false,
    waypoints: points,
    lineOptions: {
      styles: [{ color: colors[0], weight: 4, opacity: 0.7 }] // Farklı renkler
    }
  }).addTo(map.value!)
  const waypointIcon = L.divIcon({
    html: '<span class="border-blue-700 border-2 rounded-sm text-sm text-black bg-white py-0.5 px-2 font-black flex items-center justify-center">D</span>',
  })
  points.forEach(waypoint => {
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

function connectSocket() {
  const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5142/locationHub", {skipNegotiation: true, transport: HttpTransportType.WebSockets}) // Sunucudaki hub URL'si
      .withAutomaticReconnect() // Otomatik yeniden bağlanma
      .build();
  connection.start().then(res => {
    connection.invoke('JoinGroup', `clients@${trip.value.id}`)
    console.log(res);
  })
  connection.on('onVehicleLocationChange', value => {
    const vehicleLatLang = new L.LatLng(value.latitude, value.longitude)
    vehicleMarker.value?.setLatLng(vehicleLatLang);
    console.log('Araç Uzaklığı', vehicleLatLang.distanceTo(myLatLang.value!))
    if (vehicleLatLang.distanceTo(myLatLang.value!) < 100) {
      statusText.value = "Aracınız durağınıza gelmek üzere."
      console.log(statusText.value)
    }
    console.log(value);

  })

}

</script>