

export const useLogout = () => {
    useAuthStore().logout();
    useSocketStore().onLogout();
   const stores = [
    useAccountLocations(),
    useAuthStore(),
    useCompanyTripStore(),
    useCreateTransferStore(),
    useCustomerTripStore(),
    useLocationSearchStore(),
    useMyVehiclesStore(),
    useNotificationStore(),
    usePageTitleStore(),
    useSocketStore(),
    useUserSearchStore(),
    useVehicleModeStore()
]   
    stores.forEach(store => {
        try{
            store.$reset()
        }catch(e){
            console.log(`${store.$id} resetlenemedi`)
        }
    })

    useRouter().push('/login')
}