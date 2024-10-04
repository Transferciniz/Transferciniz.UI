<template>
  <div class="z-1 w-full h-16 bg-gray-900 shadow-2xl">
    <div class="flex justify-around items-center h-full bg-gray-900">
      <NuxtLink to="/" active-class="!text-white" class="text-gray-600 transition ease-in-out duration-300 ">
      <Icon :name="currentRoute.path == '/' ? 'ion:home' : 'ion:home-outline'" size="30" mode="css" />
      </NuxtLink>
      <NuxtLink to="/trip-planner" active-class="!text-white" class="text-gray-600 transition ease-in-out duration-300 ">
      <Icon :name="currentRoute.path == '/trip-planner' ? 'ion:paper-plane' : 'ion:paper-plane-outline'" size="30" mode="css" />
      </NuxtLink>
      <NuxtLink to="/my-vehicles" active-class="!text-white" class="text-gray-600 transition ease-in-out duration-300 ">
        <Icon :name="currentRoute.path == '/my-vehicles' ? 'material-symbols:directions-car' : 'material-symbols:directions-car-outline'" size="30" mode="css" />
      </NuxtLink>

    </div>

  </div>

</template>
<script setup lang="ts">

const selectTripTypeDrawer = ref(null)
const {currentRoute} = useRouter()
function openTripTypeDrawer() {
  selectTripTypeDrawer?.value?.open();
}
</script>