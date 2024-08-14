import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:any(.*)*',
      name: 'Home',
      component: HomeView,
      children: [
        /** 加载路由应用, `独立文档`页面不需要路由配置, 因为在`useWatchFullPathForAppTabStore.ts`维护组件路径 */
        // {
        //   path: 'Workbench',
        //   component: () => import('@/views/Workbench.vue'),
        // },
        // {
        //   path: 'ApplicationCenter',
        //   component: () => import('@/views/ApplicationCenter.vue'),
        // },
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
      name: 'About',
      component: () => import('../views/AboutView.vue'),
    },
  ],
});

export default router;
