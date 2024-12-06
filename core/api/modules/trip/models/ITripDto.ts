import type {IWayPointDto} from "~/core/api/modules/trip/models/IWayPointDto";
import type {TripStatus} from "~/core/api/modules/trip/models/ITripHeaderDto";
import type { ITripStatusForUser } from "./ITripStatusForUser";
import type { IWaypointStatus } from "./IWaypointStatus";

export interface ITripDto {
    id: string;
    accountVehicleId: string;
    driverName: string;
    driverPhoto: string;
    startDate: Date;
    vehicleName: string;
    vehiclePlate: string;
    vehiclePhoto: string;
    status: TripStatus;
    waypoints: IWayPointDto[];
    waypointStatus: IWaypointStatus;
}

