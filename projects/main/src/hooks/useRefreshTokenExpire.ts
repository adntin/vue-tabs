import { computed, unref, type ComputedRef } from 'vue';
import useAuthStore from '@/stores/useAuthStore';

function useRefreshTokenExpire(): ComputedRef<number> {
  const store = useAuthStore();
  return computed(() => {
    return unref(store.refreshExpire);
  });
}

export default useRefreshTokenExpire;
