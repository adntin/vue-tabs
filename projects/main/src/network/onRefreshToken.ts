import { unref } from 'vue';
import useAuthStore from '@/stores/useAuthStore';
import Http from './Http';
import type { HttpRefreshResolve, HttpRefreshResponse } from './types';

function onRefreshToken(): Promise<HttpRefreshResolve> {
  const store = useAuthStore();
  const accessToken = unref(store.accessToken);
  const refreshToken = unref(store.refreshToken);

  if (!accessToken || !refreshToken) {
    const msg = `[onRefreshToken] accessToken 或 refreshToken 不存在 ${!!accessToken} ${!!refreshToken}`;
    return Promise.reject(msg);
  }

  return Http.getInstance()
    .post('/api/building/anon/refreshToken', { accessToken, refreshToken })
    .then((data: HttpRefreshResponse) => {
      if (data.accessToken) {
        const result: HttpRefreshResolve = {
          accessToken: data.accessToken,
          accessExpire: data.expireTime,
          refreshToken: data.refreshToken,
          refreshExpire: data.refreshExpireTime,
        };
        store.set(result);
        return Promise.resolve(result);
      } else {
        const msg = '[onRefreshToken] accessToken 不存在';
        return Promise.reject(msg);
      }
    });
}

export default onRefreshToken;
