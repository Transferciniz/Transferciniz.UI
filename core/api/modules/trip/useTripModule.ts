import type {AxiosInstance, AxiosResponse} from "axios";
import type {
    IGetAvailableVehiclesQuery,
    IVehicleCombinationPricePair
} from "~/core/api/modules/trip/models/IVehicleCombination";
import type {ICreateTrip} from "~/core/api/modules/trip/models/ICreateTrip";

export const useTripModule = (api: AxiosInstance) => {
    async function GetAvailableVehicles(request: IGetAvailableVehiclesQuery): Promise<AxiosResponse<IVehicleCombinationPricePair[]>> {
        return api.post<IVehicleCombinationPricePair[]>('/Trip/GetAvailableVehicles', request);
    }

    async function CreateTrip(request: ICreateTrip): Promise<AxiosResponse<any>> {
        return api.post<any>('/Trip/CreateTrip', request);
    }

    async function GetMyTrips(): Promise<AxiosResponse<any>>{
        return api.get<any>('/Trip/GetMyTrips');
    }



    return {
        GetAvailableVehicles,
        CreateTrip,
        GetMyTrips
    }
}