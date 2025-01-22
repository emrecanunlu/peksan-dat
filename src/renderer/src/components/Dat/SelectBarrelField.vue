<script setup>
import rawMaterialService from '@/utils/services/rawMaterial'
import { inject, onBeforeMount, ref } from 'vue'

const isLoading = ref(false)
const barrels = ref([])
const state = inject('state')

const getBarrels = async () => {
  isLoading.value = true
  rawMaterialService.getBarrels().then((result) => {
    barrels.value = state.isColor ? result.data.color : result.data.rawMaterial
    isLoading.value = false
  })
}

const handleChange = async (barrelKg) => {
  state.isLoading = true
  rawMaterialService
    .getMaterials(state.workOrder?.workOrder ?? '', barrelKg, state.isColor ?? false)
    .then((result) => {
      if (state.isColor) {
        const rawMaterials = result.data.map((item) => ({
          ...item,
          ratio: item.ratio * 100,
          dispatchAmount: state.barrel * item.ratio,
          series: []
        }))

        state.tmp = rawMaterials
        state.materials = rawMaterials
      } else {
        state.tmp = result.data
        state.materials = result.data.map((item) => ({ ...item, series: [] }))
      }

      state.isLoading = false
    })
}

onBeforeMount(() => {
  getBarrels()
})
</script>

<template>
  <v-autocomplete
    v-model="state.barrel"
    variant="outlined"
    color="primary"
    hide-details
    label="Varil Seçiniz"
    placeholder="Varil kg aramak için yazın..."
    :disabled="!state.workOrder"
    :item-value="(item) => item"
    :item-title="(item) => `${item} KG`"
    :loading="isLoading"
    :items="barrels"
    @update:model-value="handleChange"
  >
    <!-- Prepend Icon -->
    <template #prepend-inner>
      <v-icon
        :color="state.barrel ? 'primary' : undefined"
        icon="mdi-weight-kilogram"
        class="mr-2"
      />
    </template>

    <!-- Loading Progress -->
    <template #append-inner>
      <v-progress-circular v-if="isLoading" size="24" color="primary" indeterminate />
    </template>

    <!-- Item Template -->
    <template #item="{ props, item }">
      <v-list-item v-bind="props" :title="`${item.raw} KG`">
        <template #prepend>
          <v-avatar color="primary" variant="tonal" size="32">
            <span class="text-caption">
              {{ item.raw }}
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
        <v-list-item-title>Varil bulunamadı</v-list-item-title>
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
