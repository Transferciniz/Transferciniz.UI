export interface ITripHeaderDto {
    id: string;
    name: string;
    startDate: Date;
    status: TripStatus
}

export enum TripStatus{
    WaitingApprove,
    Approved,
    Live,
    Cancelled,
    Finished
}