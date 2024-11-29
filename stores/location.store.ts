import {useApi} from "~/core/api/useApi";
import { useStorage } from '@vueuse/core'
export const useLocationStore = defineStore('locationStore', () => {
    const {coords} = useGeolocation({
        enableHighAccuracy: true,
        immediate: true
    });
    const bearing = computed(() => coords.value.heading)
    const dbLocation = useStorage('location',{latitude: useAuthStore().user.latitude, longitude: useAuthStore().user.longitude});
    const location = computed(() => {
        return {
            latitude: dbLocation.value.latitude != 0 ? dbLocation.value.latitude : coords.value.latitude,
            longitude: dbLocation.value.longitude != 0 ? dbLocation.value.longitude : coords.value.longitude
        }
    })

    const address = ref({
        address: '',
        displayAddress: '',
        isCompleted: false
    })

    watch(location, (newValue) => {
        updateAddress();
    })
    function updateLocation(){
        if(coords.value.latitude != 0 && coords.value.longitude != 0){
            useApi().account.UpdateLocation(coords.value.latitude, coords.value.longitude).then(() => {

            })
        }
    }

    function setDbLocation(latitude: number, longitude: number){
        dbLocation.value = {latitude: latitude, longitude: longitude};
    }

    function updateAddress(){
        address.value.isCompleted = false;
        useApi().account.ReverseGeoCoding(location.value.latitude, location.value.longitude).then(res => {
            address.value = {
                address: res.data.address,
                displayAddress: res.data.displayAddress,
                isCompleted: true
            }
        })
    }
    return {
        location,
        bearing,
        address,

        updateLocation,
        setDbLocation
    }
})