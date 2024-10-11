<template>
  <div class="z-1 w-full h-16 bg-gray-900 shadow-2xl z-[10000]">
    <div class="flex justify-around items-center h-full bg-gray-900">
      <NuxtLink to="/" active-class="!text-white" class="text-gray-600 transition ease-in-out duration-300">
      <Icon :name="currentRoute.path == '/' ? 'ion:home' : 'ion:home-outline'" size="30" mode="css" />
      </NuxtLink>
      <NuxtLink to="/trip-planner" active-class="!text-white" class="text-gray-600 transition ease-in-out duration-300" v-if="user.accountType != 'EnterpriseTransporterCompany'">
      <Icon :name="currentRoute.path == '/trip-planner' ? 'ion:paper-plane' : 'ion:paper-plane-outline'" size="30" mode="css" />
      </NuxtLink>
      <NuxtLink to="/my-vehicles" active-class="!text-white" class="text-gray-600 transition ease-in-out duration-300" v-if="user.accountType == 'EnterpriseTransporterCompany'">
        <Icon :name="currentRoute.path == '/my-vehicle' ? 'material-symbols:directions-car' : 'material-symbols:directions-car-outline'" size="30" mode="css" />
      </NuxtLink>
      <NuxtLink to="/profile" active-class="!text-white" class="text-gray-600 transition ease-in-out duration-300">
        <UAvatar :src="user.profilePicture" :alt="user.name + ' ' + user.surname" size="sm"/>
      </NuxtLink>

    </div>

  </div>

</template>
<script setup lang="ts">


const {currentRoute} = useRouter();
const {user} = storeToRefs(useAuthStore())

</script>