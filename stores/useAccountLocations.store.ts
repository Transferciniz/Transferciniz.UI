import type { AxiosResponse } from "axios";
import type { IAccountLocation } from "~/core/api/modules/account/models/IAccountLocation"
import type { IReverseGeocodingResponse } from "~/core/api/modules/account/models/IReverseGeocodingResponse";
import { useApi } from "~/core/api/useApi";

export const useAccountLocations = defineStore('useAccountLocations', () => {
    const locationsDataSource = ref<IAccountLocation[]>([]);
    const defaultLocation = computed<IAccountLocation>(() => locationsDataSource.value.filter(x => x.isDefault)[0])
    const locations = computed<IAccountLocation[]>(() => locationsDataSource.value.filter(x => x.isDefault == false))

    getLocations();
    
    function getLocations(){
        useApi().account.GetMyLocations().then(res => {
            locationsDataSource.value = res.data;
        })
    }

    async function getAddress(latitude: number, longitude: number): Promise<AxiosResponse<IReverseGeocodingResponse>>{
        return useApi().account.ReverseGeoCoding(latitude, longitude)
    }

    function addLocation(name: string, address: string, latitude: number, longitude: number, isDefault: boolean = false){
        useApi().account.AddLocation(name, address, latitude, longitude, isDefault).then(() => {
            getLocations();
        })
    }

    return{
        defaultLocation,
        locations,

        getAddress,
        addLocation
    }
})