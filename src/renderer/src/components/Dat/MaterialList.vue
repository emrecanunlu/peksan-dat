<script setup>
import { toRef, ref, inject } from 'vue'
import SerialListDialog from '../Modals/SerialListDialog.vue'
import { computed } from 'vue'
import Decimal from 'decimal.js'

const state = inject('state')
const materials = toRef(state, 'materials')

const modalVisible = ref(false)
const selectedMaterial = ref(null)

const handleRowClick = (row) => {
  selectedMaterial.value = row
  modalVisible.value = true
}

const isSucceeded = (item) =>
  computed(() => {
    const totalSeriesAmount = item.series.reduce((prev, curr) => {
      const amount = new Decimal(curr.amount)

      return parseFloat(amount.plus(prev))
    }, 0)

    const totalAmount = new Decimal(item.dispatchAmount)

    return totalAmount.equals(totalSeriesAmount)
  })

/* const modal = useModal(SerialListDialog)

const handleRowClick = async (material) => {
  state.isLoading = true
  selected.value = material
  rawMaterialService
    .getSeries(material.rawCode, { page: 1, pageSize: 10 })
    .then((result) => {
      const { data } = result.data

      modal.show({
        data: data.map((item, id) => ({ id, ...item })),
        material: selected
      })
    })
    .finally(() => {
      state.isLoading = false
    })
} */
</script>

<template>
  <v-table class="h-100 flex-fill overflow-y-auto" fixed-header hover>
    <thead>
      <tr>
        <th>Ürün Grubu</th>
        <th>Stok İsmi</th>
        <th>Ham Kodu</th>
        <th>Oran</th>
        <th>Sevk Kg</th>
        <th>Toplam Miktar</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in materials || []"
        :key="index"
        :class="{
          'bg-green-darken-1': isSucceeded(item).value
        }"
        @click.stop="handleRowClick(item)"
      >
        <td>{{ item?.productGroup ?? '' }}</td>
        <td>{{ item?.stockName ?? '' }}</td>
        <td>{{ item?.rawCode ?? '' }}</td>
        <td>{{ item?.ratio ?? '' }}</td>
        <td>{{ item?.dispatchAmount ?? '' }}</td>
        <td>{{ item?.totalAmount ?? '' }}</td>
      </tr>
    </tbody>
  </v-table>

  <serial-list-dialog
    v-if="modalVisible"
    :open="modalVisible"
    :material="selectedMaterial"
    @update:open="modalVisible = $event"
  />
</template>
