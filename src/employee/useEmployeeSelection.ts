import { ref } from 'vue'

const selectedEmployeeId = ref<number | null>(null)

export function useEmployeeSelection() {
  return {
    selectedEmployeeId,
  }
}

export function setSelectedEmployeeId(employeeId: number) {
  selectedEmployeeId.value = employeeId
}

export function clearSelectedEmployeeId() {
  selectedEmployeeId.value = null
}
