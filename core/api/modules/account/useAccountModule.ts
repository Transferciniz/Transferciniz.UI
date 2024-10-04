import type {AxiosInstance, AxiosResponse} from "axios";
import type {IUserLocationSearchQuery, IUserLocationSearchResult} from "~/core/app/ITripLocation";

export const useAccountModule = (api: AxiosInstance) => {
    async function SearchProfileLocation(request: IUserLocationSearchQuery): Promise<AxiosResponse<IUserLocationSearchResult[]>> {
        return api.get<IUserLocationSearchResult[]>('/Account/SearchProfileLocation', {params: request});
    }


    return {
        SearchProfileLocation,
    }
}