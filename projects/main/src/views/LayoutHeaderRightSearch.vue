<script lang="ts" setup>
import { computed, ref, unref } from 'vue';
import { useRouter } from 'vue-router';
import { theme, Select, SelectOption } from 'ant-design-vue';
import type { SelectProps } from 'ant-design-vue/es/vc-select';
import { SearchOutlined } from '@ant-design/icons-vue';
import useApplicationStore from '@/stores/useApplicationStore';
import clickAppHandle from '@/utils/clickAppHandle';

const router = useRouter();
const { token } = theme.useToken();

// const KEY = 'search';
// const searchLocalData = localStorage.getItem(KEY);
// const searchRefData = ref(searchLocalData ? JSON.parse(searchLocalData) : undefined);

const keyword = ref();
const searchSelect = ref();
const applicationStore = useApplicationStore();
const applicationStoreData = computed(() => unref(applicationStore.data));
// const searchAppData = computed(() =>
//   applicationsStoreData.value?.filter((app) => searchRefData.value.includes(app.id)),
// );

const handleChange: SelectProps['onChange'] = (value, option: any) => {
  searchSelect.value.blur();
  keyword.value = null;
  const appId = option.key;
  const app = applicationStoreData.value!.find((_app) => _app.id === appId);
  if (app!.code === 'TaskCenter') {
    document.getElementById('taskCenterBtn')?.click();
  } else {
    clickAppHandle(app!, router);
  }
  // if (searchRefData.value) {
  //   searchRefData.value.push(appId);
  // } else {
  //   searchRefData.value = [appId];
  // }
  // localStorage.setItem(KEY, JSON.stringify(searchRefData.value));
};
</script>

<template>
  <Select
    v-model:value="keyword"
    @change="handleChange"
    show-search
    ref="searchSelect"
    placeholder="应用名称"
    class="search"
  >
    <SelectOption v-for="app in applicationStoreData" :value="app.name" :key="app.id">
      <img :src="app.icon" width="20" height="20" />
      &nbsp;&nbsp;{{ app.name }}
    </SelectOption>
    <template #suffixIcon>
      <SearchOutlined />
    </template>
  </Select>
</template>

<style lang="scss" scoped>
.search {
  margin-right: 12px;
  :deep(.ant-select-selector) {
    width: 180px;
    color: #fff;
    background: v-bind('token.colorFill');
    border-color: transparent;
  }
  :deep(.ant-select-selector .ant-select-selection-placeholder) {
    color: rgb(255 255 255 / 65%);
  }
  :deep(.anticon-search) {
    color: rgb(255 255 255 / 65%);
  }
}
</style>
