import type {INotification} from "~/core/api/modules/account/models/INotification";
import {useApi} from "~/core/api/useApi";


export const useNotificationStore = defineStore('useNotificationStore', () => {
    const notifications = ref<INotification[]>([])
    const unreadCount = computed(() => notifications.value.filter(x => x.isViewed === false).length)

    getNotifications();

    async function getNotifications(): Promise<void>{
        notifications.value = (await useApi().account.GetNotifications()).data;
    }
    return {
        notifications,
        unreadCount,

        getNotifications
    }
})