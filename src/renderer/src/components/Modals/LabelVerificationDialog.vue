<script setup>
import { useStore } from 'vuex'
import { computed, ref, onUnmounted } from 'vue'
import SnackbarHelper from '@/utils/helpers/SnackbarHelper'
import labelService from '@/utils/services/label'

const store = useStore()

const datNo = computed(() => store.state.production.datNo)

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  isColor: {
    type: Boolean,
    required: true
  }
})
defineEmits(['update:modelValue'])

const timer = ref(0)
const interval = ref(null)
const lastKeyPressed = ref(new Date())
const input = ref('')
const loading = ref(false)

const startTimer = () => {
  if (interval.value) {
    clearInterval(interval.value)
  }

  timer.value = 10
  interval.value = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      clearInterval(interval.value)
    }
  }, 1000)
}

const handleKeydown = (event) => {
  const current = new Date()
  const value = input.value
  const timeDiff = current.getTime() - lastKeyPressed.value.getTime()

  lastKeyPressed.value = current

  if (event.key === 'Enter') {
    input.value = ''

    if (timeDiff > 50) {
      SnackbarHelper.showError('Lütfen tekrar deneyiniz!')
      return
    }

    loading.value = true
    labelService
      .verifyLabel(value)
      .then(() => {
        store.dispatch('production/closeLabelVerification')
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const handlePrint = () => {
  startTimer()

  loading.value = true
  labelService
    .getLabel(datNo.value)
    .then((res) => {
      const { data: label } = res.data

      window.electron.ipcRenderer.send('print-label', label)
    })
    .finally(() => {
      loading.value = false
    })
}

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value)
  }
})
</script>

<template>
  <v-dialog
    max-width="80%"
    persistent
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-toolbar color="primary">
      <v-toolbar-title>Etiket Doğrulama - ({{ datNo }})</v-toolbar-title>
    </v-toolbar>
    <v-card :loading="loading" :disabled="loading">
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="d-flex align-center">
              <v-avatar size="48" color="primary">
                <v-icon>mdi-barcode-scan</v-icon>
              </v-avatar>

              <div class="ms-4">
                <h5 class="text-h6">Etiket Doğrulama</h5>
                <p class="text-body-1 text-grey-darken-2">
                  Etiket doğrulama için, etiketin üzerindeki barkodu tarayın.
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" class="mt-8 mb-2">
            <v-text-field
              v-model="input"
              label="Dat No"
              placeholder="Dat No Giriniz"
              variant="outlined"
              prepend-inner-icon="mdi-barcode"
              autofocus
              @keydown="handleKeydown"
            />
          </v-col>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              color="primary"
              class="ml-auto"
              size="large"
              :disabled="timer > 0"
              prepend-icon="mdi-printer"
              @click.stop="handlePrint"
            >
              Yeniden Yazdır {{ timer > 0 ? `(${timer} saniye)` : '' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
