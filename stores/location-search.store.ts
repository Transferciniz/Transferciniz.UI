import {fa} from "cronstrue/dist/i18n/locales/fa";

export const useLocationSearchStore = defineStore('location-search', () => {
    const searchText = ref("");
    const searchResults = ref([]);
    const isDrawerVisible = ref(false);
    const isAnimating = ref(false);
    watchDebounced(
        searchText,
        () => {
            if(searchText.value == "") {
                searchResults.value = [];
            }else{
                useGoogleMapsApi().placeTextSearch(searchText.value).then(results => {searchResults.value = results;});
            }
        },
        {debounce: 500, maxWait: 1000});



    function setSearchText(payload: string): void {
        searchText.value = payload;
    }

    function closeDrawer() {
        document.body.style.overflow = 'unset'
        isAnimating.value = false;
        setTimeout(() => {
            isDrawerVisible.value = false;
        }, 300)
    }

    function openDrawer() {
        isDrawerVisible.value = true;
        document.body.style.overflow = 'hidden'
        setTimeout(() => {
            isAnimating.value = true;
        },1)
    }

    function resetStore() {
        searchText.value = "";
        searchResults.value = [];
        isDrawerVisible.value = false;
    }

    return {
        searchText,
        searchResults,
        isDrawerVisible,
        isAnimating,
        setSearchText,
        closeDrawer,
        openDrawer,
        resetStore
    }
})