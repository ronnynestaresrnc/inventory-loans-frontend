import { computed, ref } from 'vue'
import { getEmployees } from './employeeService'
import {
  clearSelectedEmployeeId,
  setSelectedEmployeeId,
} from './useEmployeeSelection'
import type { Employee } from '../types/Employee'

export function useSearchEmployee() {
  const employees = ref<Employee[]>([])
  const search = ref('')
  const selectedEmployee = ref<Employee | null>(null)

  const loading = ref(false)
  const error = ref('')

  const filteredEmployees = computed(() => {
    const query = search.value.trim().toLowerCase()

    if (!query || selectedEmployee.value) {
      return []
    }

    return employees.value
      .filter((employee) =>
        `${employee.name} ${employee.dni}`
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 8)
  })

  async function loadEmployees() {
    loading.value = true
    error.value = ''

    try {
      employees.value = await getEmployees()
    } catch {
      error.value = 'No se pudo cargar la lista de empleados.'
    } finally {
      loading.value = false
    }
  }

  function selectEmployee(employee: Employee) {
    selectedEmployee.value = employee
    search.value = employee.name
    setSelectedEmployeeId(employee.employeeID)
  }

  function clearSearch() {
    search.value = ''
    selectedEmployee.value = null
    clearSelectedEmployeeId()
  }

  return {
    search,
    selectedEmployee,
    filteredEmployees,
    loading,
    error,
    loadEmployees,
    selectEmployee,
    clearSearch,
  }
}