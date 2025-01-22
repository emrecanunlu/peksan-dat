<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import hygieneService from '@/utils/services/hygiene'
import SnackbarHelper from '@/utils/helpers/SnackbarHelper'

const store = useStore()
const router = useRouter()

const isLoading = ref(false)
const questions = ref([])
const employee = ref(store.getters['auth/_employee'])

// Çalışan bilgisi kontrolü
if (!employee.value) {
  console.error('Çalışan bilgisi bulunamadı')
  router.push('/auth/login')
  SnackbarHelper.showError('Oturum bilgisi bulunamadı, lütfen tekrar giriş yapın')
}

const state = reactive({
  current: 0,
  answers: []
})

const getQuestions = async () => {
  try {
    isLoading.value = true
    const result = await hygieneService.getQuestions()
    questions.value = result.data
  } catch (error) {
    console.error('Sorular yüklenirken hata:', error)
    SnackbarHelper.showError('Sorular yüklenirken hata oluştu')
  } finally {
    isLoading.value = false
  }
}

const nextQuestion = async (isClear) => {
  try {
    // Çalışan kontrolü
    if (!employee.value?.staffId) {
      SnackbarHelper.showError('Oturum bilgisi bulunamadı, lütfen tekrar giriş yapın')
      router.push('/auth/login')
      return
    }

    if (!questions.value || !questions.value[state.current]) {
      console.error('Soru bulunamadı')
      return
    }

    const answer = {
      staffId: parseInt(employee.value.staffId),
      machineId: 64,
      isClear: isClear ? 1 : 0,
      questionId: parseInt(questions.value[state.current].id)
    }

    state.answers.push(answer)

    if (state.current === questions.value.length - 1) {
      isLoading.value = true
      await hygieneService.sendAnswers(state.answers)
      router.push({ path: '/' })
    } else {
      state.current++
    }
  } catch (error) {
    console.error('Hata oluştu:', error)
    SnackbarHelper.showError('İşlem sırasında bir hata oluştu')
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(() => {
  // Çalışan kontrolü
  if (!employee.value?.staffId) {
    router.push('/auth/login')
    return
  }
  getQuestions()
})
</script>

<template>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="mx-auto" elevation="8" :loading="isLoading" :disabled="isLoading">
          <!-- Header -->
          <v-sheet class="pa-8" color="primary" rounded="0">
            <div class="d-flex align-center">
              <v-avatar color="white" size="52" class="mr-4">
                <span class="text-primary text-h5 font-weight-bold">
                  {{ state.current + 1 }}
                </span>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold text-white mb-1">Hijyen Kontrolü</h1>
                <div class="text-white text-opacity-70">
                  Soru {{ state.current + 1 }}/{{ questions.length }}
                </div>
              </div>
            </div>
          </v-sheet>

          <!-- Question Content -->
          <v-card-text class="pa-8">
            <div class="text-h5 font-weight-medium">
              {{ questions[state.current]?.title }}
            </div>
          </v-card-text>

          <!-- Actions -->
          <v-card-actions class="pa-8 pt-0">
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              size="x-large"
              min-width="150"
              class="text-none font-weight-bold mr-4"
              elevation="2"
              @click="() => nextQuestion(true)"
            >
              <v-icon icon="mdi-check" class="mr-2" size="24"></v-icon>
              Evet
            </v-btn>
            <v-btn
              color="error"
              size="x-large"
              min-width="150"
              class="text-none font-weight-bold"
              elevation="2"
              @click="() => nextQuestion(false)"
            >
              <v-icon icon="mdi-close" class="mr-2" size="24"></v-icon>
              Hayır
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
:deep(.v-card) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.v-btn) {
  letter-spacing: 0.5px;
  font-size: 1.1rem;
}

@media (max-width: 600px) {
  :deep(.v-card) {
    margin: 0;
    height: 100vh;
    border-radius: 0;
  }
}
</style>
