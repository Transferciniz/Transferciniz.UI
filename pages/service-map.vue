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
  serviceLocation
  } = storeToRefs(useServicePlannerStore())

  const mapBoxContainer = ref();
  const mapbox = ref<mapboxgl.Map>();
  onMounted(() => {
    mapbox.value = useMapbox().createMap(mapBoxContainer.value, {latitude: 0, longitude: 0})




    let bounds = selectedEmployee.value.reduce((bounds, coord) => bounds.extend([coord.longitude, coord.latitude]), new mapboxgl.LngLatBounds());
    mapbox.value.fitBounds(bounds, {
      padding: 50,
      animate: false
    })
    mapbox.value.on('load', () => {
     /* selectedVehicleCombination.value?.vroom?.routes.forEach((route, index) => {
        const coordinates = decode(route.geometry);
        const midPointIndex = Number.parseInt((coordinates.length / 4).toFixed(2)) - 1
        const coordinatesNormalized = coordinates.map(([lat, lng]) => [lng, lat]) ;
        const newBounds = coordinatesNormalized.reduce((bounds, coord) => bounds.extend([coord[0], coord[1]]), new mapboxgl.LngLatBounds());
        bounds = bounds.extend(newBounds)
        mapbox.value?.fitBounds(newBounds, {
          padding: 100,
          animate: false
        })
     
     
      })*/

      selectedVehicleCombination.value?.drawRoutes(mapbox.value!);
      selectedVehicleCombination.value?.vehicles.forEach(vehicle => {
        vehicle.users.forEach(user => {
          new mapboxgl.Marker({
                            element: useMapbox().createUserMarker(user.user.profilePicture),
                            draggable: true,
                            }).setLngLat([user.user.longitude, user.user.latitude]).addTo(mapbox.value!).on('dragend', (event) => {
                                const {lat, lng} =event.target.getLngLat()
                                user.user.latitude = lat;
                                user.user.longitude = lng;
                                selectedVehicleCombination.value?.recalculateRoutes(serviceLocation.value!).then(() => {
                                  selectedVehicleCombination.value?.drawRoutes(mapbox.value!)
                                });
                            })
        })
      })
    })

  })

function animateRoute(coordinates: number[][], geoJson: any, index: number, sourceName: string){
    if(index >= coordinates.length) return;
    geoJson.geometry.coordinates.push(coordinates[index]);
    mapbox.value!.getSource(sourceName).setData(geoJson);
    index++

    setTimeout(() => animateRoute(coordinates, geoJson, index, sourceName), 10)
}

onBeforeUnmount(() => {
  mapbox.value?.remove();
})

function recalculateRoute(){

}
</script>

<style>

</style>