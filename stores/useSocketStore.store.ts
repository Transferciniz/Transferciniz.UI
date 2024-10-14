import * as signalR from "@microsoft/signalr";
import {HttpTransportType} from "@microsoft/signalr";

export const useSocketStore = defineStore('useSocketStore', () => {
    const socket = ref(new signalR.HubConnectionBuilder()
        .withUrl("/locationHub", {skipNegotiation: true, transport: HttpTransportType.WebSockets}) // Sunucudaki hub URL'si
        .withAutomaticReconnect() // Otomatik yeniden bağlanma
        .build());

    const groupIds = ref<string[]>([])

    function initConnection(): Promise<any>{
        return socket.value.start().then(() => {
            socket.value.onreconnected(() => {
                reJoinGroups();
            })
                setTimeout(() => {
                    setDefaultEvents();
                }, 2000)
        })
    }

    function setDefaultEvents(){
        joinGroup(useAuthStore().user.id)
        socket.value.on('onUserLocationChange', e => {
            useLocationStore().setDbLocation(e.latitude, e.longitude)
        });
        socket.value.on('onVehicleLocationChange', e => {
            useCustomerTripStore().setVehicleCoordinate(e.latitude, e.longitude)
        })
    }

    function reJoinGroups(){
        groupIds.value.forEach(groupName => {
            socket.value.invoke('JoinGroup', groupName);
        })
    }

    function joinGroup(groupName: string){
        groupIds.value.push(groupName);
        socket.value.invoke('JoinGroup', groupName);
    }

    function leaveGroup(groupName: string){
        socket.value.invoke('LeaveGroup', groupName);

    }

    return {
        joinGroup,
        leaveGroup,
        initConnection
    }
})