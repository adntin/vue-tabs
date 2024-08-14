import type { AsyncComponentLoader } from 'vue';
import type { Router } from 'vue-router';

// 根据浏览器地址, 从路由表中查找应用组件
const getAppComponentFromRoutes = (router: Router, fullPath: string): AsyncComponentLoader | null => {
  const Home = router.getRoutes().find((r) => r.name === 'Home');
  const child = Home?.children.find((h) => {
    let routePath = h.path;
    routePath = routePath.startsWith('/') ? routePath : `/${routePath}`;
    return fullPath.startsWith(routePath);
  });
  if (child?.component) {
    return child.component as AsyncComponentLoader;
  }
  if (child?.components) {
    return Object.values(child.components)[0] as AsyncComponentLoader;
  }
  console.error('getAppComponentFromRoutes 路由表未找到应用', fullPath);
  return null;
};

export default getAppComponentFromRoutes;
