<template>
  <v-alert :type="type" :title="getAlertTitle" :text="message" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    requried: true
  },
  message: {
    type: String,
    requried: true
  }
})

const getAlertTitle = computed(() => {
  switch (props.type) {
    case 'error':
      return 'Hata'
    case 'success':
      return 'Başarılı'
  }
})
</script>

<style lang="css">
.Toastify__toast-body {
  padding: 0 !important;
}

.Toastify__toast {
  padding: 0 !important;
}
</style>
