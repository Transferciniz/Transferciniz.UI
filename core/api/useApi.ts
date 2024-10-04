import {useAxios} from "@/core/api/useAxios";
import {useAuthModule} from "@/core/api/modules/auth/useAuthModule";
import {useTripModule} from "~/core/api/modules/trip/useTripModule";
import {useAccountModule} from "~/core/api/modules/account/useAccountModule";

export const useApi = ()  => {
    const axiosInstance = useAxios();
    return {
        auth: useAuthModule(axiosInstance),
        trip: useTripModule(axiosInstance),
        account: useAccountModule(axiosInstance),
    }
}