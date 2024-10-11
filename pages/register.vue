<template>
  <section class="h-screen w-screen">
    <div class="flex flex-col items-center justify-center px-6 py-8 pt-2 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
        <img class="w-full h-full" src="/logo.png" alt="logo">
      </a>

      <div class="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700 mt-10">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
              Kayıt Ol
            </h1>
          </div>

          <form class="space-y-4 md:space-y-6" action="#">
            <div>
              <label for="countries_disabled" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hesap
                Türünüzü Seçin</label>
              <select v-model="registerForm.accountType" id="countries_disabled"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option :value="AccountType.Customer">Araç çağırmak istiyorum.</option>
                <option :value="AccountType.Driver">Sürücü olarak hizmet vermek istiyorum.</option>
                <option :value="AccountType.EnterpriseTransporterCompany">Araçları olan bir taşıma firmasıyım.</option>
                <option :value="AccountType.EnterpriseCustomerCompany">Kurumsal müşteriyim.</option>
              </select>
            </div>
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-white">Adınız</label>
              <input type="text" name="name" placeholder="Adınızı yazınız" v-model="registerForm.name" id="name"
                     class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required>
            </div>
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-white">Soyadınız</label>
              <input type="text" name="name" placeholder="Soyadınızı yazınız" v-model="registerForm.surname"
                     id="surname"
                     class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required>
            </div>
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-white">Mail Adresiniz</label>
              <input type="email" name="email" id="email" v-model="registerForm.email"
                     class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder="Mail adresinizi yazınız..." required>
            </div>
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-white">Kullanıcı Adı</label>
              <input type="text" name="username" placeholder="Kullanıcı adınızı yazınız" v-model="registerForm.username"
                     id="username"
                     class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required>
            </div>

            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-white">Parolanız</label>
              <input type="password" name="password" v-model="registerForm.password" id="password"
                     placeholder="••••••••"
                     class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required>
            </div>
            <div v-if="registerForm.accountType === AccountType.Driver">
              <label for="taxNumber" class="block mb-2 text-sm font-medium text-white">Vergi Numarası</label>
              <input type="text" name="taxNumber" placeholder="Vergi numarasını yazınız"
                     v-model="registerForm.taxNumber" id="taxNumber"
                     class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required>
            </div>
            <div v-if="registerForm.accountType === AccountType.Driver">
              <label for="invoiceAddress" class="block mb-2 text-sm font-medium text-white">Fatura Adresi</label>
              <input type="text" name="invoiceAddress" placeholder="Fatura adresini yazınız"
                     v-model="registerForm.invoiceAddress" id="invoiceAddress"
                     class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required>
            </div>
            <button type="button"
                    class="w-full text-white bg-base-600 hover:bg-base-700 focus:ring-4 focus:outline-none focus:ring-base-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-base-600 dark:hover:bg-base-700 dark:focus:ring-base-800"
                    @click="register(registerForm)">Kayıt Ol
            </button>


            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Bir hesabınız var mı?
              <NuxtLink to="/login" class="font-medium hover:underline text-base-500">Giriş Yap</NuxtLink>
            </p>
          </form>
        </div>
      </div>


    </div>
  </section>
</template>

<script setup lang="ts">
import type {IRegisterRequest} from "~/core/api/modules/auth/models/IRegisterRequest";
import {AccountType} from "~/core/api/modules/auth/models/AccountType";

definePageMeta({
  layout: "fullscreen",
})
const registerForm = ref<IRegisterRequest>({
  name: '',
  accountType: AccountType.Customer,
  email: '',
  invoiceAddress: '',
  password: '',
  surname: '',
  taxNumber: '',
  username: ''
})
const {register} = useAuthStore()

</script>
