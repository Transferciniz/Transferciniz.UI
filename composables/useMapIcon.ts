export function useMapIcon(){
    const {$L:L} = useNuxtApp();
    const waypointIcon = L.divIcon({
        html: '<span class="border-blue-700 border-2 rounded-sm text-sm text-black bg-white py-0.5 px-2 font-black flex items-center justify-center">D</span>',
    })

    const finalDestinationIcon = L.divIcon({
        html: '<span class="border-red-700 border-2 rounded-sm text-sm text-white bg-red-700 py-0.5 px-2 font-black flex items-center justify-center">V</span>',
    })

    return {
        waypointIcon,
        finalDestinationIcon,
    }
}