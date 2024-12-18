import type {IWayPointDto} from "~/core/api/modules/trip/models/IWayPointDto";
import type {TripStatus} from "~/core/api/modules/trip/models/ITripHeaderDto";
import type { IWaypointStatus } from "./IWaypointStatus";
import type { TripDirection } from "./ICreateTripV2";

export interface ITripDto {
    id: string;
    accountVehicleId: string;
    driverName: string;
    driverPhoto: string;
    startDate: Date;
    vehicleName: string;
    route: string;
    tripDirection: TripDirection;
    vehiclePlate: string;
    vehiclePhoto: string;
    status: TripStatus;
    waypoints: IWayPointDto[];
    waypointStatus: IWaypointStatus;
    startLatitude: number;
    startLongitude: number;
    endLatitude: number;
    endLongitude: number;
}

