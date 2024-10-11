export const useLocationStore = defineStore('locationStore', () => {
    const {coords : location} = useGeolocation({
        enableHighAccuracy: true,
        immediate: true
    });
    return {
        location
    }
})