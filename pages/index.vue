<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <UFormGroup label="Mail Adresiniz" required>
    <UInput color="light" variant="filled" size="xl" placeholder="Mail adresinizi yazınız" type="mail" icon="i-heroicons-envelope" />
  </UFormGroup>
  <UFormGroup label="Parolanız" required>
    <UInput color="light" variant="filled" size="xl" type="password" placeholder="Parolanızı Yazınız" icon="i-solar-password-linear"  />
  </UFormGroup>
</template>

<script setup lang="ts">


</script>
