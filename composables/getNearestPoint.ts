import { point, lineString, nearestPointOnLine } from "@turf/turf";
type Coordinate = [number, number]; 
export const useGetNearestPoint = (userCoord: Coordinate, routeCoords: Coordinate[]) => {
    // Kullanıcı noktası ve rota tanımları
    const userPoint = point(userCoord);
    const routeLine = lineString(routeCoords);
  
    // Turf.js ile en yakın nokta hesaplama
    const snapped = nearestPointOnLine(routeLine, userPoint);
  
    // Sonuç döndürme
    return {
      lat: snapped.geometry.coordinates[1],
      lng: snapped.geometry.coordinates[0],
      distance: snapped.properties.dist // Mesafe (kilometre olarak)
    };
}
