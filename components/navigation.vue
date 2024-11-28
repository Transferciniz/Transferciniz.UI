<template>
  <div class="z-1 w-full bg-gray-900 shadow-2xl  border-t border-gray-700 pt-4 pb-6">
    <div class="flex justify-around items-center h-full bg-gray-900">
      <NuxtLink to="/" active-class="!text-white" class="text-gray-600 transition ease-in-out duration-300">
      <Icon :name="currentRoute.path == '/' ? 'ion:home' : 'ion:home-outline'" size="30" mode="css" />
      </NuxtLink>
      <NuxtLink to="/my-vehicles" active-class="!text-white" class="text-gray-600 transition ease-in-out duration-300" v-if="user.accountType == 'EnterpriseTransporterCompany'">
        <Icon :name="currentRoute.path == '/my-vehicle' ? 'material-symbols:directions-car' : 'material-symbols:directions-car-outline'" size="30" mode="css" />
      </NuxtLink>
      <NuxtLink to="/profile" active-class="!text-white" class="text-gray-600 transition ease-in-out duration-300">
        <UAvatar :src="user?.profilePicture" icon="material-symbols:person" :alt="user.name + ' ' + user.surname" size="sm" class="object-cover"/>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">


const {currentRoute} = useRouter();
const {user} = storeToRefs(useAuthStore())

</script>