<script setup>
import store from '@/store'
import SnackbarHelper from '@/utils/helpers/SnackbarHelper'
import machineService from '@/utils/services/machine'
import workOrderService from '@/utils/services/workOrder'
import { inject, onBeforeMount, ref } from 'vue'

const isLoading = ref(false)
const machines = ref([])
const state = inject('state')

const getMachines = () => {
  isLoading.value = true
  machineService.getAll().then((result) => {
    machines.value = result.data
    isLoading.value = false
  })
}

const handleChange = (val) => {
  console.log(val)

  state.barrel = null
  state.materials = null

  store.dispatch('production/loadProductionQuantities', val)

  if (val) {
    state.isLoading = true
    workOrderService.getById(parseInt(val)).then((result) => {
      const workOrders = result.data

      if (workOrders.length > 0) {
        state.workOrder = workOrders[0]
      } else {
        SnackbarHelper.showError('İş emri bulunamadı!')
        state.workOrder = null
      }

      state.isLoading = false
    })
  }
}

onBeforeMount(() => {
  getMachines()
})
</script>

<template>
  <v-autocomplete
    v-model="state.machine"
    variant="outlined"
    color="primary"
    hide-details
    label="Makine Seçiniz"
    placeholder="Makine aramak için yazın..."
    clearable
    :items="machines"
    :item-title="(item) => `${item.machineId} - ${item.name}`"
    :item-value="(item) => item.machineId"
    :disabled="isLoading"
    :loading="isLoading"
    @click:clear="state.workOrder = null"
    @update:model-value="handleChange"
  >
    <!-- Prepend Icon -->
    <template #prepend-inner>
      <v-icon
        :color="state.machine ? 'primary' : undefined"
        icon="mdi-robot-industrial"
        class="mr-2"
      />
    </template>

    <!-- Loading Progress -->
    <template #append-inner>
      <v-progress-circular v-if="isLoading" size="24" color="primary" indeterminate />
    </template>

    <!-- Item Template -->
    <template #item="{ props, item }">
      <v-list-item v-bind="props" :title="`${item.raw.machineId} - ${item.raw.name}`">
        <template #prepend>
          <v-avatar color="primary" variant="tonal" size="32">
            <span class="text-caption">
              {{ item.raw.machineId }}
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
        <v-list-item-title>Makine bulunamadı</v-list-item-title>
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
