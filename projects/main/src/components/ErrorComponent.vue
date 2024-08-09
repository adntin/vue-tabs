<script lang="ts" setup>
import { Result, Button } from 'ant-design-vue';

const props = withDefaults(defineProps<{ tip?: string }>(), { tip: '访问异常' });

const handelRefresh = () => {
  window.location.reload();
};
</script>

<template>
  <div class="center">
    <Result status="error" :title="props.tip">
      <template #subTitle>
        <p>可能有新版本发布, 请联系管理人员</p>
        <p>{{ $route.fullPath }}</p>
      </template>
      <template #extra>
        <Button type="primary" @click="handelRefresh">刷新</Button>
      </template>
    </Result>
  </div>
</template>

<style lang="scss" scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
