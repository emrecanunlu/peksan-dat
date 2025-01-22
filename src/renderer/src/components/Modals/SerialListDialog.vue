<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import rawMaterialService from '@/utils/services/rawMaterial'
import AddSerialForm from '../Dat/AddSerialForm.vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  material: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['update:open'])

const selected = ref(null)
const serialList = ref([])
const loading = ref(false)
const search = ref('')

const debouncedSearch = ref(null)

const handleSearch = (value) => {
  if (debouncedSearch.value) {
    clearTimeout(debouncedSearch.value)
  }

  debouncedSearch.value = setTimeout(() => {
    loadSerialList(value)
  }, 1000)
}

const clearSearch = () => {
  search.value = ''
  loadSerialList()
}

console.log(props.material)

const isAdded = (id) => computed(() => props.material.series.find((e) => e.id === id))

const loadSerialList = async (searchTerm = '') => {
  loading.value = true
  const { rawCode } = props.material
  rawMaterialService
    .getSeries(rawCode, { page: 1, offset: 25, search: searchTerm })
    .then((response) => {
      serialList.value = response.data.data.map((element) => ({
        id: element.serialNo + ',' + element.color + ',' + element.lotNo,
        ...element
      }))
    })
    .finally(() => {
      loading.value = false
    })
}

const handleRowClick = (item) => {
  selected.value = item
}

onBeforeMount(() => {
  loadSerialList()
})
</script>

<template>
  <v-dialog :model-value="open" persistent @update:model-value="emit('update:open', $event)">
    <v-card class="overflow-y-hidden">
      <v-toolbar dark color="indigo">
        <v-toolbar-title>Seri Listesi</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon="mdi-close" @click="$emit('update:open', false)"></v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <template v-if="loading">
        <div class="d-flex justify-center align-center">
          <v-progress-circular
            indeterminate
            color="indigo"
            size="64"
            width="7"
            class="ma-16"
          ></v-progress-circular>
        </div>
      </template>

      <template v-else>
        <v-card-text>
          <add-serial-form
            v-if="selected"
            :material="$props.material"
            :serial="selected"
            @close="$emit('update:open', false)"
          ></add-serial-form>

          <v-divider v-if="selected" class="my-4"></v-divider>

          <v-text-field
            v-model="search"
            label="Ara..."
            variant="outlined"
            hide-details
            prepend-inner-icon="mdi-magnify"
            :append-inner-icon="search ? 'mdi-close' : ''"
            @update:model-value="handleSearch"
            @click:append-inner="clearSearch"
          ></v-text-field>

          <v-divider v-if="selected" class="my-4"></v-divider>
          <v-table hover fixed-header height="600">
            <thead>
              <tr>
                <th>Seri Numarası</th>
                <th>Renk</th>
                <th>Lot No</th>
                <th>Miktar</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in serialList"
                :key="index"
                :class="{
                  'bg-indigo': selected?.id === item.id,
                  'bg-green-darken-1': isAdded(item.id).value
                }"
                @click.stop="handleRowClick(item)"
              >
                <td>{{ item.serialNo }}</td>
                <td>{{ item?.color ?? '-' }}</td>
                <td>{{ item?.lotNo ?? '-' }}</td>
                <td>{{ item.amount }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </template>
    </v-card>
  </v-dialog>
</template>
