<template>
  <div class="w-screen h-screen flex flex-col relative">
    <div ref="mapBoxContainer" class="w-screen h-screen"></div>
    <div class="absolute bottom-20 p-4 flex justify-center items-center w-full">
      <div class="bg-gray-900 p-4 flex flex-col justify-center items-center rounded-md w-full gap-y-2">
        <div class="flex justify-between gap-x-2 items-center w-full text-xs" v-if="directionType == 'twoWay'">
          <p>Gidiş Ücreti:</p>
          <p>{{ (selectedVehicleCombination!.totalPrice).toFixed(2) }} ₺</p>
        </div>
        <div class="flex justify-between gap-x-2 items-center w-full text-xs" v-if="directionType == 'twoWay'">
          <p>Dönüş Ücreti:</p>
          <p>{{ (selectedVehicleCombination!.twoWayTotalPrice).toFixed(2) }} ₺</p>
        </div>
        <div class="flex justify-between gap-x-2 items-center w-full font-bold text-xs">
          <p>Günlük Toplam:</p>
          <p>{{ (selectedVehicleCombination!.totalPrice + selectedVehicleCombination!.twoWayTotalPrice).toFixed(2) }} ₺</p>
        </div>
        <USeparator orientation="horizontal"/>
        <div class="flex justify-center gap-x-2 items-center w-full font-bold text-md">
          <p>{{ dateCount }} Gün için {{ ((selectedVehicleCombination!.totalPrice + selectedVehicleCombination!.twoWayTotalPrice) * dateCount).toFixed(2) }} ₺</p>
        </div>
        <USeparator orientation="horizontal"/>
        <div class="flex justify-between items-center gap-x-2 w-full">
          <UButton block label="Araçları Göster" color="neutral" variant="soft" @click="isVehiclesDrawerVisible = true"/>
          <UButton block label="Servisi Oluştur" color="success" variant="soft" loading-auto @click="makeTrip"/>
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
  serviceLocation,
  oneWayDetail,
  directionType,
  toDates,
  fromDates,
  twoWayDates
  } = storeToRefs(useServicePlannerStore())
  const isVehiclesDrawerVisible = ref(false);
  const {createTrip} = useServicePlannerStore()

  async function makeTrip(): Promise<any>{
    return new Promise((resolve, reject) => {
      createTrip().then(() => {
        resolve({});
        useRouter().push('/')
      })
    })
  }
  
  const dateCount = computed(() => {
    if(directionType.value =='twoWay') return twoWayDates.value.length;
    if(oneWayDetail.value == 'from') return fromDates.value.length;
    return toDates.value.length;
  })
  const mapBoxContainer = ref();
  const mapbox = ref<mapboxgl.Map>();
  const markers = ref<mapboxgl.Marker[]>([]);
  onMounted(() => {
    mapbox.value = useMapbox().createMap(mapBoxContainer.value, {latitude: 0, longitude: 0})
    let bounds = selectedVehicleCombination.value!.users.reduce((bounds, coord) => bounds.extend([coord.longitude, coord.latitude]), new mapboxgl.LngLatBounds());
    mapbox.value.fitBounds(bounds, {
      padding: 50,
      animate: false
    })
    mapbox.value.on('load', () => {

      selectedVehicleCombination.value?.drawRoutes(mapbox.value!);
      selectedVehicleCombination.value?.users.forEach(user => {
        new mapboxgl.Marker({
          element: useMapbox().createUserMarker(user.profilePicture),
          draggable: true,
          })
          .setLngLat([user.longitude, user.latitude])
          .addTo(mapbox.value!)
          .on('dragend', (event) => {
              const {lat, lng} =event.target.getLngLat()
              user.latitude = lat;
              user.longitude = lng;
              selectedVehicleCombination.value?.GetRoutes(serviceLocation.value!, directionType.value == 'oneWay' ? 
              oneWayDetail.value  == 'to' ? 'to' : 'from'
              : 'both'
            ).then(() => {
                selectedVehicleCombination.value?.drawRoutes(mapbox.value!)
           })
          });
      })

    })

  })


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