import { reactive, shallowRef, type Component, type VNode } from 'vue';
// import type { HistoryState } from 'vue-router';
import { defineStore } from 'pinia';
import { message } from 'ant-design-vue';
import type { MicroApp } from 'qiankun';
import type { Application } from '@/types/Application';

export interface IApplicationExtra extends Omit<Application, 'icon'> {
  icon: string | VNode; // "https://" | h(MehOutlined)
}

export interface IAppCacheValue {
  fullPath: string; // 应用最终路径(应用内部会跳转)
  status: 'MOUNTING' | 'MOUNTED'; // 应用加载状态
  alone: boolean; // `独立文档`应用, `LayoutContentApps.vue`渲染应用时, 是否在`RouterView`外层独立存在, 路由改变时, 保持DOM不卸载
  timestamp: number;
  microApp?: MicroApp;
  historyState?: string; // HistoryState; // window.history.pushState(state, unused, url), 旧基座 react-router
}

const MAX = 10;

// 为什么需要`useAppTabStore`数据状态管理?
// 因为跨组件打开应用, 来源: 导航栏菜单, 导航栏搜索, 应用中心, 消息中心, 标签页切换
// 为什么需要`fullPath`属性?
// 因为点击导航菜单打开A应用, A应用内部跳转后; 打开B应用; 再点击导航菜单打开A应用, 需要更新浏览器路由为A应用的最终路径.
// 为什么需要`historyState`属性?
// 因为旧基座应用是`react-router`实现路由管理.
// 为什么需要`keys`数据?
// 因为 1. ref(new Map()) 和 shallowRef(new Map()) 无法监听变化 2. `component`属性需要用`shallowRef`
// 为什么使用`shallowRef`?
// [Vue warn]: Vue received a Component which was made a reactive object.
// This can lead to unnecessary performance overhead,
// and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.
const useAppTabStore = defineStore('useAppTabStore', () => {
  const apps = reactive<IApplicationExtra[]>([]); // 原数据(来自于应用中心)
  const caches = reactive(new Map<IApplicationExtra['id'], IAppCacheValue>());
  const components = shallowRef<Component[]>([]);

  const add = (
    app: IApplicationExtra,
    component: Component,
    status: IAppCacheValue['status'],
    alone: IAppCacheValue['alone'],
  ): string | undefined => {
    if (caches.size > MAX) {
      message.info(`最多能打开${MAX}个应用`);
      return;
    }
    apps.push(app);
    caches.set(app.id, { fullPath: app.path, status, alone, timestamp: Date.now() }); // 添加应用
    components.value.push(component);
    return app.id;
  };

  const remove = (id: string): number => {
    const index = apps.findIndex((app) => app.id === id);
    const appName = apps[index].name;
    if (index === -1) {
      console.error('useAppTabStore#remove', id);
      return -1;
    }
    apps.splice(index, 1);
    components.value.splice(index, 1);
    const cache = getCache(id);
    if (cache && cache.microApp && cache.microApp.getStatus() === 'MOUNTED') {
      cache.microApp
        .unmount()
        .then(() => {
          console.log('useAppTabStore#remove', appName, '卸载成功');
        })
        .catch((error) => {
          console.error('useAppTabStore#remove', appName, '卸载失败', error);
        })
        .finally(() => {
          cache.microApp = undefined;
          cache.historyState = undefined;
          caches.delete(id);
        });
    }
    // 场景 (1)打开系统设置-应用管理-搜索 (2)打开消息中心 (3)关闭系统设置 (4)打开系统设置
    // caches.delete(id); // 因为`KeepAlive`缓存页面, 保持原来路由
    return index;
  };

  const getCache = (id: IApplicationExtra['id']): IAppCacheValue | undefined => {
    return caches.get(id);
  };

  const updateFullPath = (id: IApplicationExtra['id'], fullPath: string) => {
    const cache = getCache(id);
    if (cache) {
      cache.fullPath = fullPath;
      // 为什么使用`JSON.stringify`
      // Error with push/replace State DOMException: Failed to execute 'pushState' on 'History': #<Object> could not be cloned.
      cache.historyState = JSON.stringify(history.state);
      cache.timestamp = Date.now(); // 用于处理`最近使用应用`业务
      caches.set(id, cache);
    }
  };

  const updateStatus = (id: IApplicationExtra['id'], status: IAppCacheValue['status']) => {
    const cache = getCache(id);
    if (cache) {
      cache.status = status;
      caches.set(id, cache);
    }
  };

  const updateMicroApp = (id: IApplicationExtra['id'], microApp: IAppCacheValue['microApp']) => {
    const cache = getCache(id);
    if (cache) {
      cache.microApp = microApp;
      caches.set(id, cache);
    }
  };

  return { apps, caches, components, add, remove, getCache, updateFullPath, updateStatus, updateMicroApp };
});

export default useAppTabStore;
