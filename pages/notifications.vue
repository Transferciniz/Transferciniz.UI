<template>
  <div class="flex flex-col divide-y divide-gray-700">
    <div v-for="notification in notifications" class="flex flex-col gap-y-1 p-4">
      <p>{{notification.message}}</p>
      <p class="text-xs opacity-50">{{formatDate(notification.createdAt)}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment/moment";
import 'moment/locale/tr'

moment.locale('tr');
const {
  notifications,
  unreadCount
} = storeToRefs(useNotificationStore())

onMounted(() => {
  useNotificationStore().getNotifications()
})

function formatDate(date: Date){
  return moment(date).fromNow()
}
</script>