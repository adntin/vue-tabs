<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import { ConfigProvider } from 'ant-design-vue';
import type { AliasToken } from 'ant-design-vue/es/theme/internal';

const themes: Record<string, Partial<AliasToken>> = {
  Blue: {
    colorPrimary: '#1677FF',
  },
  Pink: {
    colorPrimary: '#f25460',
  },
};

const config = computed(() => {
  return {
    token: themes['Blue'],
  };
});
</script>

<template>
  <ConfigProvider :theme="config">
    <RouterView />
  </ConfigProvider>
</template>
