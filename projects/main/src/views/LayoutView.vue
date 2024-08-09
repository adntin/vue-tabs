<script lang="ts" setup>
import { RouterView } from 'vue-router';
import { theme, Layout, LayoutHeader, LayoutContent, LayoutSider } from 'ant-design-vue';
import NavBarView from './NavBarView.vue';
import EnumLayout from '@/enums/EnumLayout';

const props = defineProps<{ layout: EnumLayout }>();

const { token } = theme.useToken();
</script>

<template>
  <Layout class="layout">
    <LayoutHeader>
      <NavBarView v-if="props.layout === EnumLayout.horizontal" :layout="EnumLayout.horizontal" />
    </LayoutHeader>
    <Layout>
      <LayoutSider v-if="props.layout === EnumLayout.vertical" theme="light" width="90" class="layout-sider">
        <NavBarView :layout="EnumLayout.vertical" />
      </LayoutSider>
      <LayoutContent>
        <RouterView />
      </LayoutContent>
    </Layout>
  </Layout>
</template>

<style lang="scss" scoped>
.layout {
  height: 100%;
  min-width: 1280px;
  :deep(.ant-layout-header) {
    height: 56px;
    line-height: 56px;
    padding-inline-start: 24px;
    padding-inline-end: 24px;
    background-color: v-bind('token.colorPrimary');
    color: #fff;
    font-size: 16px;
  }
  :deep(.ant-layout-content) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .layout-sider {
    height: 100%;
    overflow: auto;
    border-right: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 2px 6px 0px #00000014;
    z-index: 1;
  }
  .layout-workbench {
    .layout-sider {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
    }
    :deep(.layout-apps) {
      margin: 0;
      background-color: transparent;
      .single-app {
        padding: 16px;
      }
    }
  }
}
</style>
