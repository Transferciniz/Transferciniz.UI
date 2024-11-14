import type {IWayPointDto} from "~/core/api/modules/trip/models/IWayPointDto";
import type {TripStatus} from "~/core/api/modules/trip/models/ITripHeaderDto";

export interface ITripDto {
    id: string;
    startDate: Date;
    vehicleName: string;
    vehiclePlate: string;
    status: TripStatus;
    waypoints: IWayPointDto[];
}

