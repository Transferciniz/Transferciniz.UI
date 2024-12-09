export default defineNuxtRouteMiddleware((to, from) => {
    const {isAuthenticated, isProfileCompleted} = storeToRefs(useAuthStore())
    if(isAuthenticated.value && !isProfileCompleted.value && '/complete-profile' != from.path){
        return navigateTo('/complete-profile')
    }
    if(!isAuthenticated.value && !['/register', '/login', '/redirect'].includes(to.path) ) {
       return navigateTo('/login')
    }

})