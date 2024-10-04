import type {IRegisterRequest} from "~/core/api/modules/auth/models/IRegisterRequest";
import {useApi} from "~/core/api/useApi";
import { useStorage } from '@vueuse/core'
import {jwtDecode} from "jwt-decode";
import type {ISession} from "~/core/api/modules/auth/models/ISession";
import type {ILoginRequest} from "~/core/api/modules/auth/models/ILoginRequest";

export const useAuthStore = defineStore('authStore', () => {
    const token = useStorage('token', '');
    const user = computed(() => jwtDecode<ISession>(token.value));
    const isAuthenticated = computed(() => token.value != '');


    function register(payload: IRegisterRequest){
        useApi().auth.Register(payload).then((result) => {
            token.value = result.data.token;
            useRouter().push('/')
        })
    }

    function login(payload: ILoginRequest) {
        useApi().auth.Login(payload).then((result) => {
            token.value = result.data.token;
            useRouter().push('/')
        })
    }

    function getToken(): string{
        return token.value;
    }
    return {
        isAuthenticated,
        user,
        register,
        getToken,
        login
    }
})