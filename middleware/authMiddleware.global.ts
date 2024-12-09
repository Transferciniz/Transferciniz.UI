export default defineNuxtRouteMiddleware((to, from) => {
    const {isAuthenticated} = storeToRefs(useAuthStore())
    if(!isAuthenticated.value && !['/register', '/login', '/redirect'].includes(to.path) ) {
       return navigateTo('/login')
    }

})