import type {AxiosInstance, AxiosResponse} from "axios";
import type {
    IGetAvailableVehiclesQuery,
    IVehicleCombinationPricePair
} from "~/core/api/modules/trip/models/IVehicleCombination";
import type {ICreateTrip} from "~/core/api/modules/trip/models/ICreateTrip";
import type {ITripHeaderDto} from "~/core/api/modules/trip/models/ITripHeaderDto";
import type {ITripDto} from "~/core/api/modules/trip/models/ITripDto";
import type {IGetVehicleTripsResponse} from "~/core/api/modules/trip/models/IGetVehicleTripsResponse";
import type {IWayPointDto} from "~/core/api/modules/trip/models/IWayPointDto";

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

    async function GetTripDetailsForCustomer(tripHeaderId: string): Promise<AxiosResponse<ITripDto[]>> {
        return api.get<ITripDto[]>('/Trip/GetTripDetailsForCustomer', {params: {tripHeaderId: tripHeaderId}});
    }

    async function UpdateWaypoint(payload: IWayPointDto): Promise<AxiosResponse<any>> {
        return api.post<any>('/Trip/UpdateWaypoint', {waypoint: payload})
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
        UpdateWaypoint
    }
}