<template>

  <div class="flex flex-col p-4">
    <p class="text-xl">Hoşgeldiniz, Musa KALAY</p>
    <div class="mt-2 bg-gray-700 flex rounded flex-col p-2">
      <div class="flex justify-around">
        <div class="flex flex-col">
          <p class="text-sm">Şuanki Aracınız</p>
          <p class="text-xl">07 AGV 123</p>
        </div>
        <div class="flex flex-col">
          <p class="text-sm">Operasyon Durumunuz</p>
          <UBadge color="white" class="inline-block w-20" variant="solid">İş Bekliyor</UBadge>
        </div>
      </div>

    </div>
    <UAlert
        class="my-4"
        icon="material-symbols:timelapse-outline-rounded"
        color="yellow"
        variant="solid"
        title="Şu an sıradasınız!"
        description="Bölgenizdeki önceliklendirmelere göre şu anki sıranız 3"
    />
    <div class="mt-2 bg-gray-700 gap-y-4 flex flex-col rounded p-2 opacity-50">
      <div class="flex justify-around items-center">
        <div class="flex flex-col justify-start items-center">
          <p class="text-sm">Transfer Adı</p>
          <p class="text-lg">-</p>
        </div>
        <div class="flex flex-col justify-start items-center">
          <p class="text-sm">Kişi Sayısı</p>
          <p class="text-lg">-</p>
        </div>
      </div>
      <div class="flex justify-around items-center">
        <div class="flex flex-col justify-start items-center">
          <p class="text-sm">Müşteri Adı Soyadı</p>
          <p class="text-lg">-</p>
        </div>
        <div class="flex flex-col justify-start items-center">
          <p class="text-sm">Müşteri İletişim</p>
          <p class="text-lg">-</p>
        </div>
      </div>
      <div class="flex justify-around items-center">
        <div class="flex flex-col justify-start items-center">
          <p class="text-sm">Toplam KM</p>
          <p class="text-lg">-</p>
        </div>
        <div class="flex flex-col justify-start items-center">
          <p class="text-sm">Tahmini Varış Saati</p>
          <p class="text-lg">-</p>
        </div>
      </div>
      <div class="flex justify-around items-center">
        <div class="flex flex-col justify-start items-center">
          <p class="text-sm">Transfer Tipi</p>
          <p class="text-lg">-</p>
        </div>
        <div class="flex flex-col justify-start items-center">
          <p class="text-sm">Belge Göster</p>
          <p class="text-lg">-</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-5">
      <div class="col-span-2 flex gap-x-2 bg-yellow-400 text-black items-center justify-center rounded p-4">
        <Icon name="mdi:alarm-light" size="30" />
        <p>Panik Butonu</p>
      </div>

      <div class="bg-gray-700 flex flex-col gap-y-2 items-center justify-center rounded p-4">
        <Icon name="bxs:car-mechanic" size="30" />
        <p>Araç Arızası</p>
      </div>

      <div class="bg-gray-700 flex flex-col gap-y-2 items-center justify-center rounded p-4">
        <Icon name="material-symbols:timelapse-outline-rounded" size="30" />
        <p>Serbest Sürüş</p>
      </div>

      <div class="bg-gray-700 flex flex-col gap-y-2 items-center justify-center rounded p-4 opacity-50">
        <Icon name="material-symbols:account-circle-off-outline" size="30" />
        <p>Müşteri Gelmedi</p>
      </div>

      <div class="bg-red-800 flex flex-col gap-y-2 items-center justify-center rounded p-4">
        <Icon name="hugeicons:logout-04" size="30" />
        <p>Sürüşü Bitir</p>
      </div>

      <div class="col-span-2 flex gap-x-2 bg-yellow-400 text-black items-center justify-center rounded p-4">
        <Icon name="ph:warning-octagon-duotone" size="30" />
        <p>Yol Yardım</p>
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
const {createMap} = useCreateTripStore();

onMounted(() => {
  nextTick(() => {
    createMap();
  })
})
</script>