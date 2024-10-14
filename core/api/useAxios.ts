import axios from "axios";

export const useAxios = () => {
    const axiosInstance =  axios.create({
        baseURL: '/api',
        headers: {
            'Authorization': `Bearer ${useAuthStore().getToken()}`,
        }
    });
    axiosInstance.interceptors.request.use(request => {
        return request;
    })
    axiosInstance.interceptors.response.use(response => {
        return response;
    })
    return axiosInstance;
}