<script setup lang="ts">
import EnumLayout from '@/enums/EnumLayout';
import LoadingComponent from '@/components/LoadingComponent.vue';
import LayoutView from './LayoutView.vue';

const layout = EnumLayout.Horizontal;
</script>

<template>
  <LayoutView v-if="layout" :layout="layout"></LayoutView>
  <LoadingComponent v-else />
</template>
