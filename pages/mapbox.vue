<template>
  <div class="h-full w-full flex flex-col">
    <div class="bg-gray-900 p-4" @click="calculateRoute">Hesapla</div>
    <div class="w-full h-[300px]" ref="mapContainer"></div>
  </div>
</template>
<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import {OpenRouteService} from "~/core/OpenRouteService";

const mapContainer = ref();
const {$L: L} = useNuxtApp();
const {location} = storeToRefs(useLocationStore())
const latLangs = ref<any[]>([])
const map = ref();
onMounted(() => {
  map.value = useMapbox().createMap(mapContainer.value, location.value);
  map.value.on('click', e => {
    console.log('clicked');
    const {lngLat} = e;
    latLangs.value.push(lngLat);
    new mapboxgl.Marker({
      element: createMarker(2),
      draggable: true,

    }).setLngLat([lngLat.lng, lngLat.lat]).addTo(map.value);
  })
})

function createMarker(personCount: number) {
  const innerHtml = '<div class="bg-red-500 text-white rounded-full px-4 py-1 flex justify-center items-center gap-x-2 min-w-[70px]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#ffffff" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"/></svg>' + personCount + '</div>';
  const htmlElement = document.createElement('div');
  htmlElement.innerHTML = innerHtml;
  return htmlElement;

}

function calculateRoute(){
  const calculator = new OpenRouteService({});
  calculator.route(latLangs.value.map(x => {
    return {
      latLng: x
    }
  }), ((err, routes) => {
    map.value.addSource('route', {
      type: 'geojson',
      data: routes
    });
    map.value.addLayer({
      id: 'routeLayer',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b9ddd',
        'line-width': 6
      }
    });
    console.log(routes)
  }))
}
</script>