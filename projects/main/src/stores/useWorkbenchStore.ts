import { onBeforeMount, ref } from 'vue';
import { defineStore } from 'pinia';
import { message } from 'ant-design-vue';
import type { Workbench } from '@/types/Workbench';

const KEY = 'workbench';
const ACTIVE_ID = 'workbenchActiveId';

const useWorkbenchStore = defineStore(KEY, () => {
  const loading = ref<boolean>(true);
  const activeId = ref<string | null>(localStorage.getItem(ACTIVE_ID));
  const data = ref<Workbench[] | undefined>(getLocal());

  function getLocal(): Workbench[] | undefined {
    const localData = localStorage.getItem(KEY);
    if (localData) {
      return JSON.parse(localData);
    }
    return undefined;
  }

  function saveLocal(newData: Workbench[]) {
    const newDataString = JSON.stringify(newData);
    if (localStorage.getItem(KEY) !== newDataString) {
      data.value = newData;
      fixActiveId();
      localStorage.setItem(KEY, newDataString);
    }
  }

  function setActiveId(id: string) {
    if (id !== activeId.value) {
      activeId.value = id;
      localStorage.setItem(ACTIVE_ID, id);
    }
  }

  function removeActiveId() {
    activeId.value = null;
    localStorage.removeItem(ACTIVE_ID);
  }

  // 修正 activeId
  function fixActiveId() {
    if (!data.value || data.value.length === 0) {
      removeActiveId();
      return;
    }
    const workbench = data.value.find((i) => i.status === 1 && i.id === activeId.value); // 必须是启用的工作台
    if (!workbench) {
      setActiveId(data.value[0].id);
    }
  }

  async function getRemote() {
    try {
      loading.value = true;
      // const response = await Http.getInstance().get<Workbench[]>('/api/auth/user/workbenches?clientType=desktop');
      const response = [
        {
          id: '1',
          name: '校长工作台',
          status: 1,
          widgets: [
            { x: 0, y: 0, w: 6, h: 4, i: 'ClassOverview' },
            { x: 6, y: 0, w: 3, h: 4, i: 'NotificationAnnouncement' },
            { x: 9, y: 0, w: 3, h: 8, i: 'ClassEvaluation' },
            { x: 0, y: 4, w: 3, h: 8, i: 'CourseSchedule' },
            { x: 3, y: 4, w: 3, h: 4, i: 'SchoolVideo' },
            { x: 6, y: 4, w: 3, h: 8, i: 'SchoolInformation' },
            { x: 3, y: 8, w: 3, h: 4, i: 'SchoolAlbum' },
            { x: 9, y: 8, w: 3, h: 4, i: 'EnvironmentalMonitoring' },
          ],
        },
        {
          id: '2',
          name: '全员工作台',
          status: 1,
          widgets: [
            { x: 0, y: 0, w: 6, h: 4, i: 'DormitoryOverview' },
            { x: 6, y: 0, w: 3, h: 4, i: 'DormitoryLeaveRate' },
            { x: 9, y: 0, w: 3, h: 4, i: 'DormitoryAbnormalTop5' },
            { x: 0, y: 4, w: 6, h: 8, i: 'DormitoryAttendanceOverview' },
            { x: 6, y: 4, w: 3, h: 8, i: 'DormitoryLeaveStudents' },
            { x: 9, y: 4, w: 3, h: 8, i: 'DormitoryAbnormalStudents' },
          ],
        },
      ];
      saveLocal(response);
      return response;
    } catch (error: any) {
      message.error(error?.msg || '`工作台`获取数据失败，请刷新页面');
      return Promise.reject(error);
    } finally {
      loading.value = false;
    }
  }

  async function getWorkbenchStore(): Promise<Workbench[]> {
    const localData = getLocal();
    if (localData) {
      getRemote().catch((error) => console.warn('getWorkbenchStore', error));
      return localData;
    }
    return getRemote();
  }

  onBeforeMount(() => {
    getWorkbenchStore();
  });

  return { loading, data, activeId, setActiveId, removeActiveId };
});

export default useWorkbenchStore;
