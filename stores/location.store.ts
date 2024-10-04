export const useLocationStore = defineStore('locationStore', () => {
    const {coords : location} = useGeolocation();
    return {
        location
    }
})