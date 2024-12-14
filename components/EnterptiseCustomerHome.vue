<template>
  <div class="flex flex-col">
    <div class="relative flex flex-col overflow-hidden">

      <div class="flex flex-col p-4">
        <div class="flex justify-start items-center gap-x-2">
          <UAvatar :src="user.profilePicture" size="xl" />
          <div class="flex flex-col justify-start items-start">
            <p class="text-xl">{{ user.name }} {{ user.surname }}</p>
            <p class="text-sm">{{ user.username }}</p>
          </div>
          <div class="flex-grow flex justify-end flex-1">
            <UChip position="top-right" :show="unreadCount > 0">
              <UButton to="/notifications" icon="material-symbols:notifications-sharp" color="neutral" size="lg"
                variant="soft" />
            </UChip>
          </div>
        </div>
      </div>

      <div class="px-4">
        <UTabs :items="tabs" color="neutral" v-model:model-value="currentTab" />
      </div>
    

      <BasicTransfer v-if="currentTab == '0'"/>
      <ServicePlanner v-if="currentTab == '1'" />
    </div>


  </div>

</template>

<script setup lang="ts">

const { unreadCount } = storeToRefs(useNotificationStore())
const { user } = storeToRefs(useAuthStore())

const tabs = ref([
  {
    label: 'Transfer'
  },
  {
    label: 'Servis'
  }
])

const currentTab = ref('0')
</script>