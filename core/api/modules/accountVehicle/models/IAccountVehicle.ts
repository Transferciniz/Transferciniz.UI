import type {IVehicle} from "~/core/api/modules/trip/models/IVehicleCombination";
import type {IVehicleStatus} from "~/core/api/modules/accountVehicle/models/IUpdateVehicleStatusCommand";

export interface IAccountVehicle {
    id: string;
    plate: string;
    accountId: string;
    vehicleId: string;
    vehicle: IVehicle;
}

export interface IAccountVehicleDto {
    id: string;
    name: string;
    plate: string;
    photo: string;
    status: IVehicleStatus;
    latitude: number;
    longitude: number;
}