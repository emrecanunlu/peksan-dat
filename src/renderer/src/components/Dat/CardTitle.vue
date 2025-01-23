<script setup>
import { computed } from 'vue'
import { toRefs } from 'vue'

const props = defineProps({
  workOrder: {
    type: [Object, null],
    default: null
  }
})

const { workOrder } = toRefs(props)

const workOrderInfo = computed(() => {
  if (!workOrder.value) {
    return {
      message: 'Lütfen iş emri bilgisi seçiniz.',
      isEmpty: true
    }
  }

  return {
    workOrder: workOrder.value.workOrder,
    stockCode: workOrder.value.stockCode,
    color: workOrder.value.color,
    amount: `${workOrder.value.amount} KG`,
    isEmpty: false
  }
})
</script>

<template>
  <div class="py-4 pr-4 mb-2">
    <div v-if="workOrderInfo.isEmpty" class="d-flex align-center">
      <v-icon icon="mdi-information" color="primary" size="24" class="mr-2"></v-icon>
      <span class="text-primary text-h6">{{ workOrderInfo.message }}</span>
    </div>

    <div v-else>
      <div class="d-flex flex-wrap gap-4">
        <v-chip color="primary" size="large" variant="tonal" label>
          <template #prepend>
            <v-icon size="18" class="mr-2">mdi-pound</v-icon>
          </template>
          <span class="font-weight-medium">{{ workOrderInfo.workOrder }}</span>
        </v-chip>

        <v-chip color="primary" size="large" variant="tonal" label>
          <template #prepend>
            <v-icon size="18" class="mr-2">mdi-barcode</v-icon>
          </template>
          <span class="font-weight-medium">{{ workOrderInfo.stockCode }}</span>
        </v-chip>

        <v-chip color="primary" size="large" variant="tonal" label>
          <template #prepend>
            <v-icon size="18" class="mr-2">mdi-palette</v-icon>
          </template>
          <span class="font-weight-medium">{{ workOrderInfo.color }}</span>
        </v-chip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gap-4 {
  gap: 1rem;
}
</style>
