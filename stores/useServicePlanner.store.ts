import type { IEmployee } from "~/core/api/modules/account/models/IEmployee";
import { useApi } from "~/core/api/useApi";
import type { ILocationSearchResult } from "~/core/app/ITripLocation";
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

export const useServicePlannerStore = defineStore('servicePlannerStore', () => {
    const df = new DateFormatter('tr-TR', {
        dateStyle: 'medium'
      })
    const serviceLocation = ref<ILocationSearchResult>();
    const employeeDataSource = ref(<IEmployee[]>[]);

    const hours = ref(['00','02','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']);
    const minutes = ref(['00', '10', '15', '20' ,'30','40','45','50']);
    const fromHour = ref('09');
    const fromMinute = ref('00');
    const fromDates = ref(<any>[]);
    const toHour = ref('18');
    const toMinute = ref('00')
    const toDates = ref(<any>[])
    const directionType = ref<'oneWay' | 'twoWay' | 'none'>('none');
    const oneWayDetail = ref<'to' | 'from' | 'none'>('none');
    
    const employeeSearchInput = ref('')
    const employeeView = computed(() => {
        if (employeeSearchInput.value != '') {
          return employeeDataSource.value.filter(x => x.name.startsWith(employeeSearchInput.value) || x.surname.startsWith(employeeSearchInput.value));
        }
        return employeeDataSource.value;
      });
    const selectedEmployee = computed(() => employeeDataSource.value.filter(x => x.isSelected))
    const fromDatesView = computed(() => {
        if(fromDates.value.length == 0) return 'Tarih Seçin'
        if(fromDates.value.length == 1){
           return df.format(fromDates.value[0].toDate(getLocalTimeZone())) 
        }
        return `${fromDates.value.length} Tarih Seçildi`
    })
    const toDatesView = computed(() => {
        if(toDates.value.length == 0) return 'Tarih Seçin'
        if(toDates.value.length == 1){
           return df.format(toDates.value[0].toDate(getLocalTimeZone())) 
        }
        return `${toDates.value.length} Tarih Seçildi`
    })

    
    
    function toggleEmployee(payload: IEmployee) {
        employeeDataSource.value.find(x => x == payload)!.isSelected = !employeeDataSource.value.find(x => x == payload)!.isSelected
    }

    function setServiceLocation(payload: ILocationSearchResult){
        serviceLocation.value = payload;
    }

    function setOneWayDetail(payload: 'to' | 'from'){
        oneWayDetail.value = payload;
    }

    function setDirectionType(payload: 'oneWay' | 'twoWay'){
        directionType.value = payload;
    }


    useApi().account.GetEmployee().then(res => {
        employeeDataSource.value = res.data.map(x => {
          return { ...x, isSelected: false }
        })
      })
    return {
        serviceLocation,
        employeeView,
        selectedEmployee,
        oneWayDetail,
        directionType,
        minutes,
        hours,
        fromHour,
        fromMinute,
        toHour,
        toMinute,
        employeeSearchInput,
        fromDates,
        toDates,
        fromDatesView,
        toDatesView,

        setServiceLocation,
        toggleEmployee,
        setOneWayDetail,
        setDirectionType
    }
})