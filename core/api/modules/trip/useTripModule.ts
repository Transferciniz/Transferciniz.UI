import type {Axios, AxiosInstance, AxiosResponse} from "axios";
import type {
    IGetAvailableVehiclesQuery,
    IVehicleCombinationPricePair
} from "~/core/api/modules/trip/models/IVehicleCombination";
import type {ICreateTrip} from "~/core/api/modules/trip/models/ICreateTrip";
import type {ITripHeaderDto} from "~/core/api/modules/trip/models/ITripHeaderDto";
import type {ITripDto} from "~/core/api/modules/trip/models/ITripDto";
import type {IGetVehicleTripsResponse} from "~/core/api/modules/trip/models/IGetVehicleTripsResponse";
import type {IWayPointDto} from "~/core/api/modules/trip/models/IWayPointDto";
import type {IFinishTripCommand} from "~/core/api/modules/trip/models/IFinishTripCommand";
import type {IGetTripHistoryQuery} from "~/core/api/modules/trip/models/IGetTripHistoryQuery";
import type {IPagingResponse} from "~/core/api/modules/trip/models/IPagingResponse";
import type { IUpdateUserWillComeCommand } from "./models/IUpdateUserWillComeCommand";
import type { IOptimizeRoute } from "./models/IOptimizeRoute";
import type { VroomResponse } from "./models/IVroom";
import type { CreateTripV2Request } from "./models/ICreateTripV2";

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

    async function GetTripDetails(tripHeaderId: string): Promise<AxiosResponse<any>> {
        return api.get<any>('/Trip/GetTripDetails', {params: {tripHeaderId: tripHeaderId}});
    }

    async function GetVehicleTrips(accountVehicleId: string): Promise<AxiosResponse<IGetVehicleTripsResponse[]>> {
        return api.get<IGetVehicleTripsResponse[]>('/Trip/GetVehicleTrips', {params: {accountVehicleId: accountVehicleId}})
    }

    async function StartTrip(tripId: string): Promise<AxiosResponse<any>> {
        return api.post<any>('/Trip/StartTrip', {tripId: tripId});
    }

    async function GetTripHeadersForCompany(): Promise<AxiosResponse<ITripHeaderDto[]>> {
        return api.get<ITripHeaderDto[]>('/Trip/GetTripHeadersForCompany', {})
    }

    async function GetTripDetailsForCompany(tripHeaderId: string): Promise<AxiosResponse<ITripDto[]>> {
        return api.get<ITripDto[]>('/Trip/GetTripDetailsForCompany', {params: {tripHeaderId: tripHeaderId}});
    }

    async function GetTripHeadersForCustomer(): Promise<AxiosResponse<ITripHeaderDto[]>> {
        return api.get<ITripHeaderDto[]>('/Trip/GetTripHeadersForCustomer', {})
    }

    async function GetTripDetailsForCustomer(tripHeaderId: string): Promise<AxiosResponse<ITripDto>> {
        return api.get<ITripDto>('/Trip/GetTripDetailsForCustomer', {params: {tripHeaderId: tripHeaderId}});
    }

    async function UpdateWaypoint(payload: IWayPointDto): Promise<AxiosResponse<any>> {
        return api.post<any>('/Trip/UpdateWaypoint', {waypoint: payload})
    }

    async function FinishTrip(payload: IFinishTripCommand): Promise<AxiosResponse<any>>{
        return api.post<any>('/Trip/FinishTrip', payload)
    }

    async function GetTripHistory(payload: IGetTripHistoryQuery): Promise<AxiosResponse<IPagingResponse<ITripHeaderDto[]>>> {
        return api.get<IPagingResponse<ITripHeaderDto[]>>('/Trip/GetTripHistory', {
            params: payload
        })
    }

    async function UpdateUserWillCome(payload: IUpdateUserWillComeCommand): Promise<AxiosResponse<any>>{
        return api.post<any>('/Trip/UpdateUserWillCome', payload);
    }

    async function CreateTripV2(payload: CreateTripV2Request): Promise<AxiosResponse<any>>{
        return api.post<any>('/Trip/CreateTripV2', payload)
    }

    async function OptimizeRoute(payload: IOptimizeRoute): Promise<AxiosResponse<VroomResponse>>{
        return api.post<VroomResponse>('/vroom', payload, {baseURL:'/'})
    }



    return {
        GetAvailableVehicles,
        CreateTrip,
        GetMyTrips,
        GetTripDetails,
        GetVehicleTrips,
        StartTrip,
        GetTripHeadersForCompany,
        GetTripDetailsForCompany,
        GetTripHeadersForCustomer,
        GetTripDetailsForCustomer,
        UpdateWaypoint,
        FinishTrip,
        GetTripHistory,
        UpdateUserWillCome,
        OptimizeRoute,
        CreateTripV2

    }
}