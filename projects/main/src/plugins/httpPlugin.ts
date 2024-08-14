import { type App, unref } from 'vue';
import { message } from 'ant-design-vue';
import Http, { onLogout, onRefreshToken, TOKEN_KEY } from '@/network';
import useAuthStore from '@/stores/useAuthStore';

declare global {
  interface Window {
    __http__: Http;
  }
}

export default {
  install(app: App, baseUrl = '') {
    const store = useAuthStore();
    const accessToken = unref(store.accessToken);
    const http = new Http({
      baseUrl, // 离线版, baseUrl = ''
      onLogout,
      onRefreshToken,
      showErrorMessage: message.error,
      headers: {
        'Content-Type': 'application/json',
        [TOKEN_KEY]: accessToken,
      },
    });
    window.__http__ = http;
    // app.provide('$http', http);
    // app.config.globalProperties.$http = http;
    return app;
  },
};
