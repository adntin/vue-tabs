import type { Application } from '@/types/Application';

const getAppByFullPath = (apps: Application[] | undefined, fullPath: string) => {
  return apps?.find((app) => {
    if (!app.path) {
      return false; // 云端数据可能为空
    }
    const appPath = app.path.split('?')[0];
    return fullPath.startsWith(appPath);
  });
};

export default getAppByFullPath;
