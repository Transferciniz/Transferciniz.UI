import type {AxiosInstance, AxiosResponse} from "axios";
import type {IAccountVehicleDto} from "~/core/api/modules/accountVehicle/models/IAccountVehicle";
import type {IUpdateVehicleStatusCommand} from "~/core/api/modules/accountVehicle/models/IUpdateVehicleStatusCommand";
import type { IAddAccountVehicleProblemCommand } from "./models/IAddAccountVehicleProblemCommand";

export const useAccountVehicleModule = (api: AxiosInstance) => {
    async function GetAccountVehicle(id: string): Promise<AxiosResponse<IAccountVehicleDto>> {
        return api.get<IAccountVehicleDto>('/AccountVehicle/GetAccountVehicle', {params: {id: id}});
    }

    async function OnlineVehicle(request: IUpdateVehicleStatusCommand): Promise<AxiosResponse<any>> {
        return api.post<any>('/AccountVehicle/OnlineVehicle', request)
    }

    async function GetMyVehicles(): Promise<AxiosResponse<any[]>> {
        return api.get<any[]>('/AccountVehicle/GetMyVehicles')
    }

    async function AddProblem(request: IAddAccountVehicleProblemCommand): Promise<AxiosResponse<any>>{
        return api.post<any>('/AccountVehicle/AddProblem', request)
    }

    async function GetProblems(id: string): Promise<AxiosResponse<any[]>>{
        return api.get<any[]>('/AccountVehicle/GetProblems', {params: {accountVehicleId: id}})
    }

    async function UpdateProblem(id: string, status: number): Promise<AxiosResponse<any>>{
        return api.post<any>('/AccountVehicle/UpdateProblem', {
            id: id,
            status: status
        })
    }


    return {
        GetAccountVehicle,
        OnlineVehicle,
        GetMyVehicles,
        AddProblem,
        GetProblems,
        UpdateProblem
    }
}