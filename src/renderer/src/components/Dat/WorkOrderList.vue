<script setup>
import { computed, inject } from 'vue'
import { useStore } from 'vuex'
import workOrderService from '@/utils/services/workOrder'
import SnackbarHelper from '@/utils/helpers/SnackbarHelper'

const emit = defineEmits(['on-row-click'])
const state = inject('state')
const store = useStore()

const remainingList = computed(() => store.getters['workorder/getRemainingList'])
const loading = computed(() => store.getters['workorder/getLoading'])

const handleRowClick = async (row) => {
  const depoKodu = String(row.depoKodu)
  state.machine = depoKodu
  state.barrel = null
  state.materials = null

  store.dispatch('production/loadProductionQuantities', depoKodu)

  state.isLoading = true
  const result = await workOrderService.getById(parseInt(depoKodu))
  const workOrders = result.data

  if (workOrders.length > 0) {
    state.workOrder = workOrders[0]
  } else {
    SnackbarHelper.showError('İş emri bulunamadı!')
    state.workOrder = null
  }

  state.isLoading = false
  emit('on-row-click', row)
}
</script>

<template>
  <v-card :loading="loading" :disabled="loading" :elevation="0" :rounded="0" height="350px">
    <v-table class="h-100" hover fixed-header>
      <thead>
        <tr>
          <th>İş Emri No</th>
          <th class="text-center">Toplam Miktar</th>
          <th class="text-center">Harcanan Miktar</th>
          <th class="text-center">Kalan Miktar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in remainingList" :key="item.id" @click="handleRowClick(item)">
          <td class="text-body-1">
            {{ item.workOrder }}
          </td>
          <td class="text-center">
            <v-chip color="primary" variant="tonal" class="font-weight-medium">
              <v-icon start icon="mdi-scale" size="16"></v-icon>
              {{ item.totalSummary.totalAmount.toFixed(2) }} KG
            </v-chip>
          </td>
          <td class="text-center">
            <v-chip color="success" variant="tonal" class="font-weight-medium">
              <v-icon start icon="mdi-check-circle" size="16"></v-icon>
              {{ item.totalSummary.totalSpent.toFixed(2) }} KG
            </v-chip>
          </td>
          <td class="text-center">
            <v-chip color="error" variant="tonal" class="font-weight-medium">
              <v-icon start icon="mdi-alert-circle" size="16"></v-icon>
              {{ item.totalSummary.totalRemaining.toFixed(2) }} KG
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<style scoped>
:deep(.v-chip) {
  height: 32px;
}
</style>
