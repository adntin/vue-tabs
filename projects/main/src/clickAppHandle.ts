import type { Router } from 'vue-router';
import { message } from 'ant-design-vue';
// import type { MessageType } from 'ant-design-vue/es/message';
// import Http from '@/network';
import useAppCacheStore from '@/stores/useAppTabStore';
import useAccessToken from '@/hooks/useAccessToken';
import useRefreshToken from '@/hooks/useRefreshToken';
// import ApplicationBelong from '@/constants/ApplicationBelong';
// import ApplicationType from '@/constants/ApplicationType';
import ApplicationTarget from '@/constants/ApplicationTarget';
import routerPushByAppCache from '@/utils/routerPushByAppCache';
import type { Application } from '@/types/Application';

// const getThirdAppPath = async (app: Application) => {
//   let hide: MessageType | undefined;
//   const timer = setTimeout(() => {
//     hide = message.loading('正在获取链接，请稍等...', 0);
//   }, 200);
//   try {
//     const response = await Http.getInstance().get(
//       `/api/auth/applicationPaths/get/final/path?applicationId=${app.id}&clientType=1`,
//     );
//     return response.finalPath; // 第三方应用, 应用路径参数有时效性
//   } catch (e: any) {
//     console.error('getThirdAppPath', app.name, e);
//     return app.path;
//   } finally {
//     clearTimeout(timer);
//     hide?.();
//   }
// };

// const recentlyUsedApp = async (app: Application) => {
//   try {
//     if (app.belong === ApplicationBelong.system) {
//       return; // 系统应用不上报
//     }
//     const appCacheStore = useAppCacheStore();
//     const cache = appCacheStore.getCache(app.id);
//     if (cache?.timestamp && Date.now() - cache?.timestamp < 60000) {
//       return; // 一分钟节流
//     }
//     await Http.getInstance().post('api/auth/v1/userRecentApp', { appCode: app.code });
//   } catch (error: any) {
//     console.error('recentlyUsedApp', error);
//   }
// };

// 此方法需要在`最近使用`小组件使用
const clickAppHandle = async (app: Application, router: Router) => {
  // 1. 路径校验
  if (!app.path) {
    message.error('未配置应用地址');
    return;
  }
  // 2. 旧应用路径处理 "/sas/safety-board?fullPath=/safety-board" --> "/safety-board?fullPath=/safety-board"
  let appPath = app.path;
  // 3. 本地化全屏应用路由路径 (校园安全智脑)
  const url = new URL(appPath, location.origin);
  if (url.searchParams.get('fullPath')) {
    // "/safety-board?fullPath=/safety-board" --> "/safety-board"
    const appRoutePath = appPath.split('?')[0]; // 应用路由路径
    const KEY = 'fullScreen';
    const localData = localStorage.getItem(KEY);
    if (!localData?.includes(appRoutePath)) {
      const appRoutePaths = localData ? JSON.parse(localData) : [];
      appRoutePaths.push(appRoutePath);
      localStorage.setItem(KEY, JSON.stringify(appRoutePaths));
    }
  }
  // 4. 最近使用应用
  // recentlyUsedApp(app);
  // 6. 第三方应用 (视力健康)
  // if (app.type === ApplicationType.third) {
  // appPath = await getThirdAppPath(app);
  // }
  // 7. 路径参数处理 (教育云盘)
  if (appPath.includes('${AUTH_TOKEN}')) {
    const accessToken = useAccessToken();
    appPath = appPath.replace('${AUTH_TOKEN}', accessToken.value!);
  }
  if (appPath.includes('${REFRESH_TOKEN}')) {
    const refreshToken = useRefreshToken();
    appPath = appPath.replace('${REFRESH_TOKEN}', refreshToken.value!);
  }
  // 8. 浏览器新标签 (校园安全智脑)
  if (app.target === ApplicationTarget.blank || appPath.startsWith('http')) {
    window.open(appPath);
    return;
  }
  // 9. 应用标签页 (路由地址)
  const appCacheStore = useAppCacheStore(); // Tab 标签页缓存
  const cache = appCacheStore.getCache(app.id);
  if (cache) {
    routerPushByAppCache(router, cache); // 更换路由, 标签页缓存是动态路径
  } else {
    router.push(appPath); // 更换路由, 导航栏菜单是固定路径
  }
};

export default clickAppHandle;
