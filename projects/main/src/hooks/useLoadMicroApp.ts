import { loadMicroApp, addGlobalUncaughtErrorHandler } from 'qiankun';
import useAppTabStore from '@/stores/useAppTabStore';
import useAccessToken from '@/hooks/useAccessToken';
import type { Application } from '@/types/Application';

// 添加全局的未捕获异常处理器
addGlobalUncaughtErrorHandler((event: any) => {
  let msg = event;
  if (event.type === 'unhandledrejection') {
    msg = event.reason.message;
  }
  console.error('MicroApp', msg);
});

const useLoadMicroApp = () => {
  const appTabStore = useAppTabStore();

  // 加载微应用 - 后续动作 - 生命周期不准确, 需要子应用调用主应用方法
  // const loadMicroAppAfter = (app: Application, microApp: MicroApp) => {
  //   microApp.loadPromise.then(() => {
  //     console.log('useLoadMicroApp', app.name, '加载资源', microApp.getStatus());
  //     appTabStore.updateStatus(app.id, 'LOADING_SOURCE_CODE');
  //   });
  //   microApp.bootstrapPromise.then(() => {
  //     console.log('useLoadMicroApp', app.name, '初始化', microApp.getStatus());
  //     appTabStore.updateStatus(app.id, 'BOOTSTRAPPING');
  //   });
  //   microApp.mountPromise.then(() => {
  //     console.log('useLoadMicroApp', app.name, '挂载成功', microApp.getStatus());
  //     appTabStore.updateStatus(app.id, 'MOUNTED');
  //   });
  //   microApp.unmountPromise.then(() => {
  //     console.log('useLoadMicroApp', app.name, '卸载成功', microApp.getStatus());
  //     appTabStore.updateStatus(app.id, 'UNMOUNTING');
  //   });
  // };

  // 加载微应用
  const loadMicroAppByQiankun = (app: Application, entry: string) => {
    const accessToken = useAccessToken();
    const code = app.code;
    const microApp = loadMicroApp(
      {
        name: code,
        entry,
        container: `#${code}`,
        props: {
          token: accessToken.value || '',
          source: 'doraemon',
          shared: {
            setLoading: () => {
              console.log('useLoadMicroApp', app.name, '挂载成功');
              appTabStore.updateStatus(app.id, 'MOUNTED');
            },
            getLoading: () => false,
            getUnmounting: () => true,
            setUnmounting: () => {},
          },
        },
      },
      // { singular: false },
    );
    appTabStore.updateMicroApp(app.id, microApp);
    // loadMicroAppAfter(app, microApp);
  };

  return loadMicroAppByQiankun;
};

export default useLoadMicroApp;
