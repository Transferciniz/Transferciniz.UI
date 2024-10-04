import type {IPlaceCategory} from "~/core/IPlaceCategory";

export const useNearbyPlacesStore = defineStore('nearbyPlaces', () => {
    const categories = ref(<IPlaceCategory[]>
        [
            {name: "Bar", code: "bar"},
            {name: "Restoran", code: "restaurant"},
            {name: "Kafe", code: "cafe"},
            {name: "Hızlı Servis Restoranı", code: "fast_food"},
            {name: "Pastane", code: "bakery"},
            {name: "Yiyecek ve İçecek", code: "food"},
            {name: "Gece Kulübü", code: "night_club"},
            {name: "Pub", code: "pub"},
            {name: "Şarap Evi", code: "wine_bar"},
            {name: "Market", code: "grocery_or_supermarket"},
            {name: "Eczane", code: "pharmacy"},
            {name: "Kütüphane", code: "library"},
            {name: "Sinema", code: "movie_theater"},
            {name: "Spor Salonu", code: "gym"},
            {name: "Hastane", code: "hospital"},
            {name: "Otel", code: "lodging"},
            {name: "Park", code: "park"},
            {name: "Müze", code: "museum"},
            {name: "Sanat Galerisi", code: "art_gallery"},
            {name: "Yüzme Havuzu", code: "aquarium"},
            {name: "Hayvanat Bahçesi", code: "zoo"},
            {name: "Eğlence Parkı", code: "amusement_park"},
            {name: "Kültürel Merkez", code: "cultural_center"},
            {name: "Tiyatro", code: "theater"},
            {name: "Kongre Merkezi", code: "convention_center"},
            {name: "Banka", code: "bank"},
            {name: "Otopark", code: "parking"},
            {name: "Postane", code: "post_office"},
            {name: "Güzellik Salonu", code: "beauty_salon"},
            {name: "Kuyumcu", code: "jewelry_store"},
            {name: "Giyim Mağazası", code: "clothing_store"},
            {name: "Elektronik Mağazası", code: "electronics_store"},
            {name: "Büro Malzemeleri Mağazası", code: "office_supply_store"},
            {name: "Ev Eşyaları Mağazası", code: "furniture_store"},
            {name: "Kitapçı", code: "book_store"},
            {name: "Toptancı", code: "wholesale_store"},
            {name: "Evde Sağlık Hizmetleri", code: "home_goods_store"},
            {name: "Geri Dönüşüm Merkezi", code: "recycling_center"},
            {name: "Yiyecek Kamyonu", code: "food_truck"},
            {name: "Yapı Malzemeleri Mağazası", code: "hardware_store"},
            {name: "Çiçekçi", code: "florist"},
            {name: "Oto Tamir Servisi", code: "car_repair"},
            {name: "Oto Yıkama", code: "car_wash"},
            {name: "Hayvan Klinikleri", code: "veterinary_care"},
            {name: "Çocuklar İçin Eğlence", code: "children's_store"},
            {name: "Hediye Mağazası", code: "gift_shop"},
            {name: "Bilgisayar Mağazası", code: "computer_store"},
            {name: "Spor Eşyaları Mağazası", code: "sports_goods_store"},
            {name: "Alışveriş Merkezi", code: "shopping_mall"},
            {name: "Gıda Marketi", code: "food_market"},
            {name: "Gıda Hizmeti", code: "food_service"},
            {name: "Yardım Merkezi", code: "charity"}
        ]
    );
    const userSelectedCategory = ref<null | IPlaceCategory>(null)
    const selectedCategory = computed(() => userSelectedCategory.value ?? categories.value[0])
    const places = ref([]);

    function selectCategory(category: IPlaceCategory): void {
        userSelectedCategory.value = category;
    }

    function getNearbyPlaces() {
        useGoogleMapsApi().getNearbyPlacesSearch(selectedCategory.value.code).then((data) => {
            places.value = data.places;
        })
    }

    watch(selectedCategory, (value) => {
        getNearbyPlaces();
    })

    return {
        categories,
        selectedCategory,
        places,
        selectCategory,
    }
})