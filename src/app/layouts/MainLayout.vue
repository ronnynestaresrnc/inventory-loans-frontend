
<script setup>
import { RouterLink, RouterView } from 'vue-router'

const menuItems = [
  { label: 'Dashboard', to: '/dashboard', icon: '▦' },
  { label: 'Préstamos', to: '/loans', icon: '▤' },
  { label: 'Devoluciones', to: '/returns', icon: '↶' },
  { label: 'Herramientas', to: '/tools', icon: '🔧' },
  { label: 'Materiales', to: '/materials', icon: '⬡' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-100 md:flex">
    <aside class="w-full bg-slate-800 p-4 text-white md:min-h-screen md:w-56 md:shrink-0">
      <h1 class="mb-8 text-xl font-bold">Refriaire</h1>

      <p class="mb-3 text-xs uppercase tracking-wider text-slate-400">
        Menú principal
      </p>

      <nav class="space-y-2">
        <RouterLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-200 transition hover:bg-slate-700"
          active-class="bg-slate-700 font-semibold text-white"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="min-w-0 flex-1 p-4 md:p-6">
      <RouterView />
    </main>
  </div>
</template>
