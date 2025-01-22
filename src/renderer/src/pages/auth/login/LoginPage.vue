<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import SelectEmployee from './components/SelectEmployee.vue'

const store = useStore()
const selected = ref(null)
const router = useRouter()

const handleSubmit = () => {
  store.dispatch('auth/login', selected.value)
  router.push({ path: '/auth/hygenie' })
}
</script>

<template>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="mx-auto" elevation="8">
          <!-- Header -->
          <v-sheet class="pa-8" color="primary" rounded="0">
            <div class="d-flex align-center mb-6">
              <v-avatar color="white" size="52" class="mr-4">
                <v-icon icon="mdi-account" size="32" color="primary"></v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold text-white mb-1">Personel Girişi</h1>
                <div class="text-white text-opacity-70">Lütfen personel seçimi yapınız</div>
              </div>
            </div>
          </v-sheet>

          <!-- Content -->
          <v-card-text class="pa-8">
            <select-employee
              :selected="selected"
              class="employee-select"
              @change="(val) => (selected = val)"
            />
          </v-card-text>

          <!-- Actions -->
          <v-card-actions class="pa-8 pt-0">
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!selected"
              size="x-large"
              min-width="180"
              color="primary"
              class="text-none font-weight-bold"
              elevation="2"
              @click="handleSubmit"
            >
              <v-icon icon="mdi-login" class="mr-2" size="24"></v-icon>
              Giriş Yap
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
:deep(.employee-select) {
  .v-field__input {
    min-height: 56px;
    font-size: 1.1rem;
    padding: 12px;
  }

  .v-list-item {
    min-height: 56px;
    padding: 12px 16px;
  }

  .v-list-item__content {
    font-size: 1.1rem;
  }
}

:deep(.v-btn) {
  letter-spacing: 0.5px;
  font-size: 1.1rem;
}

:deep(.v-card) {
  border-radius: 16px;
  overflow: hidden;
}

@media (max-width: 600px) {
  :deep(.v-card) {
    margin: 0;
    height: 100vh;
    border-radius: 0;
  }
}
</style>
