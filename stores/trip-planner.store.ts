export const useTripPlannerStore = defineStore('trip-planning', () => {
    const steps = ref([
        'Transfer Tipi',
        'Rota Planı',
        'Araç Seçimi',
        'Ödeme'
    ])
    const currentStep = ref(0);

    function nextStep(){
        if(currentStep.value + 1 !== steps.value.length) currentStep.value++
    }
    function prevStep(){
        if(currentStep.value !== 0) currentStep.value--
    }

    return {
        steps,
        currentStep,
        nextStep,
        prevStep
    }
})