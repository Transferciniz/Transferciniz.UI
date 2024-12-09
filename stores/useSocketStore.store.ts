import * as signalR from "@microsoft/signalr";
import { HttpTransportType } from "@microsoft/signalr";
import { SocketMethods } from "~/core/api/SocketMethods";

export const useSocketStore = defineStore('useSocketStore', () => {
    const socket = ref(new signalR.HubConnectionBuilder()
        .withUrl("https://sekerlerteknoloji.com/locationHub", { skipNegotiation: true, transport: HttpTransportType.WebSockets }) // Sunucudaki hub URL'si
        .withAutomaticReconnect() // Otomatik yeniden bağlanma
        .build());

    const groupIds = ref<string[]>([])

    function initConnection(): Promise<void> {
        return new Promise((resolve, reject) => {
            socket.value.start().then(() => {
                setDefaultEvents().then(() => {
                    resolve()
                })
                socket.value.onreconnected(() => {
                    reJoinGroups();
                })
            })
        })


    }

    function onLogout() {
        socket.value.stop();
    }

    function setDefaultEvents(): Promise<void> {
        return new Promise((resolve, reject) => {
            joinGroup(`account@${useAuthStore().user.id}`).then(() => {
                resolve();
            })


            socket.value.on('change', e => {
                const method = e.method as SocketMethods
                const data = e.data;
                switch (method) {
                    case SocketMethods.OnLocationChanged:
                        useLocationStore().setDbLocation(data.latitude, data.longitude)
                        break;
                    case SocketMethods.OnNotificationRecieved:
                        useToast().add({ title: 'Yeni Bildirim!', description: data.message })
                        break;
                    case SocketMethods.OnTripFinished:
                        const router = useRouter();
                        if (router.currentRoute.value.fullPath == '/customer/trip-detail') {
                            router.push('/customer/trip-finished');
                        }
                        break;
                    case SocketMethods.OnVehicleLocationChanged:
                        useCustomerTripStore().setVehicleCoordinate(data.latitude, data.longitude)
                        break;
                    case SocketMethods.OnTripStatusChanged:
                        useCustomerTripStore().getTripHeaders();
                        break;
                    case SocketMethods.OnWaypointStatusChanged:
                        useCustomerTripStore().updateWaypointStatus(data.status);
                        break;
                    default:
                        break;
                }
            })

        })

    }

    function reJoinGroups() {
        groupIds.value.forEach(groupName => {
            socket.value.invoke('JoinGroup', groupName);
        })
    }

    function joinGroup(groupName: string): Promise<any> {
        groupIds.value.push(groupName);
        return socket.value.invoke('JoinGroup', groupName);
    }

    function leaveGroup(groupName: string) {
        socket.value.invoke('LeaveGroup', groupName);

    }

    return {
        joinGroup,
        leaveGroup,
        initConnection,
        onLogout
    }
})