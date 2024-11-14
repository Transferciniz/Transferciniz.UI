

export const usePageTitleStore = defineStore('usePageTitleStore', () => {
    const title = ref("");

    function setTitle(payload: string) {
        title.value = payload;
    }

    return {
        title,
        setTitle
    }
})