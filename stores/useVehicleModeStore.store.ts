import {useApi} from "~/core/api/useApi";
import {IVehicleStatus} from "~/core/api/modules/accountVehicle/models/IUpdateVehicleStatusCommand";
import type {IAccountVehicle} from "~/core/api/modules/accountVehicle/models/IAccountVehicle";
import type {IGetVehicleTripsResponse} from "~/core/api/modules/trip/models/IGetVehicleTripsResponse";
import {useStorage} from "@vueuse/core";


export const useVehicleModeStore = defineStore('useVehicleModeStore', () => {
    const { location} = storeToRefs(useLocationStore());
    const accountVehicleId = useStorage('accountVehicleId', '')
    const accountVehicle = useStorage('accountVehicle', <IAccountVehicle>{})



    const trips = ref<IGetVehicleTripsResponse[]>([]);
    const selectedTrip = ref<IGetVehicleTripsResponse>();



    function setAccountVehicleId(vehicleId: string): void {
        accountVehicleId.value = vehicleId;
        useRouter().push('/vehicle-mode/upload-files')
    }

    function setVehicleOnline(): void{
        useApi().accountVehicle.OnlineVehicle({
             id: accountVehicleId.value
        }).then(() => {
            useApi().accountVehicle.GetAccountVehicle(accountVehicleId.value).then((response) => {
                accountVehicle.value = response.data;
                useRouter().push('/vehicle-mode')
            })
        })
    }

    function getVehicleTrips(){
        useApi().trip.GetVehicleTrips(accountVehicle.value!.id).then((response) => {
            trips.value = response.data
        })
    }

    function startTrip(trip: IGetVehicleTripsResponse){
        selectedTrip.value = trip;
        useApi().trip.StartTrip(trip.trip.id).then(() => {
            useRouter().push('/vehicle-mode/trip')
        })
    }

    function startVehicleMode(){
        if(accountVehicleId.value != '' && accountVehicle?.value?.id != undefined ){
            useRouter().push('/vehicle-mode')
        }else{
            useRouter().push('/vehicle-mode/select-vehicle')
        }
    }


    return {
        accountVehicle,
        trips,
        selectedTrip,

        setAccountVehicleId,
        setVehicleOnline,
        getVehicleTrips,
        startTrip,
        startVehicleMode
    }
})