<script setup lang="ts">
import { onMounted } from 'vue'
import { useSearchEmployee } from '../useSearchEmployee'
import { clearSelectedEmployeeId } from '../useEmployeeSelection'
import type { Employee } from '../../types/Employee'

const {
  search,
  selectedEmployee,
  filteredEmployees,
  loading,
  error,
  loadEmployees,
  selectEmployee,
  clearSearch,
} = useSearchEmployee()

const emit = defineEmits<{
  'employee-selected': [employeeId: number | null]
}>()

onMounted(() => {
  void loadEmployees()
})

function chooseEmployee(employee: Employee) {
  selectEmployee(employee)
  emit('employee-selected', employee.employeeID) // Emit the employeeID instead of id
}

function clearSelection() {
  selectedEmployee.value = null
  clearSelectedEmployeeId()
  emit('employee-selected', null)
}

function resetSearch() {
  clearSearch()
  emit('employee-selected', null)
}

defineExpose({ clearSearch: resetSearch })
</script>

<template>
  <div class="relative w-full">
    <label for="employee" class="mb-2 block text-sm font-medium text-slate-700">
      Empleado
    </label>

    <input
      id="employee"
      v-model="search"
      type="text"
      placeholder="Buscar por nombre o código"
      autocomplete="off"
      class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      @input="clearSelection"
    />

    <p v-if="loading" class="mt-2 text-sm text-slate-500">
      Cargando empleados...
    </p>

    <p v-else-if="error" role="alert" class="mt-2 text-sm text-rose-600">
      {{ error }}
    </p>

    <ul
      v-else-if="filteredEmployees.length"
      class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
    >
      <li
        v-for="employee in filteredEmployees"
        :key="employee.employeeID"
      >
        <button
          type="button"
          class="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-indigo-50"
          @click="chooseEmployee(employee)"
        >
          {{ employee.name }} {{ employee.lastName }}
        </button>
      </li>
    </ul>

    <p
      v-else-if="search.trim() && !selectedEmployee && !loading && !error"
      class="mt-2 text-sm text-slate-500"
    >
      No se encontraron empleados.
    </p>

    <div
      v-if="selectedEmployee"
      class="mt-2 flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
    >
      <span>Seleccionado: {{ selectedEmployee.name }}</span>
      <button
        type="button"
        class="font-medium underline underline-offset-2 hover:text-emerald-950"
        @click="resetSearch"
      >
        Cambiar
      </button>
    </div>
  </div>
</template>