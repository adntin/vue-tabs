<script lang="ts" setup>
import { computed, unref, h, createVNode, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button, Badge, Dropdown, Menu, MenuItem, MenuDivider, Modal, Tooltip } from 'ant-design-vue';
import {
  SettingOutlined,
  BellOutlined,
  CarryOutOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import defaultAvatar from '@/assets/avatar.png';
import useApplicationStore from '@/stores/useApplicationStore';
import clickAppHandle from '@/utils/clickAppHandle';
import type { Application } from '@/types/Application';
import LayoutHeaderRightSearch from './LayoutHeaderRightSearch.vue';

const route = useRoute();
const router = useRouter();
const userName = '张三'; //useUserName();
const userAvatar =
  'https://lexikos-private-bucket.oss-cn-hangzhou.aliyuncs.com/2660/png/39cc2f02cb1047328a55fb0fa040f705.png?Expires=1723704784&OSSAccessKeyId=LTAI5tAVEkWrY5YUba7wQQxt&Signature=D4mgoD3uVR6GqZR2l1n5Rw5XeRQ%3D'; //useUserAvatar();

// 应用列表
const applicationStore = useApplicationStore();
const applicationStoreData = computed(() => unref(applicationStore.data));
const appSystemSettings = ref<Application>();
const appNoticeCenter = ref<Application>();
const appTaskCenter = ref<Application>();
const appMyArchives = ref<Application>();

watch(
  applicationStoreData,
  (apps) => {
    apps?.forEach((app) => {
      switch (app.code) {
        case 'SystemSettings':
          appSystemSettings.value = app;
          break;
        case 'MessageCenter':
          appNoticeCenter.value = app;
          break;
        case 'TaskCenter':
          appTaskCenter.value = app;
          break;
        case 'TeacherArchives':
        case 'ArchiveEdu':
          appMyArchives.value = app;
          break;
        default:
          break;
      }
    });
  },
  { immediate: true },
);

function handleLogout() {
  Modal.confirm({
    title: '您确认退出吗?',
    icon: createVNode(ExclamationCircleOutlined),
    centered: true,
    onOk: async () => {
      // try {
      //   await Http.getInstance().get('/api/building/v3/logout');
      // } catch (e) {
      //   console.error('退出错误', e);
      // } finally {
      //   onLogout();
      // }
    },
  });
}
</script>

<template>
  <ul class="layout-header-right">
    <li><LayoutHeaderRightSearch /></li>
    <li v-if="!!appSystemSettings" @click="clickAppHandle(appSystemSettings, router)">
      <Tooltip>
        <template #title>系统设置</template>
        <Button
          :icon="h(SettingOutlined)"
          :type="route.path.includes(appSystemSettings.path) ? 'default' : 'primary'"
        />
      </Tooltip>
    </li>
    <li v-if="!!appNoticeCenter" @click="clickAppHandle(appNoticeCenter, router)">
      <Tooltip>
        <template #title>消息中心</template>
        <Button :icon="h(BellOutlined)" :type="route.path.includes(appNoticeCenter.path) ? 'default' : 'primary'" />
        <Badge :count="3" :class="['notice-center-badge']" />
      </Tooltip>
    </li>
    <li v-if="!!appTaskCenter">
      <Tooltip>
        <template #title>任务中心</template>
        <!-- `id` 属性业务端需要 -->
        <Button id="taskCenterBtn" :icon="h(CarryOutOutlined)" type="primary" />
        <Badge :dot="true" class="dot" />
      </Tooltip>
    </li>
    <li>
      <Dropdown :trigger="['click']" placement="bottom" arrow>
        <span>
          <img
            :src="userAvatar || defaultAvatar"
            :onerror="`javascript:this.src='${defaultAvatar}';this.onerror=null;`"
            width="28"
            height="28"
            class="avatar"
          />
          <span :title="userName!" class="name">{{ userName }}</span>
          <DownOutlined />
        </span>
        <template #overlay>
          <Menu>
            <MenuItem @click="router.push('/AccountSettings')">
              <i class="icon-ym icon-ym-header-userInfo"></i>
              <a href="javascript:;"> 账号设置</a>
            </MenuItem>
            <MenuDivider />
            <template v-if="!!appMyArchives">
              <MenuItem @click="router.push(appMyArchives.path)">
                <i class="icon-ym icon-ym-customForm"></i>
                <a href="javascript:;"> 我的档案</a>
              </MenuItem>
              <MenuDivider />
            </template>
            <MenuItem @click="handleLogout">
              <i class="icon-ym icon-ym-header-loginOut"></i>
              <a href="javascript:;"> 退出登录</a>
            </MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.layout-header-right {
  font-size: 14px;
  float: right;
  li {
    display: inline-block;
    margin-left: 12px;
    position: relative;
    .notice-center-badge {
      position: absolute;
      top: 12px;
      left: 16px;
      z-index: 1;
      cursor: pointer;
      :deep(sup) {
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        font-family: helvetica;
      }
      :deep(.antv-badge-multiple-words) {
        padding: 0 6px;
      }
    }
    :deep(.ant-dropdown-trigger) {
      cursor: pointer;
      .avatar {
        margin: -4px 8px 0 12px;
        border-radius: 50%;
      }
      .name {
        margin-right: 4px;
      }
    }
  }
}
</style>
