import type {IRegisterRequest} from "~/core/api/modules/auth/models/IRegisterRequest";
import {useApi} from "~/core/api/useApi";
import { useStorage } from '@vueuse/core'
import {jwtDecode} from "jwt-decode";
import type {ISession} from "~/core/api/modules/auth/models/ISession";
import type {ILoginRequest} from "~/core/api/modules/auth/models/ILoginRequest";

export const useAuthStore = defineStore('authStore', () => {
    const token = useStorage('token', '');
    const user = computed(() => {
        try{
            return jwtDecode<ISession>(token.value)
        }catch(e){
            console.error('Error on token decode')
            return {} as ISession;
        }
    });
    const isAuthenticated = computed(() => token.value != '');

    //@ts-ignore
    if(window.ReactNativeWebView == null && isAuthenticated.value){
        setInterval(() => {
            useLocationStore().updateLocation()
        },5000)
    }

    if(isAuthenticated.value){
        useSocketStore().initConnection().then(() => {});
    }

    function register(payload: IRegisterRequest){
        useApi().auth.Register(payload).then((result) => {
            token.value = result.data.token;
            const decodedToken = jwtDecode<ISession>(token.value);
            useLocationStore().setDbLocation(decodedToken.latitude, decodedToken.longitude);
            useRouter().push('/')
        })
    }

    function login(payload: ILoginRequest) {
        useApi().auth.Login(payload).then((result) => {
            token.value = result.data.token;
            //@ts-ignore
            if(window.ReactNativeWebView){
                usePushReactNative('onLogin', {token: result.data.token});
            }else{
                setInterval(() => {
                    useLocationStore().updateLocation()
                },5000)
            }
            useSocketStore().initConnection().then(() => {});
            useRouter().push('/')
        })
    }

    function logout() {
        token.value = ''
        useRouter().push('/')
    }

    function getToken(): string{
        return token.value;
    }
    return {
        isAuthenticated,
        user,
        register,
        getToken,
        login,
        logout
    }
})