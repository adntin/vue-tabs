import { onBeforeMount, ref } from 'vue';
import { defineStore } from 'pinia';
import { message } from 'ant-design-vue';
import type { Application } from '@/types/Application';
import ApplicationType from '@/constants/ApplicationType';
import ApplicationTarget from '@/constants/ApplicationTarget';
import ApplicationBelong from '@/constants/ApplicationBelong';

const KEY = 'application';

const useApplicationStore = defineStore(KEY, () => {
  const loading = ref(false);
  const data = ref<Application[] | undefined>(getLocal());

  // 需要使用`app`级别, 因为`inject`需要在`<script setup>`或`setup()`内同步调用
  // https://v3.ru.vuejs.org/api/composition-api.html#getcurrentinstance
  // https://cn.vuejs.org/guide/components/provide-inject#inject
  // https://cn.vuejs.org/guide/components/provide-inject#app-level-provide
  // 因为`路由守卫`要用到`依赖注入`数据, 会导致如下问题
  // [Vue warn]: inject() can only be used inside setup() or functional components.
  // getCurrentInstance()?.appContext.app.provide(KEY, data); // 用于导航守卫上报日志

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
      // const response = await Http.getInstance().get<Application[]>('/api/auth/v1/applications');
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
          categoryId: '1',
          categoryName: '基座应用',
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
          categoryId: '1',
          categoryName: '基座应用',
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
          categoryId: '1',
          categoryName: '基座应用',
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
          categoryId: '1',
          categoryName: '基座应用',
        },
        {
          id: '5',
          name: '百度',
          code: 'ThirdParty',
          icon: 'https://devimpfile.lexikos.com/dev/-1/png/d25f880bd2ed4bddbef05e0288dc80e1.png',
          path: 'https://baidu.com',
          type: ApplicationType.Iframe,
          target: ApplicationTarget.Self,
          belong: ApplicationBelong.Business,
          categoryId: '2',
          categoryName: '应用分类1',
        },
      ];
      saveLocal(response);
      return response;
    } catch (error: any) {
      message.error(error?.msg || '`应用中心`获取数据失败，请刷新页面');
      return Promise.reject(error);
    } finally {
      loading.value = false;
    }
  }

  async function getApplicationStore(): Promise<Application[]> {
    const localData = getLocal();
    if (localData) {
      getRemote().catch((error) => console.warn('getApplications', error));
      return localData;
    }
    return getRemote();
  }

  // 因为`路由守卫`要用到`Pinia`数据, 会导致如下问题
  // onBeforeMount is called when there is no active component instance to be associated with.
  // Lifecycle injection APIs can only be used during execution of setup().
  // If you are using async setup(), make sure to register lifecycle hooks before the first await statement.
  onBeforeMount(() => {
    getApplicationStore();
  });

  return { loading, data, getApplicationStore };
});

export default useApplicationStore;
