<template>
  <div v-if="problems.length > 0" class="flex flex-col gap-y-2">
    <UAlert title="Araçla alakalı sorun bildirimleri yapılmış!" color="warning" variant="outline"/>
    <div class="flex flex-col gap-y-1" v-for="problem in problems">
      <div class="flex justify-start items-center">
        <UAvatar :src="problem.account.profilePicture" size="3xl" :alt="`${problem.account.name} ${problem.account.surname}`"/>
        <p class="ml-3 whitespace-pre-line">{{ problem.account.name }} {{problem.account.surname}}: <em>{{problem.message}}</em></p>
        <UButton icon="material-symbols:eye-tracking" color="neutral" variant="soft" @click="selectProblem(problem)"/>
      </div>
    </div>
    <UDrawer v-model:open="isDetailDrawerVisible" direction="bottom" should-scale-background :title="`${selectedProblem?.account?.name} ${selectedProblem?.account?.surname}, problemi şu şekilde bildirdi:`">
      <template #body>
        <div class="flex flex-col gap-y-2">
            <UAlert :title="selectedProblem.message" color="warning"/>
            <div class="flex justify-center items-center gap-x-2">
              <p class="text-md">Eylem Durumu:</p>
              <UBadge label="İşleme Alınmadı" color="neutral" variant="subtle" v-if="selectedProblem.status == 0" />
              <UBadge label="İşlem Sürüyor" color="warning" variant="subtle" v-if="selectedProblem.status == 1"/>
              <UBadge label="Bitti" color="success" variant="subtle" v-if="selectedProblem.status == 2"/>
            </div>
        </div>
        <div class="my-3">
          <UButtonGroup size="md" class="w-full">
            <UButton block label="Sorun Devam Ediyor" color="neutral" variant="subtle" v-if="selectedProblem.status != 0" @click=updateStatus(0) loading-auto />
            <UButton block label="İşleme Al" color="warning" variant="subtle" v-if="selectedProblem.status != 1" @click=updateStatus(1) loading-auto />
            <UButton block label="Bitti Olarak İşaretle" color="success" variant="subtle" v-if="selectedProblem.status != 2" @click=updateStatus(2) loading-auto />
          </UButtonGroup>
        </div>
        <USeparator label="Olay Geçmişi"/>
        <div class="flex flex-col gap-y-2">
          <div class="flex justify-start items-center gap-x-2" v-for="history in selectedProblem.accountVehicleProblemHistories">
            <UAvatar :src="history.account.profilePicture" :alt="`${history.account.name} ${history.account.surname}`"/>
            <p class="text-md" >{{ history.account.name }} {{history.account.surname}} eylem durumunu <VehicleProblemTaskStatusBadge :status="history.fromStatus"/> → <VehicleProblemTaskStatusBadge :status="history.toStatus"/> olarak değiştirdi.</p>
          </div>
        </div>
      </template>
    </UDrawer>
  </div>
</template>

<script lang="ts" setup>
import { useApi } from '~/core/api/useApi';

defineProps<{
  problems: any[]
}>();

const emits = defineEmits(['onUpdate'])

const {user} = storeToRefs(useAuthStore())

const selectedProblem = ref();
const isDetailDrawerVisible = ref(false);

function selectProblem(payload: any){
  selectedProblem.value = payload;
  isDetailDrawerVisible.value = true;
}

function updateStatus(status: number){
    useApi().accountVehicle.UpdateProblem(selectedProblem.value.id, status).then(() => {
      emits('onUpdate');
      isDetailDrawerVisible.value =false
    })
}
</script>

