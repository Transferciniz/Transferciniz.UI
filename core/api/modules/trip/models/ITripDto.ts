import type {IWayPointDto} from "~/core/api/modules/trip/models/IWayPointDto";
import type {TripStatus} from "~/core/api/modules/trip/models/ITripHeaderDto";
import type { ITripStatusForUser } from "./ITripStatusForUser";

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
    userStatus: ITripStatusForUser;
}

