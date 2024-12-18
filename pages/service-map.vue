<template>
  <div class="w-screen h-screen flex flex-col relative">
    <div ref="mapBoxContainer" class="w-screen h-screen"></div>
    <div class="absolute bottom-20 p-4 flex justify-center items-center w-full">
      <div class="bg-gray-900 p-4 flex flex-col justify-center items-center rounded-md w-full gap-y-2">
        <div class="flex justify-between gap-x-2 items-center w-full">
          <p>Toplam Ödenecek Tutar:</p>
          <p>{{ selectedVehicleCombination?.totalPrice.toFixed(2) }} ₺</p>
        </div>
        <USeparator orientation="horizontal"/>
        <div class="flex justify-between items-center gap-x-2 w-full">
          <UButton block label="Araçları Göster" color="neutral" variant="soft" @click="isVehiclesDrawerVisible = true"/>
          <UButton block label="Servisi Oluştur" color="success" variant="soft" @click="createTrip"/>
        </div>
      </div>
    </div>
    <UDrawer title="Güzergahlarınız" v-model:open="isVehiclesDrawerVisible" direction="bottom"  >
      <template #body>
        <div class="flex flex-col gap-y-2">
          <div class="flex flex-col px-2 bg-gray-800 rounded-md p-4" v-for="(vehicle, index) in selectedVehicleCombination?.vehicles">
            <p class="text-lg">Hat {{index + 1}} - {{ vehicle.name }}</p>
            <div class="flex items-center justify-between">
              <img :src="vehicle.photo" alt="vehicle" class="h-30">
              <USwitch label="Haritada Göster" v-model:model-value="vehicle.isRouteSelected"/>
            </div>
            <div class="flex justify-start items-center gap-x-2 gap-y-2 flex-wrap">
              <UAvatar :src="user.user.profilePicture" :alt="`${user.user.name} ${user.user.surname}`" v-for="user in vehicle.users" size="3xl" />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <UButton label="Onayla" color="neutral" variant="soft" block @click="redrawRoutes"/>
      </template>
    </UDrawer>
  </div>
</template>

<script lang="ts" setup>
import mapboxgl from 'mapbox-gl';
const {
  selectedVehicleCombination,
  selectedEmployee,
  serviceLocation
  } = storeToRefs(useServicePlannerStore())
  const isVehiclesDrawerVisible = ref(false);
  const {createTrip} = useServicePlannerStore()
  

  const mapBoxContainer = ref();
  const mapbox = ref<mapboxgl.Map>();
  const markers = ref<mapboxgl.Marker[]>([]);
  onMounted(() => {
    mapbox.value = useMapbox().createMap(mapBoxContainer.value, {latitude: 0, longitude: 0})
    let bounds = selectedEmployee.value.reduce((bounds, coord) => bounds.extend([coord.longitude, coord.latitude]), new mapboxgl.LngLatBounds());
    mapbox.value.fitBounds(bounds, {
      padding: 50,
      animate: false
    })
    mapbox.value.on('load', () => {

      selectedVehicleCombination.value?.drawRoutes(mapbox.value!);
      drawMarkers();

    })

  })

function drawMarkers(){
  markers.value.forEach(x => {
    x.remove();
  })
  markers.value = [];
  selectedVehicleCombination.value?.vehicles.forEach(vehicle => {
        vehicle.users.forEach(user => {
          const marker = new mapboxgl.Marker({
          element: useMapbox().createUserMarker(user.user.profilePicture),
          draggable: true,
          })
          .setLngLat([user.user.longitude, user.user.latitude])
          .addTo(mapbox.value!)
          .on('dragend', (event) => {
              const {lat, lng} =event.target.getLngLat()
              user.user.latitude = lat;
              user.user.longitude = lng;
              selectedVehicleCombination.value?.recalculateRoutes(serviceLocation.value!).then(() => {
                selectedVehicleCombination.value?.drawRoutes(mapbox.value!)
                drawMarkers();
           })
          });
          marker.getElement().addEventListener('click', () => {
            selectedVehicleCombination.value!.toggleSelected(vehicle.id);
            selectedVehicleCombination.value?.drawRoutes(mapbox.value!);
          })
          markers.value.push(marker);
        })
      })
}

function redrawRoutes(){
  selectedVehicleCombination.value!.drawRoutes(mapbox.value!)
  isVehiclesDrawerVisible.value = false;
}
onBeforeUnmount(() => {
  mapbox.value?.remove();
})


</script>

<style>

</style>