import type {AxiosInstance, AxiosResponse} from "axios";
import type {IUserLocationSearchQuery, IUserLocationSearchResult} from "~/core/app/ITripLocation";
import type {INotification} from "~/core/api/modules/account/models/INotification";

export const useAccountModule = (api: AxiosInstance) => {
    async function SearchProfileLocation(request: IUserLocationSearchQuery): Promise<AxiosResponse<IUserLocationSearchResult[]>> {
        return api.get<IUserLocationSearchResult[]>('/Account/SearchProfileLocation', {params: request});
    }

    async function AddVehicle(vehicleId:string, plate: string): Promise<AxiosResponse<any>> {
        return api.post<any>('/Account/AddVehicle', {
            vehicleId: vehicleId,
            plate: plate
        })
    }

    async function UpdateLocation(latitude: number, longitude: number): Promise<AxiosResponse<any>> {
        return api.post<any>('/Account/UpdateLocation', {
            latitude: latitude,
            longitude: longitude
        })
    }

    async function GetNotifications(): Promise<AxiosResponse<INotification[]>> {
        return api.get<INotification[]>('/Account/GetNotifications')
    }


    return {
        SearchProfileLocation,
        AddVehicle,
        UpdateLocation,
        GetNotifications
    }
}