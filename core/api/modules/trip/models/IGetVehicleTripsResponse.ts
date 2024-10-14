import type {ITripDto} from "~/core/api/modules/trip/models/ITripDto";

export interface IGetVehicleTripsResponse {
    name: string;
    trip: ITripDto
}

