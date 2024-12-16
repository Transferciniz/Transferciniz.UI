<template>
  <div class="w-screen h-screen flex flex-col">
    <div ref="mapBoxContainer" class="w-screen h-screen"></div>
  </div>
</template>

<script lang="ts" setup>
import mapboxgl from 'mapbox-gl';
import {decode} from '@mapbox/polyline'
const {
  selectedVehicleCombination,
  selectedEmployee,
  } = storeToRefs(useServicePlannerStore())

  const mapBoxContainer = ref();
  const mapbox = ref<mapboxgl.Map>();
  onMounted(() => {
    mapbox.value = useMapbox().createMap(mapBoxContainer.value, {latitude: 0, longitude: 0})

    // Kullanıcı markerları
    selectedEmployee.value.forEach(user => {
      const marker = new mapboxgl.Marker({
      element: useMapbox().createUserMarker(user.profilePicture),
      draggable: true,
    }).setLngLat([user.longitude, user.latitude]).addTo(mapbox.value!);
    marker.on('dragend', () => recalculateRoute())
    })


    let bounds = selectedEmployee.value.reduce((bounds, coord) => bounds.extend([coord.longitude, coord.latitude]), new mapboxgl.LngLatBounds());
    mapbox.value.fitBounds(bounds, {
      padding: 50,
      animate: false
    })
    mapbox.value.on('load', () => {
      selectedVehicleCombination.value?.vroom?.routes.forEach((route, index) => {
        const coordinates = decode(route.geometry);
        const midPointIndex = Number.parseInt((coordinates.length / 4).toFixed(2)) - 1
        const coordinatesNormalized = coordinates.map(([lat, lng]) => [lng, lat]) ;
        const newBounds = coordinatesNormalized.reduce((bounds, coord) => bounds.extend([coord[0], coord[1]]), new mapboxgl.LngLatBounds());
        bounds = bounds.extend(newBounds)
        mapbox.value?.fitBounds(newBounds, {
          padding: 100,
          animate: false
        })
        const geojson = {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [] // Mapbox için [lng, lat] formatına çevir
          }
        };
        useMapbox().drawRoute(mapbox.value!, geojson,`source-${index}`, `layer-${index}`, false);
        animateRoute(coordinatesNormalized, geojson, 0, `source-${index}`)
        const vehicle = selectedVehicleCombination.value?.combinations.find(x => x.vehicle.id == route.description);
        const textGeoJson = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [coordinatesNormalized[0][0], coordinatesNormalized[0][1]] // LineString'in orta noktası
                    },
                    properties: {
                        title: `Hat - ${index + 1} Başlangıç`
                    }
                }
            ]
        };

        mapbox.value!.addSource(`source-text-${index}`, {
          type: 'geojson',
          data: textGeoJson as any
        })
        mapbox.value!.addLayer({
        id: `line-text-id-${index}`,
        type: 'symbol',
        source: `source-text-${index}`,
        layout: {
            'text-field': ['get', 'title'], // GeoJSON'daki "title" özelliğini kullan
            'text-size': 16,
            'text-anchor': 'center',
            'text-offset': [0, 0.5] // Yazıyı biraz yukarı kaydır
        },
        paint: {
          'text-color': '#0000ff', // Yazı rengi
        'text-halo-color': '#ffffff', // Halo (arka plan) rengi
        'text-halo-width': 2, // Halo genişliği
        'text-halo-blur': 0.5 
        }
    });
      })
    })

  })

function animateRoute(coordinates: number[][], geoJson: any, index: number, sourceName: string){
    if(index >= coordinates.length) return;
    geoJson.geometry.coordinates.push(coordinates[index]);
    mapbox.value!.getSource(sourceName).setData(geoJson);
    index++

    setTimeout(() => animateRoute(coordinates, geoJson, index, sourceName), 30)
}

function recalculateRoute(){

}
</script>

<style>

</style>