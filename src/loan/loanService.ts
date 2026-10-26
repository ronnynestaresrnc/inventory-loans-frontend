export interface LoanMaterial {
  materialId: number
  quantity: number
}

export interface RegisterLoanPayload {
  employeeId: number
  destination: string
  unitIds: number[]
  materials: LoanMaterial[]
}

const API_URL = import.meta.env.VITE_API_URL

export async function registerLoan(payload: RegisterLoanPayload): Promise<void> {
  if (!API_URL) {
    throw new Error('La variable VITE_API_URL no está configurada.')
  }

console.log('API_URL:', payload.employeeId);

  const response = await fetch(`${API_URL}/loans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(
      `No se pudo registrar el préstamo. Código HTTP ${response.status}.`,
    )
  }
}
