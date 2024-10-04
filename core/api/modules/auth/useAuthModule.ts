import type {AxiosInstance, AxiosResponse} from "axios";
import type {IRegisterRequest, IRegisterResponse} from "@/core/api/modules/auth/models/IRegisterRequest";
import type {ILoginRequest, ILoginResponse} from "@/core/api/modules/auth/models/ILoginRequest";

export const useAuthModule = (api: AxiosInstance) => {
    async function Register(request: IRegisterRequest): Promise<AxiosResponse<IRegisterResponse>> {
        return api.post<IRegisterResponse>('/Auth/Register', request);
    }

    async function Login(request: ILoginRequest): Promise<AxiosResponse<ILoginResponse>> {
        return api.post<ILoginResponse>('/Auth/Login', request);
    }

    return {
        Register,
        Login
    }
}