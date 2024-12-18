import type { IWaypointStatus } from "./IWaypointStatus";

export interface ITripHeaderDto {
    id: string;
    name: string;
    startDate: Date;
    status: TripStatus
    willCome: boolean;
    waypointUserId: string;
    plate: string;
    route: string;
    waypointLatitude: number;
    waypointLongitude: number;
    waypointStatus: IWaypointStatus;
    vehiclePhoto: string;
    driverName: string;
    driverPhoto: string;
}

export enum TripStatus{
    WaitingApprove,
    Approved,
    Live,
    Cancelled,
    Finished
}