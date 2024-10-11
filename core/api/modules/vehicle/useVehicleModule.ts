import type {AxiosInstance, AxiosResponse} from "axios";
import type {IVehicleResponse} from "~/core/api/modules/vehicle/models/IVehicleResponse";

export const useVehicleModule = (api: AxiosInstance) => {

    async function GetVehicles(): Promise<AxiosResponse<IVehicleResponse[]>>{
        return api.get<IVehicleResponse[]>('/Vehicle/GetVehicles')
    }
    return {
        GetVehicles
    }
}