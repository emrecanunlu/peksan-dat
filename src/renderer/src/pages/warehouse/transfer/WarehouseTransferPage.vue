<script setup>
import { ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import RawMaterialTab from '@/pages/warehouse/tabs/RawMaterialTab.vue'
import ColorTab from '@/pages/warehouse/tabs/ColorTab.vue'

const tab = ref(0)
const store = useStore()

const tabs = [
  {
    title: 'Hammadde',
    icon: 'mdi-package-variant',
    tab: RawMaterialTab
  },
  {
    title: 'Boya',
    icon: 'mdi-palette',
    tab: ColorTab
  }
]

const handleTabChange = (value) => {
  store.dispatch('production/reset')
  store.dispatch('workorder/loadRemainingList', Boolean(value))
  store.commit('workorder/setRemainingList', [])
}

onBeforeMount(() => {
  store.dispatch('workorder/loadRemainingList', false)
})
</script>

<template>
  <v-container fluid class="pa-4 fill-height">
    <v-card elevation="4" rounded="lg" height="100%" width="100%">
      <!-- Tab Menü -->
      <v-tabs
        v-model="tab"
        color="primary"
        align-tabs="start"
        height="72"
        class="border-b"
        @update:model-value="handleTabChange"
      >
        <v-tab
          v-for="(item, index) in tabs"
          :key="index"
          :value="index"
          class="text-none tab-button"
          height="72"
        >
          <v-icon :icon="item.icon" size="28" class="mr-2"></v-icon>
          <span class="text-h6 font-weight-medium">{{ item.title }}</span>
        </v-tab>
      </v-tabs>

      <!-- İçerik -->
      <v-window v-model="tab">
        <v-window-item v-for="(item, index) in tabs" :key="index" :value="index">
          <v-card-text class="pa-6">
            <component :is="item.tab" :key="`tab-${tab}-${index}`"></component>
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<style scoped>
:deep(.v-tab) {
  text-transform: none;
  letter-spacing: 0.5px;
  flex: 1;
  max-width: 50%;
}

:deep(.v-tab--selected) {
  font-weight: 600;
}

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.22);
}

:deep(.v-tabs) {
  display: flex;
}
</style>
