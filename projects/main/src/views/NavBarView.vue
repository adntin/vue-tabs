<script lang="ts" setup>
import { computed, ref, unref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { theme, Menu, MenuItem, type MenuProps } from 'ant-design-vue';
import EnumLayout from '@/enums/EnumLayout';
import useNavigationStore from '@/stores/useNavigationStore';

const props = defineProps<{ layout: EnumLayout }>();
const mode = props.layout;

const route = useRoute();
const router = useRouter();
const { token } = theme.useToken();

const navigationStore = useNavigationStore();
const navigationData = computed(() => unref(navigationStore.data));

// 重定向
watch(
  navigationData,
  (newData) => {
    if (!newData) {
      return;
    }
    if (route.path === '/') {
      router.replace(newData[0].path);
    }
  },
  { immediate: true },
);

// 点击菜单
const handleMenuClick: MenuProps['onClick'] = (e) => {
  if (!navigationData.value) {
    return;
  }
  const app = navigationData.value.find((n) => n.id === e.key); // 根据`MenuItem`组件的`key`属性来决定, app.id
  router.push(app?.path!);
};

// 选中菜单
const selectedKeys = ref<string[]>();
watch(
  () => route.fullPath,
  (fullPath) => {
    if (!navigationData.value) {
      return;
    }
    const app = navigationData.value.find((i) => fullPath.startsWith(i.path));
    if (app) {
      selectedKeys.value = [app.id]; // 根据`MenuItem`组件的`key`属性来决定, app.id
    } else {
      selectedKeys.value = [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <Menu v-model:selectedKeys="selectedKeys" :mode="mode" @click="handleMenuClick">
    <MenuItem v-for="app in navigationData" :key="app.id">
      <template #icon v-if="mode === EnumLayout.Vertical">
        <img :src="app.icon" width="36" height="36" />
      </template>
      <div>{{ app.name }}</div>
    </MenuItem>
  </Menu>
</template>

<style lang="scss" scoped>
.ant-menu-horizontal.ant-menu {
  background-color: transparent;
  color: #fff;
  font-size: 16px;
  height: 38px;
  line-height: 38px;
  margin: 9px 12px;
  border-bottom: 0;
  :deep(.ant-menu-item) {
    transition: none;
    &::after {
      transition: none;
      border-bottom: 0;
    }
  }
  :deep(.ant-menu-item-selected) {
    background-color: #fff;
    padding: 0 16px;
    border-radius: 8px;
    user-select: none;
  }
  :deep(.ant-menu-title-content) {
    transition: none;
  }
  :deep(.ant-menu-submenu-selected),
  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title),
  :deep(.ant-menu-item:hover:not(.ant-menu-item-selected):not(.ant-menu-submenu-selected)),
  :deep(.ant-menu-submenu-title:hover:not(.ant-menu-item-selected):not(.ant-menu-submenu-selected)) {
    color: #fff;
  }
}

.ant-menu-vertical.ant-menu {
  padding: 0 8px 8px;
  border-inline-end: 0;
  background: transparent;
  :deep(.ant-menu-item) {
    height: 80px;
    width: 100%;
    padding-inline: 0;
    margin-inline: 0;
    margin-block: 8px;
    overflow: unset;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: v-bind('token.colorTextSecondary');
  }
  :deep(.ant-menu-item-icon) {
    margin-top: 12px;
  }
  :deep(.ant-menu-item .ant-menu-title-content) {
    margin-inline-start: 0;
    font-size: 12px;
    line-height: 20px;
    margin-top: 4px;
  }
  :deep(.ant-menu-item-selected) {
    color: v-bind('token.colorPrimary');
  }
}
</style>
