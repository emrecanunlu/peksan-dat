<script setup>
import { ModalProvider } from 'vue-modal-provider'
</script>

<template>
  <modal-provider>
    <router-view></router-view>
  </modal-provider>
</template>
