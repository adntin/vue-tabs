import { computed, unref, type ComputedRef } from 'vue';
import useAuthStore from '@/stores/useAuthStore';

function useAccessToken(): ComputedRef<string | null> {
  const store = useAuthStore();
  return computed(() => {
    return unref(store.accessToken);
  });
}

export default useAccessToken;
