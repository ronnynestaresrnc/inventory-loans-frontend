import type { Employee } from '../types/Employee'

const API_URL = import.meta.env.VITE_API_URL

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(`${API_URL}/employees`)

  if (!response.ok) {
    throw new Error('No se pudo cargar la lista de empleados')
  }

  return (await response.json()) as Employee[]
}