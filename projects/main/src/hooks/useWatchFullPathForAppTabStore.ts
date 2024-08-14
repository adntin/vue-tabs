import { computed, h, unref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MehOutlined } from '@ant-design/icons-vue';
import useAppTabStore, { type IApplicationExtra } from '@/stores/useAppTabStore';
import useApplicationStore from '@/stores/useApplicationStore';
import useLoadMicroApp from '@/hooks/useLoadMicroApp';
import useAccessToken from '@/hooks/useAccessToken';
import useRefreshToken from '@/hooks/useRefreshToken';
import getAsyncComponent from '@/utils/getAsyncComponent';
import getAppComponentFromRoutes from '@/utils/getAppComponentFromRoutes';
import getAppByFullPath from '@/utils/getAppByFullPath';
import ApplicationType from '@/constants/ApplicationType';

const NotAccessLoader = () => import('@/components/Page403.vue');
const NotFoundLoader = () => import('@/components/Page404.vue');
// const LowcodeAppLoader = () => import('@/views/Lowcode/LowcodeAppView.vue');
/** 加载路由应用, `独立文档`页面不需要路由配置, 因为在`useWatchFullPathForAppTabStore.ts`维护组件路径 */
const singleAppCodeLoader = {
  Workbench: () => import('@/views/Workbench.vue'),
  ApplicationCenter: () => import('@/views/ApplicationCenter.vue'),
};

const ACCOUNT_SETTINGS = 'AccountSettings'; // 特殊应用(非应用中心的应用, 帐号设置)

const useWatchFullPathForAppTabStore = () => {
  const route = useRoute();
  const router = useRouter();

  const appTabStore = useAppTabStore();
  const appTabStoreApps = computed(() => unref(appTabStore.apps));

  const applicationStore = useApplicationStore();
  const applicationStoreData = computed(() => unref(applicationStore.data));

  const loadMicroAppByQiankun = useLoadMicroApp();

  // 需要增加应用列表监听, 首次登录时, 路由先跳转, 应用数据从无到有
  watch(
    [() => route.fullPath, applicationStoreData],
    ([fullPath, apps]) => {
      const path = route.path;
      // 1. 根路径, 不处理
      if (path === '/' || !apps) {
        return;
      }

      // 2.1 缓存 - 找查应用 (可以减少复杂度)
      const index = appTabStoreApps.value.findIndex((app) => {
        return fullPath.startsWith(app.path.split('?')[0]); // "/safety-board?fullPath=/safety-board" --> "/safety-board/home"
      });
      // 2.2 缓存 - 更新全路径
      if (index > -1) {
        appTabStore.updateFullPath(appTabStoreApps.value[index].id, fullPath);
        return;
      }

      // 3. 特殊应用
      if (fullPath.startsWith(`/${ACCOUNT_SETTINGS}`)) {
        const code = ACCOUNT_SETTINGS;
        const loader = getAppComponentFromRoutes(router, fullPath);
        const component = getAsyncComponent(loader || NotFoundLoader);
        const icon = h('i', { class: 'icon-ym icon-ym-header-userInfo' });
        const AccountSettingsApp = { id: code, name: '帐号设置', code, icon, path } as IApplicationExtra;
        appTabStore.add(AccountSettingsApp, component, 'MOUNTED', false);
        return;
      }

      // 4.1 查找应用
      const app = getAppByFullPath(apps, fullPath);
      // 4.2 未找到应用
      if (!app) {
        const code = path;
        const component = getAsyncComponent(NotAccessLoader);
        const icon = h(MehOutlined);
        const NotAccessApp = { id: code, name: '无权限', code, icon, path } as IApplicationExtra;
        appTabStore.add(NotAccessApp, component, 'MOUNTED', true);
        return;
      }
      // 4.3 已找到应用
      console.log('加载应用', app.name, path);

      // 0. 加载`独立文档`应用
      if (app.code === 'ApplicationCenter' || app.code === 'Workbench') {
        const component = h(getAsyncComponent(singleAppCodeLoader[app.code]));
        appTabStore.add(app, component, 'MOUNTED', true);
        appTabStore.updateFullPath(app.id, route.fullPath);
        return;
      }
      // 1. 加载`路由`应用
      if (app.type === ApplicationType.Route) {
        const loader = getAppComponentFromRoutes(router, fullPath);
        const component = getAsyncComponent(loader || NotFoundLoader);
        appTabStore.add(app, component, 'MOUNTED', false);
        appTabStore.updateFullPath(app.id, route.fullPath); // 刷新时, 浏览器路由地址 !== 应用路由路径
        return;
      }
      // 2. 加载`框架`应用
      if (app.type === ApplicationType.Iframe) {
        const style = 'display:block; width:100%; height:100%; border:0; background:transparent;';
        let src = app.path.split('/iframe?')[1];
        if (src.includes('${AUTH_TOKEN}')) {
          const accessToken = useAccessToken();
          src = src.replace('${AUTH_TOKEN}', accessToken.value!);
        }
        if (src.includes('${REFRESH_TOKEN}')) {
          const refreshToken = useRefreshToken();
          src = src.replace('${REFRESH_TOKEN}', refreshToken.value!);
        }
        const component = h('iframe', { id: app.code, style, src });
        appTabStore.add(app, component, 'MOUNTED', true);
        return;
      }
      // 3. 加载`乾坤`微应用
      if (app.type === ApplicationType.Qiankun) {
        const component = h('div', { id: app.code, class: 'micro-app-view' });
        appTabStore.add(app, component, 'MOUNTING', true);
        appTabStore.updateFullPath(app.id, fullPath); // 刷新时, 浏览器路由地址 !== 应用路由路径
        let entry = app.path.replace('micro-', '').split('?')[0];
        if (!entry.endsWith('/')) {
          entry = entry + '/';
        }
        loadMicroAppByQiankun(app, entry);
        return;
      }
      // 加载`低码应用`应用
      // if (app.path.startsWith('/LowcodeApps')) {
      //   const component = h(getAsyncComponent(LowcodeAppLoader), { appCode: app.code }); // 原始应用编码
      //   appTabStore.add(app, component, 'MOUNTED', true);
      //   appTabStore.updateFullPath(app.id, route.fullPath); // 刷新时, 浏览器路由地址 !== 应用路由路径
      //   return;
      // }
    },
    { immediate: true },
  );
};

export default useWatchFullPathForAppTabStore;
