<script lang="ts" setup>
import { computed, ref, unref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  theme,
  Tabs,
  TabPane,
  message,
  Dropdown,
  Menu,
  MenuItem,
  type TabsProps,
  type MenuProps,
} from 'ant-design-vue';
import { CaretDownOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/_util/type';
import useAppTabStore from '@/stores/useAppTabStore';
import useNavigationStore from '@/stores/useNavigationStore';
import useWorkbenchStore from '@/stores/useWorkbenchStore';
import routerPushByAppCache from '@/utils/routerPushByAppCache';

const WORKBENCH = 'Workbench'; // AppCode

const route = useRoute();
const router = useRouter();
const { token } = theme.useToken();

const navigationStore = useNavigationStore();
const workbenchApp = computed(() => {
  const navigationConfigData = unref(navigationStore.data);
  return navigationConfigData?.find((nav) => nav.code === WORKBENCH); // `工作台`应用只存在于导航栏
});

const workbenchStore = useWorkbenchStore();
const workbenchStoreData = computed(() => unref(workbenchStore.data));
const workbenchCount = computed(() => {
  let count = 0; // 启用工作台个数
  workbenchStoreData.value?.forEach((i) => {
    if (i.status === 1) {
      count++;
    }
  });
  return count;
});
const workbenchName = computed(() => {
  const activeId = unref(workbenchStore.activeId);
  if (!workbenchStoreData.value || workbenchCount.value === 1) {
    return '工作台';
  }
  const workbench = workbenchStoreData.value.find((i) => i.status === 1 && i.id === activeId);
  return workbench ? workbench.name : workbenchStoreData.value[0].name;
});

const appTabStore = useAppTabStore();
const appTabStoreApps = computed(() => unref(appTabStore.apps));

const activeKey = ref<string>(); // 当前激活标签页的`TabPane.key`属性

// 选中标签页
watch(
  [() => route.path, appTabStoreApps],
  ([path, apps]) => {
    if (apps.length === 0) {
      return;
    }
    const index = apps.findIndex((app) => path.startsWith(app.path));
    const appId = apps[index].id;
    if (activeKey.value !== appId) {
      activeKey.value = appId;
    }
  },
  { immediate: true },
);

// 新增和删除标签页回调
const onEdit: TabsProps['onEdit'] = (targetKey: MouseEvent | KeyboardEvent | Key, action: 'add' | 'remove') => {
  if (action === 'remove') {
    // 最后标签页位置
    const lastIndex = appTabStoreApps.value.length - 1;
    if (!workbenchApp.value && lastIndex === 0) {
      message.warn('至少保留一个标签页');
      return;
    }
    // 删除标签页位置
    const removeIndex = appTabStoreApps.value.findIndex((app) => app.id === targetKey);
    // 删除标签页 === 激活标签页
    let nextActiveApp;
    if (targetKey === activeKey.value) {
      if (removeIndex === lastIndex) {
        nextActiveApp = appTabStoreApps.value[lastIndex - 1];
      } else {
        nextActiveApp = appTabStoreApps.value[removeIndex];
      }
    }
    // 删除标签页缓存
    appTabStore.remove(targetKey as string);
    // 工作台
    if (appTabStoreApps.value.length === 0) {
      activeKey.value = workbenchApp.value!.id; // 选中标签页
      router.push('/Workbench');
      return;
    }
    // 删除标签页 === 激活标签页
    if (nextActiveApp) {
      activeKey.value = nextActiveApp.id; // 选中标签页
      const cache = appTabStore.getCache(nextActiveApp.id);
      routerPushByAppCache(router, cache!, true); // 替换路由(replace)
    }
  }
};

// 切换标签页回调(targetKey === appId)
const onChange: TabsProps['onChange'] = (targetKey: Key) => {
  const cache = appTabStore.getCache(targetKey as string);
  if (cache) {
    routerPushByAppCache(router, cache); // 更换路由
    return;
  }
  if (targetKey === workbenchApp.value?.id) {
    router.push('/Workbench'); // 因为工作台没有加载, 也要默认在第一个显示
    return;
  }
  message.error(`在标签页缓存中, 未找到 ${targetKey}`);
  return;
};

// 切换工作台下拉框
const handleMenuClick: MenuProps['onClick'] = (e) => {
  const workbenchId = e.key as string;
  workbenchStore.setActiveId(workbenchId);
};
</script>

<template>
  <Tabs
    v-model:activeKey="activeKey"
    type="editable-card"
    @edit="onEdit"
    @change="onChange"
    hide-add
    prefixCls="layout-tabs"
  >
    <TabPane :key="workbenchApp.id" :closable="false" v-if="workbenchApp">
      <template #tab>
        <span class="tab-title">
          <img :src="workbenchApp.icon" class="icon" />
          {{ workbenchName }}
          <Dropdown placement="bottom" v-if="workbenchCount > 1">
            <CaretDownOutlined />
            <template #overlay>
              <Menu @click="handleMenuClick">
                <template v-for="workbench in workbenchStoreData">
                  <MenuItem :key="workbench.id" v-if="workbench.status === 1">
                    <a href="javascript:;">{{ workbench.name }}</a>
                  </MenuItem>
                </template>
              </Menu>
            </template>
          </Dropdown>
        </span>
      </template>
    </TabPane>
    <template v-for="app in appTabStoreApps" :key="app.id">
      <TabPane v-if="app.code !== WORKBENCH" :key="app.id">
        <template #tab>
          <span class="tab-title">
            <img v-if="typeof app.icon === 'string'" :src="app.icon" class="icon" />
            <component :is="app.icon" v-else />
            {{ app.name }}
          </span>
        </template>
      </TabPane>
    </template>
  </Tabs>
</template>

<style lang="scss" scoped>
.layout .layout-tabs {
  :deep(.layout-tabs-nav) {
    height: 42px;
    background-color: #fff;
    padding: 6px 10px;
    margin: 0;
    ::before {
      border-bottom: none;
    }
  }
  :deep(.layout-tabs-tab) {
    background-color: #fff;
    border: none;
    padding: 6px 12px;
    font-size: 12px;
  }
  :deep(.layout-tabs-tab + .layout-tabs-tab) {
    margin-left: 6px;
  }
  :deep(.layout-tabs-tab-active) {
    background-color: v-bind('token.colorPrimaryBg');
    border-radius: 6px;
    .layout-tabs-tab-btn {
      text-shadow: none;
    }
  }
  :deep(.layout-tabs-tab-remove) {
    margin-left: 6px;
    padding: 0 4px;
  }
  :deep(.layout-tabs-content-holder) {
    display: none;
  }
}
.tab-title {
  display: flex;
  align-items: center;
  .icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  :deep(.anticon-caret-down) {
    margin-right: 0;
    padding-left: 6px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
