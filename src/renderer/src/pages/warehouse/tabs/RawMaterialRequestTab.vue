<script setup>
import { ref, onBeforeMount } from 'vue'
import StockList from '@/components/Dat/StockList.vue'
import RequestedStockList from '@/components/Dat/RequestedStockList.vue'
import barrelSerialService from '@/utils/services/barrelSerial'

const colorStockList = ref([])
const rawMaterialStockList = ref([])

const requestStockList = ref([])

const handleRowClick = (item, type) => {
  requestStockList.value = [{ ...item, amount: 0, type }, ...requestStockList.value]
}

const handleRemove = (item) => {
  requestStockList.value = requestStockList.value.filter((el) => el.code !== item.code)
}

const handleAmountUpdate = (amount, item) => {
  requestStockList.value = requestStockList.value.map((el) =>
    el.code === item.code ? { ...el, amount: amount } : el
  )
}

const getStockList = () => {
  barrelSerialService.getRequestStockCode().then((result) => {
    colorStockList.value = result.data.paints
    rawMaterialStockList.value = result.data.rawMaterials
  })
}

onBeforeMount(() => {
  getStockList()
})
</script>

<template>
  <v-card class="h-100 d-flex flex-column pa-2">
    <v-card-text class="h-100 overflow-y-hidden pa-0 d-flex flex-column ga-2">
      <div class="h-50 d-flex ga-2">
        <stock-list
          :list="rawMaterialStockList"
          :request-stock-list="requestStockList.map((item) => item.code)"
          icon="mdi-barrel"
          title="Hammadde Stok Listesi"
          @row-click="handleRowClick($event, 'Hammadde')"
        />
        <stock-list
          :list="colorStockList"
          :request-stock-list="requestStockList.map((item) => item.code)"
          icon="mdi-palette"
          title="Boya Stok Listesi"
          @row-click="handleRowClick($event, 'Boya')"
        />
      </div>
      <div class="h-50">
        <requested-stock-list
          :list="requestStockList"
          @remove="handleRemove"
          @update:amount="handleAmountUpdate"
        />
      </div>
    </v-card-text>
    <v-card-actions v-if="requestStockList.length > 0">
      <v-spacer />
      <v-btn
        prepend-icon="mdi-send"
        size="large"
        variant="elevated"
        color="primary"
        :disabled="requestStockList.some((item) => item.amount <= 0)"
      >
        <span class="text-capitalize">Talep Et</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
