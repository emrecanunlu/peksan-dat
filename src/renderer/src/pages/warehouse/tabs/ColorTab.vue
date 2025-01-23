<script setup>
import TransferForm from '@/components/Dat/TransferForm.vue'
import MaterialList from '@/components/Dat/MaterialList.vue'
import CardTitle from '@/components/Dat/CardTitle.vue'
import Decimal from 'decimal.js'
import rawMaterialService from '@/utils/services/rawMaterial'
import useClock from '@/hooks/useClock'
import { useStore } from 'vuex'
import { onBeforeUnmount, reactive, computed, provide } from 'vue'
import SnackbarHelper from '@/utils/helpers/SnackbarHelper'
import WorkOrderList from '@/components/Dat/WorkOrderList.vue'
const state = reactive({
  barrel: null,
  machine: null,
  workOrder: null,
  materials: null,
  isColor: true,
  tmp: null,
  isLoading: false
})

const store = useStore()

const employee = store.getters['auth/_employee']
const { shift, clear } = useClock()
provide('state', state)

const isCompleted = computed(() => {
  return state.materials
    ? state.materials?.every((item) => {
        const serialTotalAmount = item.series.reduce((curr, e) => {
          const amount = new Decimal(e.amount)

          return parseFloat(amount.plus(curr))
        }, 0)

        return new Decimal(item.dispatchAmount).equals(serialTotalAmount)
      })
    : false
})

const handleClick = () => {
  const data = {
    isColor: state.isColor,
    workOrder: state.workOrder?.workOrder ?? '',
    staffId: parseInt(employee.staffId),
    machineId: parseInt(state.machine),
    shift: shift.value,
    entranceWareHouse: parseInt(state.machine),
    materials: state.materials.map((material) => ({
      stockCode: material.rawCode,
      amount: material.dispatchAmount,
      ratio: material.ratio,
      serial: material.series.map((serie) => ({
        serialNo: serie.serialNo,
        lotNo: serie?.lotNo || serie.color,
        amount: serie.amount,
        ratio: serie.ratio
      }))
    }))
  }

  state.isLoading = true
  rawMaterialService
    .transfer(data)
    .then((result) => {
      state.barrel = null
      state.machine = null
      state.materials = null
      state.tmp = null
      state.isLoading = false
      state.workOrder = null

      window.electron.ipcRenderer.send('print-label', result.data)
      SnackbarHelper.showSuccess('Transfer başarılı')
    })
    .finally(() => {
      state.isLoading = false
    })
}

onBeforeUnmount(() => {
  clear()
})
</script>

<template>
  <v-container fluid class="d-flex flex-column h-100 pa-0 justify-space-between">
    <v-card
      :disabled="state.isLoading"
      :loading="state.isLoading"
      class="h-100 flex-fill d-flex flex-column"
    >
      <v-card-text class="h-100 flex-fill d-flex flex-column overflow-y-hidden">
        <card-title :work-order="state.workOrder" />
        <transfer-form />
        <v-divider class="my-4" />
        <material-list />
      </v-card-text>
      <v-card-actions v-if="state.materials" class="d-flex justify-end">
        <v-btn
          :disabled="!isCompleted"
          color="indigo"
          size="large"
          variant="elevated"
          prepend-icon="mdi-transfer"
          @click="handleClick"
          >Transfer</v-btn
        >
      </v-card-actions>
    </v-card>

    <work-order-list @on-row-click="state.machine = String($event.depoKodu)" />
  </v-container>
</template>
