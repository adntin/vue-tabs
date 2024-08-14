import { ref, onBeforeMount } from 'vue';
import { defineStore } from 'pinia';
import { message } from 'ant-design-vue';
import type { Application } from '@/types/Application';
import ApplicationType from '@/constants/ApplicationType';
import ApplicationTarget from '@/constants/ApplicationTarget';
import ApplicationBelong from '@/constants/ApplicationBelong';

const KEY = 'navigation';

const useNavigationStore = defineStore(KEY, () => {
  const loading = ref(false);
  const data = ref<Application[] | undefined>(getLocal());

  function getLocal(): Application[] | undefined {
    const localData = localStorage.getItem(KEY);
    if (localData) {
      return JSON.parse(localData);
    }
    return undefined;
  }

  function saveLocal(newData: Application[]) {
    const newDataString = JSON.stringify(newData);
    if (localStorage.getItem(KEY) !== newDataString) {
      data.value = newData;
      localStorage.setItem(KEY, newDataString);
    }
  }

  async function getRemote() {
    try {
      loading.value = true;
      // const response = await Http.getInstance().get<Application[]>('/api/auth/navigationConfig');
      const response = [
        {
          id: '1',
          name: '工作台',
          code: 'Workbench',
          icon: 'https://devimpfile.lexikos.com/dev/-1/png/pub_9ae9f6c60e214bdfab98f7248ffeeb26.png',
          path: '/Workbench',
          type: ApplicationType.Route,
          target: ApplicationTarget.Self,
          belong: ApplicationBelong.Foundation,
        },
        {
          id: '2',
          name: '应用中心',
          code: 'ApplicationCenter',
          icon: 'https://devimpfile.lexikos.com/dev/-1/png/pub_5d30f0c541c0458fa41ce3926df1648e.png',
          path: '/ApplicationCenter',
          type: ApplicationType.Route,
          target: ApplicationTarget.Self,
          belong: ApplicationBelong.Foundation,
        },
        {
          id: '3',
          name: '数据中心',
          code: 'DataCenter',
          icon: 'https://devimpfile.lexikos.com/dev/-1/png/pub_28eb9b2bbbf8475fbb2ee85d8d8735af.png',
          path: '/DataCenter',
          type: ApplicationType.Route,
          target: ApplicationTarget.Self,
          belong: ApplicationBelong.Foundation,
        },
        {
          id: '4',
          name: '组织中心',
          code: 'OrganizationCenter',
          icon: 'https://devimpfile.lexikos.com/dev/-1/png/d25f880bd2ed4bddbef05e0288dc80e1.png',
          path: '/OrganizationCenter',
          type: ApplicationType.Route,
          target: ApplicationTarget.Self,
          belong: ApplicationBelong.Foundation,
        },
      ];
      saveLocal(response);
      return response;
    } catch (error: any) {
      message.error(error?.msg || '`导航栏`获取数据失败，请刷新页面');
      return Promise.reject(error);
    } finally {
      loading.value = false;
    }
  }

  async function getNavigationStore(): Promise<Application[]> {
    const localData = getLocal();
    if (localData) {
      getRemote().catch((error) => console.warn('getNavigationStore', error));
      return localData;
    }
    return getRemote();
  }

  onBeforeMount(() => {
    getNavigationStore();
  });

  return { loading, data };
});

export default useNavigationStore;
