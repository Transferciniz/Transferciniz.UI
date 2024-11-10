export function useHaversineDistance(coord1: any, coord2: any): number {
    const R = 6371e3; // Dünya'nın yarıçapı, metre cinsinden
    const lat1 = coord1[1] * Math.PI / 180; // Enlem1 radian cinsinden
    const lat2 = coord2[1] * Math.PI / 180; // Enlem2 radian cinsinden
    const deltaLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const deltaLng = (coord2[0] - coord1[0]) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Mesafe, metre cinsindedir
}