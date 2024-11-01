import {useApi} from "~/core/api/useApi";
import type {IVehicleResponse} from "~/core/api/modules/vehicle/models/IVehicleResponse";

export const useMyVehiclesStore = defineStore('myVehiclesStore', () => {
    const vehiclesDataSource = ref<IVehicleResponse[]>([])
    const myVehicles = ref<any[]>([])


    setVehicleDataSource();
    getMyVehicles();

    function setVehicleDataSource(){
        useApi().vehicle.GetVehicles().then((response) => {
            vehiclesDataSource.value = response.data;
        })
    }

    function getMyVehicles(){
        useApi().accountVehicle.GetMyVehicles().then((response) => {
            myVehicles.value = response.data;
        })
    }

    function addVehicle(vehicleId: string, plate:string){
        useApi().account.AddVehicle(vehicleId, plate).then((response) => {
            getMyVehicles();
        })
    }
    return {
        vehiclesDataSource,
        myVehicles,

        addVehicle
    }
})