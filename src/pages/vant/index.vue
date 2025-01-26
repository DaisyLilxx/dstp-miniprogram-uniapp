<template>
  <view style="padding: 20px">
    <uv-button type="primary" text="确定"></uv-button>
    <uv-button type="primary" :plain="true" text="镂空"></uv-button>
    <uv-button
      type="primary"
      :plain="true"
      :hairline="true"
      text="细边"
    ></uv-button>
    <uv-button type="primary" text="禁用"></uv-button>
    <uv-button type="primary" loading loadingText="加载中"></uv-button>
    <uv-button type="primary" icon="map" text="图标按钮"></uv-button>
    <uv-button type="primary" shape="circle" text="按钮形状"></uv-button>
    <uv-button
      text="渐变色按钮"
      color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"
    ></uv-button>
    <uv-button type="primary" size="small" text="大小尺寸"></uv-button>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

const username = ref("");
const password = ref("");
const active = ref(0);

const showToast = () => {
  uni.showToast({
    title: "点击成功",
    icon: "success",
  });
};
</script>

<style>
.container {
  padding: 16px;
}

.button-row {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

/* 修复可能的样式问题 */
:deep(.van-button) {
  margin: 5px;
}

:deep(.van-cell-group__title) {
  padding: 16px 16px 8px;
  font-weight: bold;
}
</style>
