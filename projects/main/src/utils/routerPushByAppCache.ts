import type { LocationQueryRaw, RouteLocationPathRaw, Router } from 'vue-router';
import type { IAppCacheValue } from '@/stores/useAppTabStore';

const routerPushByAppCache = (router: Router, cache: IAppCacheValue, replace = false) => {
  const fullPath = cache.fullPath;
  const state = cache.historyState ? JSON.parse(cache.historyState) : undefined;
  const path = fullPath.split('?')[0];
  const to: RouteLocationPathRaw = { path, state };
  const matchedHash = fullPath.match(/(#.*)/);
  if (matchedHash) {
    to.hash = matchedHash[1];
  }
  const matchedQuery = fullPath.match(/\?(.*)/);
  if (matchedQuery) {
    // 去掉`?`前面的路径, 包括`?`
    let str = matchedQuery[1];
    if (matchedHash) {
      // 去掉`#`后面的锚点, 包括`#`
      str = matchedQuery[1].split('#')[0];
    }
    const query: LocationQueryRaw = {};
    const searchParams = new URLSearchParams(str); // 只接受 "key1=value1&key2=value2"
    for (const [key, value] of searchParams) {
      query[key] = value;
    }
    to.query = query;
  }
  to.replace = replace;
  router.push(to);
};

export default routerPushByAppCache;
