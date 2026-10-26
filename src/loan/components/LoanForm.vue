<script setup lang="ts">
import { ref } from 'vue'
import SearchEmployee from '../../employee/components/SearchEmployee.vue'
import { useRegisterLoan } from '../useRegisterLoan'

const employeeSearch = ref<InstanceType<typeof SearchEmployee> | null>(null)
const employeeId = ref<number | null>(null)
const destination = ref('')
const unitIds = ref<string[]>([''])
const materials = ref([{ materialId: '', quantity: '' }])
const validationError = ref('')

const { loading, error, success, submitLoan } = useRegisterLoan()

function addUnit() {
  unitIds.value.push('')
}

function removeUnit(index: number) {
  unitIds.value.splice(index, 1)
}

function addMaterial() {
  materials.value.push({ materialId: '', quantity: '' })
}

function removeMaterial(index: number) {
  materials.value.splice(index, 1)
}

function parsePositiveInteger(value: string): number | null {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

async function handleSubmit() {
  validationError.value = ''
  if (employeeId.value === null) {
    validationError.value = 'Selecciona un empleado.'
    return
  }

  const normalizedDestination = destination.value.trim()
  if (!normalizedDestination) {
    validationError.value = 'Ingresa el destino del préstamo.'
    return
  }

  const parsedUnitIds = unitIds.value.map(parsePositiveInteger)
  if (parsedUnitIds.some((id) => id === null)) {
    validationError.value = 'Ingresa un ID válido para cada unidad.'
    return
  }
  const validUnitIds = parsedUnitIds.filter(
    (id): id is number => id !== null,
  )

  const parsedMaterials = materials.value.map((material) => ({
    materialId: parsePositiveInteger(material.materialId),
    quantity: parsePositiveInteger(material.quantity),
  }))
  if (
    parsedMaterials.some(
      (material) => material.materialId === null || material.quantity === null,
    )
  ) {
    validationError.value =
      'Ingresa un ID y una cantidad válida para cada material.'
    return
  }
  const validMaterials = parsedMaterials.filter(
    (
      material,
    ): material is { materialId: number; quantity: number } =>
      material.materialId !== null && material.quantity !== null,
  )

  const registered = await submitLoan({
    employeeId: employeeId.value,
    destination: normalizedDestination,
    unitIds: validUnitIds,
    materials: validMaterials,
  })

  if (registered) {
    destination.value = ''
    unitIds.value = ['']
    materials.value = [{ materialId: '', quantity: '' }]
    employeeSearch.value?.clearSearch()
  }
}
</script>

<template>
  <main class="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-6">
    <section
      class="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/70 sm:p-8"
    >
      <header class="mb-8">
        <p class="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Inventario
        </p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Registrar préstamo
        </h1>
        <p class="mt-2 text-sm text-slate-500">
          Completa los datos del empleado, destino, herramientas y materiales.
        </p>
      </header>

      <form class="space-y-7" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <SearchEmployee
            ref="employeeSearch"
            @employee-selected="employeeId = $event"
          />
        </div>
       
<h2>dd {{ employeeId }} </h2>
        <div class="space-y-2">
          <label for="destination" class="block text-sm font-medium text-slate-700">
            Destino
          </label>
          <input
            id="destination"
            v-model="destination"
            type="text"
            required
            maxlength="120"
            placeholder="Ej. Taller"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <section class="space-y-3" aria-labelledby="tools-heading">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 id="tools-heading" class="text-base font-semibold text-slate-800">
                Herramientas
              </h2>
              <p class="text-sm text-slate-500">
                Agrega el ID de cada herramienta.
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50"
              @click="addUnit"
            >
              Agregar herramienta
            </button>
          </div>

          <div
            v-for="index in unitIds.length"
            :key="index"
            class="flex items-end gap-3"
          >
            <div class="flex-1 space-y-2">
              <label
                :for="`tool-${index - 1}`"
                class="block text-sm font-medium text-slate-700"
              >
                ID de herramienta
              </label>
              <input
                :id="`tool-${index - 1}`"
                v-model="unitIds[index - 1]"
                type="number"
                min="1"
                step="1"
                required
                placeholder="Ej. 1"
                class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <button
              v-if="unitIds.length > 1"
              type="button"
              :aria-label="`Quitar herramienta ${index}`"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
              @click="removeUnit(index - 1)"
            >
              Quitar
            </button>
          </div>
        </section>

        <section class="space-y-3" aria-labelledby="materials-heading">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2
                id="materials-heading"
                class="text-base font-semibold text-slate-800"
              >
                Materiales
              </h2>
              <p class="text-sm text-slate-500">
                Indica el ID y la cantidad de cada material.
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50"
              @click="addMaterial"
            >
              Agregar material
            </button>
          </div>

          <div
            v-for="(material, index) in materials"
            :key="index"
            class="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <div class="space-y-2">
              <label
                :for="`material-${index}`"
                class="block text-sm font-medium text-slate-700"
              >
                ID de material
              </label>
              <input
                :id="`material-${index}`"
                v-model="material.materialId"
                type="number"
                min="1"
                step="1"
                required
                placeholder="Ej. 1"
                class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div class="space-y-2">
              <label
                :for="`quantity-${index}`"
                class="block text-sm font-medium text-slate-700"
              >
                Cantidad
              </label>
              <input
                :id="`quantity-${index}`"
                v-model="material.quantity"
                type="number"
                min="1"
                step="1"
                required
                placeholder="Ej. 2"
                class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <button
              v-if="materials.length > 1"
              type="button"
              :aria-label="`Quitar material ${index + 1}`"
              class="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 sm:text-center"
              @click="removeMaterial(index)"
            >
              Quitar
            </button>
          </div>
        </section>

        <p
          v-if="validationError"
          role="alert"
          class="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          {{ validationError }}
        </p>
        <p
          v-if="error"
          role="alert"
          class="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ error }}
        </p>
        <p
          v-if="success"
          role="status"
          class="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          Préstamo registrado correctamente.
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ loading ? 'Registrando...' : 'Registrar préstamo' }}
        </button>
      </form>
    </section>
  </main>
</template>
