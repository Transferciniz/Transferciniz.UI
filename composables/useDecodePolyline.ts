import { decode } from "@mapbox/polyline";
export const useDecodePolyline = (payload: string) => {
  const coordinates = decode(payload).map(([lat, lng]) => [lng, lat]);
  return  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coordinates
    }
  };
}
