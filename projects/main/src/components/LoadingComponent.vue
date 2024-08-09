<script lang="ts" setup>
import { Spin } from 'ant-design-vue';

const props = withDefaults(defineProps<{ tip?: string }>(), { tip: '加载中' });
</script>

<template>
  <div class="loading">
    <Spin :tip="props.tip" />
  </div>
</template>

<style scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style>
