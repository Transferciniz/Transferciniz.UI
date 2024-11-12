<template>
  <section class="h-screen w-screen">
    <div class="flex flex-col items-center justify-center px-6 py-8 pt-2 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
        <img class="w-full h-full" src="/logo.png" alt="logo">
      </a>

      <!-- Giriş -->
      <div class="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700 mt-10">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
              Hesabınıza Giriş Yapın
            </h1>


          </div>

          <form class="space-y-4 md:space-y-6" action="#">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-white">Mail Adresiniz</label>
              <input type="email" v-model="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Mail adresinizi yazınız..." required>
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-white">Parolanız</label>
              <input type="password" v-model="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
            </div>
            <div class="flex items-center justify-between">
              <a href="#" class="text-sm font-medium hover:underline text-base-500">Parolanızı mı unuttunuz?</a>
            </div>
            <UButton color="neutral" class="justify-center w-full" trailing-icon="i-lucide-arrow-right" loading-auto @click="login">Giriş Yap</UButton>

            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Bir hesabınız yok mu? <NuxtLink to="/register" class="font-medium hover:underline text-base-500">Kayıt Ol</NuxtLink>
            </p>
          </form>
        </div>
      </div>




    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "fullscreen",
})
const email = ref('');
const password = ref('');
function login() {
  return useAuthStore().login({
    email: email.value,
    password: password.value,
  })
}

</script>
