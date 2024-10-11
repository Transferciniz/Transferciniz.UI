import type {IVehicle} from "~/core/api/modules/trip/models/IVehicleCombination";

export interface IAccountVehicle {
    id: string;
    plate: string;
    accountId: string;
    vehicleId: string;
    vehicle: IVehicle;
}