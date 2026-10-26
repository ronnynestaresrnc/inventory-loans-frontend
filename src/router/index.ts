
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../app/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () =>
            import('../dashboard/pages/DashboardView.vue'),
        },
        {
          path: 'loans',
          name: 'loans',
          component: () =>
            import('../loan/components/LoanForm.vue'),
        },
      ],
    },
  ],
})

export default router
