<script setup>
import { useStore } from 'vuex'
import { computed, ref, onUnmounted } from 'vue'
import SnackbarHelper from '@/utils/helpers/SnackbarHelper'
const store = useStore()

const serialNumber = computed(() => store.state.production.serialNumber)

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})
defineEmits(['update:modelValue'])

const timer = ref(0)
const interval = ref(null)
const lastKeyPressed = ref(new Date())
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
  const timeDiff = current.getTime() - lastKeyPressed.value.getTime()

  lastKeyPressed.value = current

  if (event.key === 'Enter') {
    console.log('ENTER', timeDiff)

    if (timeDiff > 50) {
      SnackbarHelper.showError('Lütfen tekrar deneyiniz!')
      return
    }
  }
}

const handlePrint = () => {
  startTimer()
}

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value)
  }
})
</script>

<template>
  <v-dialog
    max-width="75%"
    persistent
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-toolbar color="primary">
      <v-toolbar-title>Etiket Doğrulama - ({{ serialNumber }})</v-toolbar-title>
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
              label="Seri Numarası"
              placeholder="Seri Numarası Giriniz"
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
