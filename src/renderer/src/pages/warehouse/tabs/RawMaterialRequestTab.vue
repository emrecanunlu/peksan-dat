<script setup>
import { ref, onBeforeMount } from 'vue'
import StockList from '@/components/Dat/StockList.vue'
import RequestedStockList from '@/components/Dat/RequestedStockList.vue'
import barrelSerialService from '@/utils/services/barrelSerial'
import SnackbarHelper from '@/utils/helpers/SnackbarHelper'

const colorStockList = ref([])
const rawMaterialStockList = ref([])
const requestStockList = ref([])

const loading = ref(false)

const handleRowClick = (item, type) => {
  requestStockList.value = [{ ...item, amount: null, type }, ...requestStockList.value]
}

const handleRemove = (item) => {
  requestStockList.value = requestStockList.value.filter((el) => el.code !== item.code)
}

const handleAmountUpdate = (amount, item) => {
  requestStockList.value = requestStockList.value.map((el) =>
    el.code === item.code ? { ...el, amount: amount } : el
  )
}

const handleSubmit = () => {
  loading.value = true

  const data = requestStockList.value.map((item) => ({
    stokKodu: item.code,
    miktar: parseFloat(item.amount)
  }))

  barrelSerialService
    .requestStock(data)
    .then(() => {
      SnackbarHelper.showSuccess('Stok talebi başarıyla oluşturuldu')
      requestStockList.value = []

      getStockList()
    })
    .finally(() => {
      loading.value = false
    })
}

const getStockList = () => {
  loading.value = true
  barrelSerialService
    .getRequestStockCode()
    .then((result) => {
      colorStockList.value = result.data.paints
      rawMaterialStockList.value = result.data.rawMaterials
    })
    .finally(() => {
      loading.value = false
    })
}

onBeforeMount(() => {
  getStockList()
})
</script>

<template>
  <v-card class="h-100 d-flex flex-column pa-2" :loading="loading" :disabled="loading">
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
        @click.stop="handleSubmit"
      >
        <span class="text-capitalize">Talep Et</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
