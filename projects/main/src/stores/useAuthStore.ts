import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { HttpRefreshResolve } from '@/network';

export const STORAGE_ACCESS_TOKEN = 'accessToken';
export const STORAGE_ACCESS_EXPIRE = 'accessExpire';
export const STORAGE_REFRESH_TOKEN = 'refreshToken';
export const STORAGE_REFRESH_EXPIRE = 'refreshExpire';

const useAuthStore = defineStore('auth', () => {
  let local = localStorage.getItem(STORAGE_ACCESS_TOKEN);
  if (!!local && /^(null|undefined|\[object object\])$/i.test(local)) {
    localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    local = '';
  }
  const accessToken = ref(local);
  const accessExpire = ref(Number(localStorage.getItem(STORAGE_ACCESS_EXPIRE)));
  const refreshToken = ref(localStorage.getItem(STORAGE_REFRESH_TOKEN));
  const refreshExpire = ref(Number(localStorage.getItem(STORAGE_REFRESH_EXPIRE)));

  const set = (options: HttpRefreshResolve) => {
    if (!options) {
      return;
    }
    if (options.accessToken) {
      accessToken.value = options.accessToken;
      localStorage.setItem(STORAGE_ACCESS_TOKEN, options.accessToken);
    }
    if (options.accessExpire) {
      const value = options.accessExpire * 1000 + Date.now();
      refreshExpire.value = value;
      localStorage.setItem(STORAGE_ACCESS_EXPIRE, String(value));
    }
    if (options.refreshToken) {
      refreshToken.value = options.refreshToken;
      localStorage.setItem(STORAGE_REFRESH_TOKEN, options.refreshToken);
    }
    if (options.refreshExpire) {
      const value = options.refreshExpire * 1000 + Date.now();
      refreshExpire.value = value;
      localStorage.setItem(STORAGE_REFRESH_EXPIRE, String(value));
    }
  };

  return { accessToken, accessExpire, refreshToken, refreshExpire, set };
});

export default useAuthStore;
