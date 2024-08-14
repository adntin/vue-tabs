<script lang="ts" setup>
import logo from '@/assets/logo.png';
const locationName = '公司名称';
</script>

<template>
  <div class="layout-header-left">
    <img :src="logo" alt="" v-if="logo" class="logo" />
    <span class="name">{{ locationName }}</span>
  </div>
</template>

<style lang="scss" scoped>
.layout-header-left {
  display: flex;
  align-items: center;
  padding-inline-end: 24px;
  float: left;
  cursor: pointer;
  .logo {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }
  .name {
    margin-right: 8px;
    font-weight: 600;
  }
}
</style>
