import type {ILocationDto} from "~/core/ILocationDto";

export const useTripPlanningStore = defineStore('tripPlanning', () => {
    const {location: currentLocation} = storeToRefs(useLocationStore());


    const fromLocation = ref(<ILocationDto>{
        address: "Geçerli Konumunuz",
        latitude: currentLocation.value.latitude,
        longitude: currentLocation.value.longitude,
    });
    const toLocation = ref(<ILocationDto>{
        address: "Varış Noktanızı Seçin",
        latitude: currentLocation.value.latitude,
        longitude: currentLocation.value.longitude,
    });


    const personCount= ref(0);
    const childCount = ref(0);
    const handicapedPersonCount = ref(0);


    function increasePersonCount() {
        personCount.value++;
    }

    function decreasePersonCount() {
        if(personCount.value != 0)
        personCount.value--;
    }

    function increaseChildCount() {
        childCount.value++;
    }

    function decreaseChildCount() {
        if(childCount.value != 0)
        childCount.value--;
    }

    function increaseHandicapedPersonCount() {
        handicapedPersonCount.value++;
    }

    function decreaseHandicapedPersonCount() {
        if(handicapedPersonCount.value != 0)
        handicapedPersonCount.value--;
    }

    function setFromLocation(location: ILocationDto) {
        fromLocation.value = location;
    }

    function setToLocation(location: ILocationDto) {
        toLocation.value = location;
    }

    return {
        personCount,
        childCount,
        handicapedPersonCount,
        fromLocation,
        toLocation,
        increasePersonCount,
        increaseChildCount,
        increaseHandicapedPersonCount,
        decreasePersonCount,
        decreaseChildCount,
        decreaseHandicapedPersonCount,
        setFromLocation,
        setToLocation
    }
})