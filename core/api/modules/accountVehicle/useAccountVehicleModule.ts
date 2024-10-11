import type {AxiosInstance, AxiosResponse} from "axios";
import type {IAccountVehicle} from "~/core/api/modules/accountVehicle/models/IAccountVehicle";
import type {IUpdateVehicleStatusCommand} from "~/core/api/modules/accountVehicle/models/IUpdateVehicleStatusCommand";

export const useAccountVehicleModule = (api: AxiosInstance) => {
    async function GetAccountVehicle(id: string): Promise<AxiosResponse<IAccountVehicle>> {
        return api.get<IAccountVehicle>('/AccountVehicle/GetAccountVehicle', {params: {id: id}});
    }

    async function UpdateAccountVehicleStatus(request: IUpdateVehicleStatusCommand): Promise<AxiosResponse<any>> {
        return api.post<any>('/AccountVehicle/UpdateAccountVehicleStatus', request)
    }

    async function GetMyVehicles(): Promise<AxiosResponse<any[]>>{
        return api.get<any[]>('/AccountVehicle/GetMyVehicles')
    }



    return {
        GetAccountVehicle,
        UpdateAccountVehicleStatus,
        GetMyVehicles
    }
}