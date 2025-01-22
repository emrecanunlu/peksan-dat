<script setup>
import { onBeforeMount, ref } from 'vue'
import employeeService from '@/utils/services/employee'
import { toRef } from 'vue'

const props = defineProps({
  selected: {
    type: [Object, null],
    required: true
  }
})

const { value: selected } = toRef(props.selected)
const emit = defineEmits(['change'])

const isLoading = ref(false)
const employees = ref([])

const getEmployees = async () => {
  isLoading.value = true
  employeeService.getAll('H').then((result) => {
    employees.value = result.data
    isLoading.value = false
  })
}

onBeforeMount(() => {
  getEmployees()
})
</script>

<template>
  <v-autocomplete
    v-model="selected"
    :loading="isLoading"
    :disabled="isLoading"
    :items="employees"
    variant="outlined"
    color="primary"
    return-object
    label="Personel Seçiniz"
    placeholder="Personel aramak için yazın..."
    :item-title="(item) => `${item.staffId} - ${item.firstName} ${item.lastName}`"
    hide-details
    @update:model-value="(val) => emit('change', val)"
  >
    <!-- Prepend Icon -->
    <template #prepend-inner>
      <v-icon :color="selected ? 'primary' : undefined" icon="mdi-account-search" class="mr-2" />
    </template>

    <!-- Loading Progress -->
    <template #append-inner>
      <v-progress-circular v-if="isLoading" size="24" color="primary" indeterminate />
    </template>

    <!-- Item Template -->
    <template #item="{ props, item }">
      <v-list-item
        v-bind="props"
        :title="`${item.raw.firstName} ${item.raw.lastName}`"
        :subtitle="`${item.raw.staffId}`"
      >
        <template #prepend>
          <v-avatar color="primary" variant="tonal" size="32">
            <span class="text-caption">
              {{ item.raw.staffId }}
            </span>
          </v-avatar>
        </template>
      </v-list-item>
    </template>

    <!-- No Data Text -->
    <template #no-data>
      <v-list-item>
        <template #prepend>
          <v-icon icon="mdi-alert" color="warning" />
        </template>
        <v-list-item-title>Personel bulunamadı</v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<style scoped>
:deep(.v-field__input) {
  min-height: 56px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

:deep(.v-list-item) {
  min-height: 56px;
}

:deep(.v-list-item__content) {
  font-size: 1.1rem;
}

:deep(.v-field) {
  border-radius: 8px;
}
</style>
