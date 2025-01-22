<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import useClock from '@/hooks/useClock'
import { computed, onBeforeUnmount } from 'vue'

const store = useStore()
const router = useRouter()

const employee = store.getters['auth/_employee']
const { currentTime, shift, clear } = useClock()

const production = computed(() => store.state['production'])

const signOut = () => {
  store.dispatch['auth/logout']
  router.push({ path: '/auth/login' })
}

onBeforeUnmount(() => {
  clear()
})
</script>

<template>
  <v-app>
    <v-layout>
      <v-app-bar color="primary" elevation="4" height="72">
        <div class="d-flex align-center w-100 px-4">
          <!-- Sol Taraf - Çalışan Bilgileri -->
          <v-chip
            class="mr-4"
            color="primary-lighten-1"
            size="large"
            variant="elevated"
            prepend-icon="mdi-account-hard-hat"
          >
            <span class="font-weight-medium">{{ employee.staffId }}</span>
            <span class="mx-1">-</span>
            <span>{{ employee.firstName }} {{ employee.lastName }}</span>
          </v-chip>

          <v-chip
            color="primary-lighten-1"
            size="large"
            variant="elevated"
            prepend-icon="mdi-clock-outline"
          >
            <span class="font-weight-medium">{{ shift }}. Vardiya</span>
          </v-chip>

          <v-divider class="mx-6" vertical thickness="2"></v-divider>

          <!-- Orta - Üretim Bilgileri -->
          <div class="d-flex align-center">
            <v-chip
              class="mr-4"
              color="info"
              size="large"
              variant="elevated"
              prepend-icon="mdi-clipboard-list-outline"
            >
              <span class="font-weight-medium">Üretilecek:</span>
              <span class="ml-2">{{ production.toBeProduced }}</span>
            </v-chip>

            <v-chip
              class="mr-4"
              color="success"
              size="large"
              variant="elevated"
              prepend-icon="mdi-check-circle-outline"
            >
              <span class="font-weight-medium">Üretilen:</span>
              <span class="ml-2">{{ production.produced }}</span>
            </v-chip>

            <v-chip
              color="error"
              size="large"
              variant="elevated"
              prepend-icon="mdi-alert-circle-outline"
            >
              <span class="font-weight-medium">Kalan:</span>
              <span class="ml-2">{{ production.remaining }}</span>
            </v-chip>
          </div>

          <v-spacer></v-spacer>

          <!-- Sağ Taraf - Saat ve Çıkış -->
          <v-chip
            class="mr-4"
            color="primary-lighten-1"
            size="large"
            variant="elevated"
            prepend-icon="mdi-clock"
          >
            {{ currentTime }}
          </v-chip>

          <v-btn
            color="white"
            variant="flat"
            size="large"
            prepend-icon="mdi-logout"
            class="font-weight-medium"
            @click="signOut"
          >
            <span class="text-primary">Çıkış</span>
          </v-btn>
        </div>
      </v-app-bar>

      <v-main class="overflow-hidden">
        <router-view></router-view>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped>
:deep(.v-chip) {
  font-size: 1rem;
  height: 44px !important;
}

:deep(.v-btn) {
  height: 44px;
  min-width: 110px;
}

:deep(.v-divider) {
  opacity: 0.3;
}
</style>
