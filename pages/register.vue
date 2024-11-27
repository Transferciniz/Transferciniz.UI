<template>
  <section class="h-screen w-screen">
    <div class="flex flex-col items-center justify-center ">
      <div class="flex w-full justify-start items-center p-4 gap-x-4">
        <Icon name="i-lucide-chevron-left" size="40" @click="back" />
        <p class="text-2xl font-bold">Kayıt Ol</p>
      </div>

      <div class="w-full px-5" v-if="companyProfile" >
        <div class="flex w-full justify-start gap-x-2 items-center p-4 rounded-md shadow bg-gray-800 border border-gray-700">
          <UAvatar :src="companyProfile.profilePicture" size="3xl" />
          <div class="flex flex-col justify-start items-start gap-y-2">
            <p class="text-sm">{{companyProfile.name}} {{companyProfile.surname}} sizi kayıt olmaya davet etti.</p>
            <UBadge variant="soft" size="sm" :label="userType" />
          </div>
        </div>
        <p class="text-xs opacity-50 mt-2">Hesabınız {{companyProfile.name}} {{companyProfile.surname}} ile ilişkilendirilmiş şekilde oluşturulacaktır.</p>
      </div>


      <div class="w-full">
        <div class="p-6 space-y-4 ">
          <form class="space-y-4" >
            <div>

              <UInputMenu
                  :items="accountTypes"
                  size="xl"
                  v-model:model-value="registerForm.accountType"
                  icon="i-lucide-user"
                  placeholder="Hesap Tipinizi Seçiniz"
                  class="w-full"
              >

                <template #item-label="{ item }">
                  <div class="flex flex-col">
                    <p>{{ item.label }}</p>
                    <p class="text-xs opacity-50 w-50 whitespace-break-spaces">{{ item.description }}</p>
                  </div>
                </template>
              </UInputMenu>

            </div>
            <div>
              <UFormField label="Adınız" required>
                <UInput size="xl" class="w-full" v-model="registerForm.name"/>
              </UFormField>
            </div>
            <div>
              <UFormField label="Soyadınız" required>
                <UInput size="xl" class="w-full" v-model="registerForm.surname"/>
              </UFormField>
            </div>
            <div>
              <UFormField label="Mail Adresi" required>
                <UInput size="xl" class="w-full" v-model="registerForm.email"/>
              </UFormField>
            </div>
            <div>
              <UFormField label="Kullanıcı Adı" required>
                <UInput icon="i-lucide-at-sign" size="xl" class="w-full" v-model="registerForm.username"/>
              </UFormField>

            </div>
            <div>
              <div class="space-y-2">
                <UFormField label="Parolanız">
                  <UInput
                      v-model="registerForm.password"
                      placeholder="Parolanız"
                      :color="color"
                      size="xl"
                      :type="show ? 'text' : 'password'"
                      :ui="{ trailing: 'pe-1' }"
                      :aria-invalid="score < 4"
                      aria-describedby="password-strength"
                      class="w-full"
                  >
                    <template #trailing>
                      <UButton
                          color="neutral"
                          variant="link"
                          size="sm"
                          :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                          aria-label="show ? 'Hide password' : 'Show password'"
                          :aria-pressed="show"
                          aria-controls="password"
                          @click="show = !show"
                      />
                    </template>
                  </UInput>
                </UFormField>

                <UProgress
                    :color="color"
                    :indicator="text"
                    :model-value="score"
                    :max="4"
                    size="sm"
                />

                <p id="password-strength" class="text-sm font-medium">
                  {{ text }}.
                </p>

                <ul class="space-y-1" aria-label="Password requirements">
                  <li
                      v-for="(req, index) in strength"
                      :key="index"
                      class="flex items-center gap-0.5"
                      :class="req.met ? 'text-[var(--ui-success)]' : 'text-[var(--ui-text-muted)]'"
                  >
                    <UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0"/>

                    <span class="text-xs font-light">
          {{ req.text }}
          <span class="sr-only">
            {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
          </span>
        </span>
                  </li>
                </ul>
              </div>

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
            <UButton color="success" class="w-full justify-center" variant="solid" loading-auto @click="doRegister()">Kayıt Ol</UButton>

          </form>
        </div>
      </div>


    </div>
  </section>
</template>

<script setup lang="ts">
import type {IRegisterRequest} from "~/core/api/modules/auth/models/IRegisterRequest";
import {AccountType} from "~/core/api/modules/auth/models/AccountType";
import {useApi} from "~/core/api/useApi";
import type {IGetProfileResponse} from "~/core/api/modules/account/models/IGetProfileResponse";

definePageMeta({
  layout: "fullscreen",
})
const accountTypes = ref([
  {
    label: 'Araç çağırmak istiyorum',
    description: 'Bireysel olarak veya arkadaşlarınızla araç çağırmak için en iyi seçenek.',
    id: 0
  },
  {
    label: 'Sürücüyüm',
    description: 'Araç kullanarak hizmet vereceğim.',
    id: 1
  },
  {
    label: 'Taşıma Firmasıyım',
    description: 'Araçlarım var ve taşımacılık hizmeti vermek istiyorum.',
    id: 2
  },
  {
    label: 'Kurumsal Müşteriyim',
    description: 'Şirketimin ulaşım ihtiyaçlarını karşılamak istiyorum.',
    id: 3
  }
]);
const show = ref(false)
const strength = computed(() => checkStrength(registerForm.value.password))
const score = computed(() => strength.value.filter(req => req.met).length)
const companyProfile = ref<IGetProfileResponse | null>(null)
const color = computed(() => {
  if (score.value === 0) return 'neutral'
  if (score.value <= 1) return 'error'
  if (score.value <= 2) return 'warning'
  if (score.value === 3) return 'warning'
  return 'success'
})

const text = computed(() => {
  if (score.value === 0) return 'Parolanızı giriniz'
  if (score.value <= 2) return 'Güçsüz parola'
  if (score.value === 3) return 'Tehlikeli parola'
  return 'Güçlü Parola'
})
const registerForm = ref<IRegisterRequest>({
  name: '',
  accountType: AccountType.Customer,
  email: '',
  invoiceAddress: '',
  password: '',
  surname: '',
  taxNumber: '',
  username: '',
  parentAccountId: ''
})

const {register} = useAuthStore();
const userType = computed(() => {
  switch (companyProfile.value?.accountType) {
    case 0:
      return "Kurumsal Üye"
    case 1:
      return "Kurumsal Taşımacılık Firması"
    case 2:
      return "Yolcu"
    case 3:
      return "Sürücü"
    default:
      return "";
  }
})

function doRegister(): Promise<any>{
  
  const form = useCloned(registerForm.value);
  form.cloned.value
  form.cloned.value.accountType = form.cloned.value.accountType.id;
  return register(form.cloned.value)
}

onMounted(() => {
  const companyId = useRouter().currentRoute.value?.query?.companyId as string;
  if(companyId){
    useApi().account.GetProfile(companyId).then((res) => {
      companyProfile.value = res.data;
      registerForm.value.parentAccountId = companyId;
    })
  }
})

function checkStrength(str: string) {
  const requirements = [
    {regex: /.{8,}/, text: 'En az 8 karakter uzunluğunda olmalı'},
    {regex: /\d/, text: 'En az 1 numerik karakter olmalı'},
    {regex: /[a-z]/, text: 'En az 1 küçük harf olmalı'},
    {regex: /[A-Z]/, text: 'En az 1 büyük harf olmalı'}
  ]

  return requirements.map(req => ({met: req.regex.test(str), text: req.text}))
}

function back(){
  useRouter().push('/');
}

</script>
