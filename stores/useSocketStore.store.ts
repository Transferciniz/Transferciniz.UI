import * as signalR from "@microsoft/signalr";
import {HttpTransportType} from "@microsoft/signalr";

export const useSocketStore = defineStore('useSocketStore', () => {
    const socket = ref(new signalR.HubConnectionBuilder()
        .withUrl("/locationHub", {skipNegotiation: true, transport: HttpTransportType.WebSockets}) // Sunucudaki hub URL'si
        .withAutomaticReconnect() // Otomatik yeniden bağlanma
        .build());

    const groupIds = ref<string[]>([])

    function initConnection(): Promise<void>{
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

    function onLogout(){
        socket.value.stop();
    }

    function setDefaultEvents(): Promise<void>{
        return new Promise((resolve, reject) => {
            joinGroup(`account@${useAuthStore().user.id}`).then(() => {
                resolve();
            })
            socket.value.on('onAccountLocationChanged', e => {
                useLocationStore().setDbLocation(e.latitude, e.longitude)
            });
            socket.value.on('onVehicleLocationChange', e => {
                useCustomerTripStore().setVehicleCoordinate(e.latitude, e.longitude)
            })
            socket.value.on('onNotificationRecieved', e => {
                useToast().add({title: 'Yeni Bildirim!', description: e.message})
            })
        })
     
    }

    function reJoinGroups(){
        groupIds.value.forEach(groupName => {
            socket.value.invoke('JoinGroup', groupName);
        })
    }

    function joinGroup(groupName: string): Promise<any>{
        groupIds.value.push(groupName);
        return socket.value.invoke('JoinGroup', groupName);
    }

    function leaveGroup(groupName: string){
        socket.value.invoke('LeaveGroup', groupName);

    }

    return {
        joinGroup,
        leaveGroup,
        initConnection,
        onLogout
    }
})