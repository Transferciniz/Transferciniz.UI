export function useMapIcon(){
    const {$L:L} = useNuxtApp();
    const waypointIcon = L.divIcon({
        html: '<span class="border-blue-700 border-2 rounded-sm text-sm text-black bg-white py-0.5 px-2 font-black flex items-center justify-center">D</span>',
    })

    const finalDestinationIcon = L.divIcon({
        html: '<span class="border-red-700 border-2 rounded-sm text-sm text-white bg-red-700 py-0.5 px-2 font-black flex items-center justify-center">V</span>',
    })

    const carIcon = L.divIcon({
        html: '<div class="bg-black rounded-full flex items-center justify-center w-[40px] h-[40px]"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ffffff" d="M6 19v1q0 .425-.288.713T5 21H4q-.425 0-.712-.288T3 20v-8l2.1-6q.15-.45.538-.725T6.5 5h11q.475 0 .863.275T18.9 6l2.1 6v8q0 .425-.287.713T20 21h-1q-.425 0-.712-.288T18 20v-1zm-.2-9h12.4l-1.05-3H6.85zm1.7 6q.625 0 1.063-.437T9 14.5t-.437-1.062T7.5 13t-1.062.438T6 14.5t.438 1.063T7.5 16m9 0q.625 0 1.063-.437T18 14.5t-.437-1.062T16.5 13t-1.062.438T15 14.5t.438 1.063T16.5 16"/></svg>'
    })

    const tempMarkerIcon = L.divIcon({
        html:'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#000000" d="M12 21.325q-.35 0-.7-.125t-.625-.375Q9.05 19.325 7.8 17.9t-2.087-2.762t-1.275-2.575T4 10.2q0-3.75 2.413-5.975T12 2t5.588 2.225T20 10.2q0 1.125-.437 2.363t-1.275 2.575T16.2 17.9t-2.875 2.925q-.275.25-.625.375t-.7.125M12 12q.825 0 1.413-.587T14 10t-.587-1.412T12 8t-1.412.588T10 10t.588 1.413T12 12"/></svg></div>'
    })

    return {
        waypointIcon,
        finalDestinationIcon,
        carIcon,
        tempMarkerIcon
    }
}