export const useGoogleMapsApi = () => {
    const apiKey = 'AIzaSyBvXYuAVhMzjUPrZOEEsIcTvC-OOI7Sva4';

    async function getNearbyPlacesSearch(text: string): Promise<any> {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Goog-Api-Key", apiKey);
        myHeaders.append("X-Goog-FieldMask", "places.displayName,places.id,places.formattedAddress,places.photos,places.location,places.photos.photo_referance");

        const {location} = storeToRefs(useLocationStore())
        const body = JSON.stringify(<INearbyRequest>{
            includedTypes: [text],
            maxResultCount: 10,
            locationRestriction: {
                circle: {
                    center: {
                        latitude: location.value.latitude,
                        longitude: location.value.longitude
                    },
                    radius: 500
                },
            }
        });


        return await (await fetch('https://places.googleapis.com/v1/places:searchNearby', {
            body: body,
            method: "POST",
            headers: myHeaders,
        })).json()
    }

    async function placeTextSearch(text: string): Promise<any> {
        return (await (await fetch(`http://localhost:8010/maps/api/place/textsearch/json?query=${encodeURIComponent(text)}&key=${apiKey}`)).json()).results
    }


    return {
        getNearbyPlacesSearch,
        placeTextSearch
    }
}




interface INearbyRequest {
    includedTypes: string[],
    maxResultCount: number,
    locationRestriction: {
        circle: {
            center: {
                latitude: number;
                longitude: number;
            }
            radius: number;
        },

    }
}