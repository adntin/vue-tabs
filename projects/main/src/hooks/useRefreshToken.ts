import { computed, unref, type ComputedRef } from 'vue';
import useAuthStore from '@/stores/useAuthStore';

function useRefreshToken(): ComputedRef<string | null> {
  const store = useAuthStore();
  return computed(() => {
    return unref(store.refreshToken);
  });
}

export default useRefreshToken;
