export interface IUpdateVehicleStatusCommand {
    id: string;
    status: IVehicleStatus;
    latitude: number;
    longitude: number;
}

export enum IVehicleStatus{
    Offline= 0,
    Online= 1,
    Busy= 2,
    InMaintenance= 3
}