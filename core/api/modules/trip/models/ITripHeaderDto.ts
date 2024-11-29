export interface ITripHeaderDto {
    id: string;
    name: string;
    startDate: Date;
    status: TripStatus
    willCome: boolean;
    waypointUserId: string;
    plate: string;
}

export enum TripStatus{
    WaitingApprove,
    Approved,
    Live,
    Cancelled,
    Finished
}