import type {AxiosInstance, AxiosResponse} from "axios";
import type {IUserLocationSearchQuery, IUserLocationSearchResult} from "~/core/app/ITripLocation";
import type {INotification} from "~/core/api/modules/account/models/INotification";
import type {IVehicleMapResponse} from "~/core/api/modules/account/models/IVehicleMapResponse";
import type {IGetProfileResponse} from "~/core/api/modules/account/models/IGetProfileResponse";
import type { IChangeProfilePictureResponse } from "./models/IChangeProfilePictureResponse";
import type { IReverseGeocodingResponse } from "./models/IReverseGeocodingResponse";
import type { IAccountLocation } from "./models/IAccountLocation";

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

    async function GetAccountVehiclesForMap(): Promise<AxiosResponse<IVehicleMapResponse[]>> {
        return api.get<IVehicleMapResponse[]>('/Account/VehiclesForMap')
    }

    async function GetProfile(accountId: string): Promise<AxiosResponse<IGetProfileResponse>>{
        return api.get<IGetProfileResponse>('/Account/GetProfile', {params: {
            id: accountId
            }})
    }

    async function UploadProfilePicture(file: any): Promise<AxiosResponse<IChangeProfilePictureResponse>>{
        return api.post<IChangeProfilePictureResponse>('/Account/ChangeProfilePicture', {file: file})
    }

    async function ReverseGeoCoding(latitude: number, longitude: number): Promise<AxiosResponse<IReverseGeocodingResponse>>{
        return api.get('/reverse', {params: {
            lat: latitude,
            lon: longitude
        }, baseURL:'/'})
    }

    async function GetMyLocations(): Promise<AxiosResponse<IAccountLocation[]>>{
        return api.get<IAccountLocation[]>('/Account/GetMyLocations')
    }

    async function AddLocation(name: string, address: string, latitude: number, longitude: number, isDefault:boolean = false): Promise<AxiosResponse<null>>{
        return api.post('/Account/AddLocation', {
            name: name,
            address: address,
            latitude: latitude,
            longitude: longitude,
            isDefault: isDefault
        });
    }


    return {
        SearchProfileLocation,
        AddVehicle,
        UpdateLocation,
        GetNotifications,
        GetAccountVehiclesForMap,
        GetProfile,
        UploadProfilePicture,
        ReverseGeoCoding,
        GetMyLocations,
        AddLocation
    }
}