<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Result } from 'ant-design-vue';

const route = useRoute();
const path = computed(() => route.redirectedFrom?.fullPath);

// function handleClick() {
//   location.href = location.origin;
// }
</script>
<template>
  <div class="center">
    <Result status="500" title="500">
      <template #subTitle>
        <p v-if="!!path">页面路径：{{ path }}</p>
        <p>对不起，服务器开小差了。</p>
      </template>
      <!-- <template #extra>
        <Button type="primary" @click="handleClick">返回首页</Button>
      </template> -->
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
