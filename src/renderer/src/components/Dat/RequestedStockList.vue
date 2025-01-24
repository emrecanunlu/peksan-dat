<script setup>
defineEmits(['remove', 'update:amount'])

defineProps({
  list: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <v-card class="h-100" border>
    <v-card-text class="h-100 overflow-y-auto">
      <v-table class="flex-fill h-100" fixed-header hover>
        <thead>
          <tr>
            <th>İşlem</th>
            <th>Stok Kodu</th>
            <th>Stok Adı</th>
            <th>Tip</th>
            <th>Miktar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id">
            <td>
              <v-btn
                icon="mdi-minus"
                variant="tonal"
                size="small"
                color="error"
                @click.stop="$emit('remove', item)"
              />
            </td>
            <td class="text-primary font-weight-bold text-subtitle-1">{{ item.code }}</td>
            <td>{{ item.name }}</td>
            <td>
              <v-chip
                variant="tonal"
                color="primary"
                :prepend-icon="item.type === 'Boya' ? 'mdi-palette' : 'mdi-barrel'"
              >
                {{ item.type }}
              </v-chip>
            </td>
            <td>
              <v-text-field
                type="number"
                :min="0"
                :value="item.amount"
                variant="underlined"
                :error="item.amount <= 0"
                :error-messages="item.amount <= 0 ? 'Miktar 0 veya 0\'dan küçük olamaz' : ''"
                @update:model-value="$emit('update:amount', $event, item)"
              />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
