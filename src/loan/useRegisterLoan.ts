import { ref } from 'vue'
import {
  registerLoan as sendLoan,
  type RegisterLoanPayload,
} from './loanService'

export function useRegisterLoan() {
  const loading = ref(false)
  const error = ref('')
  const success = ref(false)

  async function submitLoan(payload: RegisterLoanPayload): Promise<boolean> {
    loading.value = true
    error.value = ''
    success.value = false

    try {
      await sendLoan(payload)
      success.value = true
      return true
    } catch (cause) {
      error.value =
        cause instanceof Error
          ? cause.message
          : 'Ocurrió un error al registrar el préstamo.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    submitLoan,
  }
}
