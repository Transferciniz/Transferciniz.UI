import type {IWayPointDto} from "~/core/api/modules/trip/models/IWayPointDto";

export interface ITripDto {
    id: string;
    startDate: Date;
    vehicleName: string;
    vehiclePlate: string;
    waypoints: IWayPointDto[];
}

