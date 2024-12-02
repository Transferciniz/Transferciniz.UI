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
    let webInterval: any;

    //@ts-ignore
    if(window.webkit?.messageHandlers?.messageHandler == null && isAuthenticated.value){
        setInterval(() => {
            useLocationStore().updateLocation()
        },5000)
    }

    //@ts-ignore
    if(window.webkit?.messageHandlers?.messageHandler != null && isAuthenticated.value){
        usePushReactNative('onLogin', token.value)
    }

    if(isAuthenticated.value){
        useSocketStore().initConnection().then(() => {});
    }

    function register(payload: IRegisterRequest): Promise<void>{
        return new Promise((resolve, reject) => {
            useApi().auth.Register(payload).then((result) => {
                token.value = result.data.token;
                const decodedToken = jwtDecode<ISession>(token.value);
                useLocationStore().setDbLocation(decodedToken.latitude, decodedToken.longitude);
                resolve()
                useRouter().push('/')
            }).catch((error) => {
                reject()
            })
        })

    }

    async function login(payload: ILoginRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            useApi().auth.Login(payload).then((result) => {
                token.value = result.data.token;
                //@ts-ignore
                if( window.webkit?.messageHandlers?.messageHandler){
                    usePushReactNative('onLogin', result.data.token);
                }else{
                    webInterval = setInterval(() => {
                        useLocationStore().updateLocation()
                    },5000)
                }
                useSocketStore().initConnection().then(() => {});
                useRouter().push('/')
                resolve()
            }).catch(() => {
                reject()
            })
        })

    }

    function logout() {
        if(webInterval){
            clearInterval(webInterval)
        }
        token.value = ''
        useRouter().push('/login')
    }

    function getToken(): string{
        return token.value;
    }

    function onProfilePictureChange(payload: string){
        token.value = payload;
    }
    return {
        isAuthenticated,
        user,
        register,
        getToken,
        login,
        logout,
        onProfilePictureChange
    }
})