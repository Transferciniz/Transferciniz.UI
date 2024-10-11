import {useApi} from "~/core/api/useApi";
import type {ITripHeaderDto} from "~/core/api/modules/trip/models/ITripHeaderDto";
import type {ITripDto} from "~/core/api/modules/trip/models/ITripDto";

export const useCompanyTripStore = defineStore('useCompanyTripStore', () => {
    const {
        GetTripHeadersForCompany,
        GetTripDetailsForCompany
    } = useApi().trip

    const tripHeaders = ref<ITripHeaderDto[]>([]);
    const tripDetails = ref<ITripDto[]>([])

    function getTripHeaders(){
        GetTripHeadersForCompany().then(res => {
            tripHeaders.value = res.data;
        });
    }

    function goTripDetails(tripId: string){
        GetTripDetailsForCompany(tripId).then(res=>{
            tripDetails.value = res.data;
            useRouter().push('/company/trip-detail');
        })
    }
    return {
        tripHeaders,
        tripDetails,

        getTripHeaders,
        goTripDetails
    }
})