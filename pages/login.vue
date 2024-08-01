<template>
  <section class="h-screen w-screen">
    <div class="flex flex-col items-center justify-center px-6 py-8 pt-2 mx-auto md:h-screen lg:py-0">
      <div class="flex justify-end gap-x-2 text-gray-400 w-full leading-tight">
        <h2 class="text-white">Bireysel</h2>
        <h2>|</h2>
        <h2>Kurumsal</h2>
      </div>
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img class="w-full h-full" src="/logo.png" alt="logo">
      </a>

      <!-- Giriş -->
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 mt-10">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Hesabınıza Giriş Yapın
            </h1>


          </div>

          <form class="space-y-4 md:space-y-6" action="#">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mail Adresiniz</label>
              <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Mail adresinizi yazınız..." required>
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Parolanız</label>
              <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
            </div>
            <div class="flex items-center justify-between">

              <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-base-500">Parolanızı mı unuttunuz?</a>
            </div>
            <button type="submit" class="w-full text-white bg-base-600 hover:bg-base-700 focus:ring-4 focus:outline-none focus:ring-base-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-base-600 dark:hover:bg-base-700 dark:focus:ring-base-800">Giriş Yap</button>
            <div class="inline-flex items-center justify-center w-full">
              <hr class="w-64 h-px my-2 bg-gray-200 border-0 dark:bg-gray-700">
              <span class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">yada</span>
            </div>
            <div class="flex justify-between">
              <button type="button" class="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2">
                <svg class="w-5 h-5 me-2 -ms-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></svg>
                Apple İle Giriş Yap
              </button>
              <button type="button" class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
                <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                  <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
                </svg>
                Google İle Giriş Yap
              </button>
            </div>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Bir hesabınız yok mu? <a href="#" class="font-medium text-primary-600 hover:underline dark:text-base-500">Kayıt Ol</a>
            </p>
          </form>
        </div>
      </div>




    </div>
  </section>
</template>

<script setup lang="ts">


</script>
