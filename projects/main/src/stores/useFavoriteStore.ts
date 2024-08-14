import { onBeforeMount, ref } from 'vue';
import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';
import type { Application } from '@/types/Application';
import Http from '@/network';

const KEY = 'favorite';

const useFavoriteStore = defineStore(KEY, () => {
  const loading = ref(true);
  const data = ref<Application[] | undefined>(getLocal());

  function getLocal(): Application[] | undefined {
    const localData = sessionStorage.getItem(KEY);
    if (localData) {
      return JSON.parse(localData);
    }
    return undefined;
  }

  function saveLocal(newData: Application[]) {
    const newDataString = JSON.stringify(newData);
    if (sessionStorage.getItem(KEY) !== newDataString) {
      data.value = newData;
      sessionStorage.setItem(KEY, newDataString);
    }
  }

  async function getRemote() {
    try {
      loading.value = true;
      // const response = await Http.getInstance().get('/api/auth/favoriteApplications?clientType=1');
      const response = [] as Application[];
      saveLocal(response);
      return response;
    } catch (error: any) {
      message.error(error?.msg || '`应用收藏`获取数据失败，请刷新页面');
      return Promise.reject(error);
    } finally {
      loading.value = false;
    }
  }

  async function getFavoriteStore(): Promise<Application[]> {
    const localData = getLocal();
    if (localData) {
      getRemote().catch((error) => console.warn('getApplications', error));
      return localData;
    }
    return getRemote();
  }

  const add = async (app: Application) => {
    try {
      message.loading({ content: '收藏中...', key: app.id });
      const response = await Http.getInstance().put(`/api/auth/favoriteApplications/${app.id}`, {
        enabled: 1,
        clientType: 1,
      });
      if (data.value) {
        data.value = data.value.concat(app); // data.value.push(app); // 不能使用`push`方法, 因为原数据指针未改变
      } else {
        data.value = [app];
      }
      message.success({ content: '已收藏', key: app.id });
      return response;
    } catch (error: any) {
      message.error({ content: error?.msg || '收藏失败，请重试!', key: app.id });
      return Promise.reject(error);
    }
  };

  const remove = async (app: Application) => {
    try {
      message.loading({ content: '取消收藏中...', key: app.id });
      const response = await Http.getInstance().put(`/api/auth/favoriteApplications/${app.id}`, {
        enabled: 0,
        clientType: 1,
      });
      data.value = data.value!.filter((i) => i.id !== app.id);
      message.success({ content: '已取消收藏', key: app.id });
      return response;
    } catch (error: any) {
      message.error({ content: error?.msg || '取消收藏失败，请重试!', key: app.id });
      return Promise.reject(error);
    }
  };

  onBeforeMount(() => {
    getFavoriteStore();
  });

  return { data, loading, add, remove };
});

export default useFavoriteStore;
