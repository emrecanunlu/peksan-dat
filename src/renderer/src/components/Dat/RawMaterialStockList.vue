<script setup>
import { ref, onMounted, computed } from 'vue'
import barrelSerialService from '@/utils/services/barrelSerial'

defineEmits(['rowClick'])

const props = defineProps({
  requestStockList: {
    type: Array,
    required: false,
    default: () => []
  }
})

const loading = ref(false)
const stockList = ref([])
const showAllStocks = ref(false)

const filteredStockList = computed(() => {
  return stockList.value.filter((item) => !props.requestStockList.includes(item.code))
})

const hasCriticalStock = computed(() => {
  return filteredStockList.value.some((item) => {
    const warehouseAmount = Number(item.warehouseStockAmount)
    return !isNaN(warehouseAmount) && warehouseAmount < 1500
  })
})

const getStockList = () => {
  loading.value = true
  barrelSerialService
    .requestStockList({
      allStock: showAllStocks.value,
      raw: true
    })
    .then((response) => {
      stockList.value = response.data || []
    })
    .finally(() => {
      loading.value = false
    })
}

const handleShowAllStocks = (value) => {
  showAllStocks.value = value
  getStockList()
}

const formatNumber = (value) => {
  if (value === null || value === undefined) return ''
  const number = Number(value)
  return isNaN(number) ? '' : number.toFixed(2)
}

onMounted(() => {
  getStockList()
})
</script>

<template>
  <v-card
    class="w-100 h-100 d-flex flex-column overflow-y-hidden"
    border
    :loading="loading"
    :class="{ 'critical-stock': hasCriticalStock }"
  >
    <template #prepend>
      <div class="d-flex align-center gap-2">
        <v-chip prepend-icon="mdi-barrel" color="primary" variant="tonal">
          Hammadde Stok Listesi
        </v-chip>
        <v-chip
          v-if="hasCriticalStock"
          color="error"
          variant="elevated"
          class="blink"
          prepend-icon="mdi-alert"
        >
          Kritik Seviye
        </v-chip>
      </div>
    </template>
    <template #append>
      <v-checkbox
        v-model="showAllStocks"
        label="Tüm Stokları Göster"
        density="compact"
        hide-details
        color="primary"
        @update:model-value="handleShowAllStocks"
      />
    </template>
    <v-card-text class="flex-1 overflow-y-hidden">
      <v-table class="h-100" fixed-header hover>
        <thead>
          <tr>
            <th>Stok Kodu</th>
            <th>Stok Adı</th>
            <th>İş Emri Miktarı</th>
            <th>Depo Miktarı</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in filteredStockList" :key="item.id">
            <tr
              @click.stop="$emit('rowClick', item, index)"
              :class="{
                'bg-error text-white': Number(item.warehouseStockAmount) < 1500
              }"
            >
              <td>
                <div class="d-flex align-center gap-2">
                  <v-icon
                    v-if="Number(item.warehouseStockAmount) < 1500"
                    color="white"
                    size="small"
                    icon="mdi-alert"
                  />
                  {{ item.code }}
                </div>
              </td>
              <td>{{ item.name }}</td>
              <td>{{ formatNumber(item.workorderStockAmount) }}</td>
              <td :class="{ 'font-weight-bold': Number(item.warehouseStockAmount) < 1500 }">
                {{ formatNumber(item.warehouseStockAmount) }}
              </td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.critical-stock {
  border: 2px solid rgb(var(--v-theme-error)) !important;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.blink {
  animation: blink 1.5s infinite;
}
</style>
