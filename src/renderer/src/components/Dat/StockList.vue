<script setup>
defineEmits(['rowClick'])

defineProps({
  list: {
    type: Array,
    required: true
  },
  requestStockList: {
    type: Array,
    required: false,
    default: () => []
  },
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})
</script>

<template>
  <v-card class="w-100 h-100 d-flex flex-column overflow-y-hidden" border>
    <template #prepend>
      <v-chip :prepend-icon="icon" color="primary" variant="tonal">
        {{ title }}
      </v-chip>
    </template>
    <v-card-text class="flex-1 overflow-y-hidden">
      <v-table class="h-100" fixed-header hover>
        <thead>
          <tr>
            <th>Stok Kodu</th>
            <th>Stok Adı</th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="(item, index) in Array.from(list).filter(
              (item) => !requestStockList.includes(item.code)
            )"
            :key="item.id"
          >
            <tr @click.stop="$emit('rowClick', item, index)">
              <td>{{ item.code }}</td>
              <td>{{ item.name }}</td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
