<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import {GoogleProvider} from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet-control-geocoder';
import {watch} from "vue";
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'
import {MapContext} from "~/core/app/MapContext";
import {ITripLocationType} from "~/core/app/ITripLocation";

// OpenStreetMap provider kullanarak GeoSearch ekleme
const {$L: L} = useNuxtApp();
const googleProvider = new GoogleProvider({
  apiKey: 'AIzaSyCae-E5TDMSu-LNPlf7AevPHzUDTqft-TU',
  language: 'tr',
  region: 'TR'
})
const {location} = storeToRefs(useLocationStore())


const loading = ref(false);
const selected = ref();
const marker = ref<L.Marker | null>(null);
const map = ref<L.Map | null>(null);

async function search(q: string) {
  if (q == '') return [];
  const response = await googleProvider.search({query: q});
  console.log(response)
  return response.map(x => {
    return {...x, id: x.raw.place_id}
  })
}

watch(selected, (value: any) => {
  console.log(value)
  marker.value?.setLatLng({lat: value.y, lng: value.x});
  map.value?.setView({lat: value.y, lng: value.x}, 17, {animate: true, duration: 1});
})

onMounted(() => {
  nextTick(() => {
    const context = new MapContext();
    context.addMarker({
      latitude: location.value.latitude,
      longitude: location.value.longitude,
      id: 'me',
      title: 'Konumunuz',
      waitTimeAsMinute: 0,
      type: ITripLocationType.point,
    }).focusMarker('me')
    // Haritayı başlat
    const mapInstance = L.map('map', {

      zoomControl: false,
      zoomAnimation: true,            // Yakınlaştırma animasyonunu etkinleştirir
      fadeAnimation: true,            // Katmanların solma animasyonunu etkinleştirir
      worldCopyJump: false
    })
    mapInstance.setView([location.value.latitude, location.value.longitude], 17, {});
    marker.value = L.marker([location.value.latitude, location.value.longitude], {
      draggable: true,
      title: 'Buradasınız'
    }).addTo(mapInstance);
    // Harita kutularını (Tile Layer) ekle
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\n', {}).addTo(mapInstance);

    map.value = context.map;

  })
});

const emit = defineEmits(['success'])

function onSuccess() {
  emit('success')
}

</script>
<template>
  <UModal fullscreen :overlay="false" :prevent-close="false">
    <UCard>
      <template #header>
        <p>Konum Seç</p>
      </template>
      <template class="p-0" #default>
        <div class="flex flex-col h-[100%] gap-x-2">
          <USelectMenu
              class="z-10 mx-4 flex-grow"
              selected-icon="material-symbols-light:search-rounded"
              v-model="selected"
              :loading="loading"
              :searchable="search"
              placeholder="Arama yapın"
              option-attribute="label"
              trailing
              by="id"
          />
          <div id="map" class="w-full min-h-[500px] h-full mt-[-50px] z-0 rounded-md relative"></div>

        </div>
      </template>
      <template #footer>
        <div class="flex justify-between">
          <div class="bg-gray-700 text-white px-10 py-2 w-full text-center text-sm rounded-lg">Konumu Onayla</div>
        </div>
      </template>

    </UCard>
  </UModal>
</template>
