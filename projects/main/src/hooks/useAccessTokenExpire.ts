import { computed, unref, type ComputedRef } from 'vue';
import useAuthStore from '@/stores/useAuthStore';

function useAccessTokenExpire(): ComputedRef<number> {
  const store = useAuthStore();
  return computed(() => {
    return unref(store.accessExpire);
  });
}

export default useAccessTokenExpire;
