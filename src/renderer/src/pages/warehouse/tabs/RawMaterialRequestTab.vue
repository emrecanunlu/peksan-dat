<script setup>
import { ref } from 'vue'
import RawMaterialStockList from '@/components/Dat/RawMaterialStockList.vue'
import ColorStockList from '@/components/Dat/ColorStockList.vue'
import RequestedStockList from '@/components/Dat/RequestedStockList.vue'
import barrelSerialService from '@/utils/services/barrelSerial'
import SnackbarHelper from '@/utils/helpers/SnackbarHelper'
import oneSignalService from '@/utils/services/onesignal'

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
    .then(async () => {
      oneSignalService.sendPushNotification(
        requestStockList.value.map((item) => ({
          stockCode: item.code,
          stockName: item.name,
          amount: parseFloat(item.amount) || 0
        }))
      )

      SnackbarHelper.showSuccess('Stok talebi başarıyla oluşturuldu')
      requestStockList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <v-card class="h-100 d-flex flex-column pa-2" :loading="loading" :disabled="loading">
    <v-card-text class="h-100 overflow-y-hidden pa-0 d-flex flex-column ga-2">
      <div class="h-50 d-flex ga-2">
        <raw-material-stock-list
          :request-stock-list="requestStockList.map((item) => item.code)"
          @row-click="(item) => handleRowClick(item, 'Hammadde')"
        />
        <color-stock-list
          :request-stock-list="requestStockList.map((item) => item.code)"
          @row-click="(item) => handleRowClick(item, 'Boya')"
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
