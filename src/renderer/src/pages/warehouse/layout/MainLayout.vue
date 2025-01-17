<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import useClock from '@/hooks/useClock'
import { computed, onBeforeUnmount } from 'vue'

const store = useStore()
const router = useRouter()

const employee = store.getters['auth/_employee']
const { currentTime, shift, clear } = useClock()

const production = computed(() => store.state["production"])

console.log(production)

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
      <v-app-bar color="indigo">

        <div class="d-flex">
          <v-chip size="large" variant="elevated" color="blue" class="me-2">
            Üretilecek: {{ production.toBeProduced }}
          </v-chip>

          <v-chip size="large" variant="elevated" color="green" class="me-2">
            Üretilen: {{ production.produced }}
          </v-chip>

          <v-chip size="large" variant="elevated" color="red">
            Kalan: {{ production.remaining }}
          </v-chip>
        </div>

        <template #prepend>
          <h1 class="text-h6 pl-3">
            {{
              `${shift}. Vardiya | ${employee.staffId} - ${employee.firstName} ${employee.lastName}`
            }}
          </h1>
        </template>
        <template #append>
          <h1 class="text-h6 pr-2">{{ currentTime }}</h1>
          <v-btn icon="mdi-logout" @click="signOut"></v-btn>
        </template>
      </v-app-bar>
      <v-main class="overflow-hidden">
        <router-view></router-view>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style></style>
