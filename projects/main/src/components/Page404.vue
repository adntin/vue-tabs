<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Result, Button } from 'ant-design-vue';

const route = useRoute();
const path = computed(() => route.redirectedFrom?.fullPath);

const handelRefresh = () => {
  window.location.reload();
};
const handleHome = () => {
  window.location.href = '/';
};
</script>
<template>
  <div class="center">
    <Result status="404" title="404">
      <template #subTitle>
        <p v-if="!!path">页面路径：{{ path }}</p>
        <p>对不起，您访问的页面不存在。</p>
      </template>
      <template #extra>
        <Button @click="handelRefresh">刷新</Button>
        <Button type="primary" @click="handleHome">首页</Button>
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
