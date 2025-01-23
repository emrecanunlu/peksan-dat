<script setup>
import StockList from '@/components/Dat/StockList.vue'
</script>

<template>
  <v-container fluid class="h-100 pa-0">
    <v-card elevation="0" rounded="0" class="h-100">
      <v-card-text>
        <stock-list />
      </v-card-text>
    </v-card>
  </v-container>
</template>
