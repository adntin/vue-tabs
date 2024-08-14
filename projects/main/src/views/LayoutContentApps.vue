<script setup lang="ts">
import { computed, ref, unref, watch } from 'vue';
import { useRoute } from 'vue-router';
import useAppTabStore from '@/stores/useAppTabStore';
import LoadingComponent from '@/components/LoadingComponent.vue';

declare global {
  interface Window {
    __appTabStore__: any;
  }
}

const route = useRoute();
const appTabStore = useAppTabStore();
window.__appTabStore__ = appTabStore;
const appTabStoreApps = computed(() => unref(appTabStore.apps));
const appTabStoreComponents = computed(() => unref(appTabStore.components));
const currentAppId = ref(appTabStoreApps.value.length > 0 ? appTabStoreApps.value[0].id : '');

watch(
  [() => route.fullPath, appTabStoreApps],
  ([fullPath, apps]) => {
    const len = apps.length;
    for (let i = 0; i < len; i++) {
      if (fullPath.startsWith(apps[i].path.split('?')[0])) {
        if (currentAppId.value !== apps[i].id) {
          currentAppId.value = apps[i].id;
        }
        break;
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="layout-apps">
    <!-- 在`RouterView`外层独立存在, 路由改变时, 保持DOM不卸载 -->
    <!-- 微应用, 保持多个, 避免重复执行增加内存 -->
    <!-- 低码应用, 避免`postMessage`跳转到详情后, 再次回来被刷新  -->
    <template v-for="(app, index) in appTabStoreApps">
      <div
        :key="app.id"
        v-if="appTabStore.getCache(app.id)?.alone"
        v-show="app.id === currentAppId"
        class="alone-app"
        :data-app-code="appTabStoreApps[index].code"
      >
        <component :is="appTabStoreComponents[index]" />
        <LoadingComponent v-if="appTabStore.getCache(app.id)?.status !== 'MOUNTED'" />
      </div>
    </template>
    <!-- 路由应用, 只需一个, 路由变化复用容器 -->
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </div>
</template>

<style lang="scss" scoped>
.layout-apps {
  flex: 1;
  overflow: auto;
  margin: 16px;
  border-radius: 4px;
  background-color: #fff;
  .alone-app {
    height: 100%;
    overflow: auto;
  }
}
</style>
