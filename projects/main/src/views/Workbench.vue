<script setup lang="ts">
import useWorkbenchStore from '@/stores/useWorkbenchStore';
import { computed, unref } from 'vue';

const workbenchesStore = useWorkbenchStore();
const workbenchesStoreData = computed(() => unref(workbenchesStore.data));
const workbenchesStoreActiveId = computed(() => unref(workbenchesStore.activeId));

const widgets = computed(() => {
  if (!workbenchesStoreData.value) {
    return;
  }
  const workbench = workbenchesStoreData.value.find((i) => i.id === workbenchesStoreActiveId.value);
  return workbench ? workbench.widgets : workbenchesStoreData.value[0].widgets; // 原始数据
});
</script>

<template>
  <pre>{{ widgets }}</pre>
</template>
