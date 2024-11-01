import type {ILocationSearchResult} from "~/core/app/ITripLocation";

export const useLocationSearchStore = defineStore('useLocationSearchStoreStore', () => {
    const searchInput = ref('');
    const searchResults = ref<ILocationSearchResult[]>([]);
    const isSearching = ref(false);
    const isSearchPanelVisible = ref(false);


    watchDebounced(
        searchInput,
        () => onMapSearchInputChange(),
        {debounce: 300}
    );

    function onMapSearchInputChange(): void{
        if(searchInput.value == ""){
            isSearching.value = false;
            return;
        }
        isSearchPanelVisible.value = true
        isSearching.value = true;
        Promise.all([
            fetch(`/autocomplete?searchInput=${searchInput.value}`).then(res => {
                res.json().then(data => {
                    searchResults.value = data.map((x: any) => {
                        return {
                            name: x.name,
                            address: x.address,
                            latitude: x.location.latitude,
                            longitude: x.location.longitude,
                        }
                    });
                })
            })
        ]).then(results => {
            isSearching.value = false;
        })
    }

    return {
        searchInput,
        searchResults,
        isSearching,
        isSearchPanelVisible
    }
})
