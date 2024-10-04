<script setup lang="ts">


const mapId = Date.now();
const {location } = storeToRefs(useLocationStore())
const map = ref<null | google.maps.Map>(null)

onMounted(() => {
  map.value = createMap();
})
defineExpose({
  map
})

function createMap(): google.maps.Map {
  return new google.maps.Map(
      document.getElementById("map_" + mapId) as HTMLElement,
      {
        backgroundColor: '#101827',
        center: { lat: location.value.latitude, lng: location.value.longitude },
        zoom: 18,
        isFractionalZoomEnabled: true,
        disableDefaultUI: true,
        draggable: true,
        gestureHandling: 'greedy',
        keyboardShortcuts: false,
        headingInteractionEnabled: true,
        renderingType: google.maps.RenderingType.RASTER,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#101827" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
        ],
      }
  )
}
</script>

<template>
  <div :id="`map_${mapId}`" class="flex-grow w-full select-none focus:outline-none"></div>
</template>

<style scoped>

.gm-style iframe + div { border:none!important; }
</style>
