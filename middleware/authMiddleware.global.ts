export default defineNuxtRouteMiddleware((to: any, from) => {
    const {isAuthenticated} = storeToRefs(useAuthStore())
    if(!isAuthenticated.value && !['register', 'login', 'redirect-action-companyId'].includes(to.name) ) {
       return navigateTo('/login')
    }

})