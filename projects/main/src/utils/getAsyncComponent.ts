import { defineAsyncComponent, type AsyncComponentLoader, type Component } from 'vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';

// 生成异步组件
const getAsyncComponent = (loader: AsyncComponentLoader): Component => {
  return defineAsyncComponent({
    loader,
    loadingComponent: LoadingComponent,
    errorComponent: ErrorComponent,
    delay: 200,
    timeout: 6000,
  });
};

export default getAsyncComponent;
