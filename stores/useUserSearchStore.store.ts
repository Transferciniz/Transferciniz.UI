import type {ILocationSearchResult, IUserLocationSearchResult} from "~/core/app/ITripLocation";
import {useApi} from "~/core/api/useApi";

export const useUserSearchStore = defineStore('useUserSearchStore', () => {
    const searchInput = ref('');
    const searchResults = ref<IUserLocationSearchResult[]>([]);
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
            useApi().account.SearchProfileLocation({search: searchInput.value}).then(locations => {
                searchResults.value = locations.data;
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
