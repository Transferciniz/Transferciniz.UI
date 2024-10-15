export interface IUpdateVehicleStatusCommand {
    id: string;
}

export enum IVehicleStatus{
    Offline= 0,
    Online= 1,
    Busy= 2,
    InMaintenance= 3
}