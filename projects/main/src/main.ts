import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import httpPlugin from '@/plugins/httpPlugin';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(httpPlugin, import.meta.env.VITE_SERVER_URL);

app.mount('#app');
