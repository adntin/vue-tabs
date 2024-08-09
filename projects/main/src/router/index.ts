import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: 'Workbench',
          component: () => import('@/views/Workbench.vue'),
        },
        {
          path: 'ApplicationCenter',
          component: () => import('@/views/ApplicationCenter.vue'),
        },
        {
          path: 'DataCenter',
          component: () => import('@/views/DataCenter.vue'),
        },
        {
          path: 'OrganizationCenter',
          component: () => import('@/views/OrganizationCenter.vue'),
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
});

export default router;
