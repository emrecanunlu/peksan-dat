<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

const store = useStore()

const serialNumber = computed(() => store.state.production.serialNumber)

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})
defineEmits(['update:modelValue'])

const inputRef = ref(null)

const onSubmit = () => {
  inputRef.value.reset()
}
</script>

<template>
  <v-dialog
    max-width="65%"
    persistent
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>Etiket Doğrulama - ({{ serialNumber }})</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12">
            <h5 class="text-h6">Etiket Doğrulama</h5>
            <p class="text-body-1 text-grey-darken-2">
              Etiket doğrulama için, etiketin üzerindeki barkodu tarayın.
            </p>
          </v-col>
          <v-col cols="12" class="mt-6 mb-2">
            <form @submit.prevent="onSubmit">
              <v-text-field
                ref="inputRef"
                label="Barkod"
                variant="outlined"
                prepend-inner-icon="mdi-barcode"
                autofocus
                @keydown="onKeyDown"
              />
            </form>
          </v-col>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn color="primary" class="ml-auto" prepend-icon="mdi-printer" size="large"
              >Yeniden Yazdır</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
