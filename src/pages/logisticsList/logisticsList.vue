<template>
  <view class="container">
    <!-- 顶部筛选器 -->
    <view class="filter-tabs">
      <uv-drop-down>
        <uv-drop-down-item
          v-model="typeValue"
          title="类型"
          :options="typeOptions"
        ></uv-drop-down-item>
        <uv-drop-down-item
          v-model="dateValue"
          title="单据时间"
          :options="dateOptions"
        ></uv-drop-down-item>
        <uv-drop-down-item
          v-model="customerValue"
          title="客户"
          :options="customerOptions"
        ></uv-drop-down-item>
      </uv-drop-down>
    </view>

    <!-- 列表内容 -->
    <scroll-view 
      scroll-y 
      class="list-container"
      :style="{ height: `calc(100vh - ${dropDownHeight}px)` }"
    >
      <view 
        v-for="(item, index) in listData" 
        :key="index" 
        class="list-item"
      >
        <view class="item-row">
          <text class="label">单据号</text>
          <text class="value highlight">{{ item.documentNo }}</text>
        </view>
        <view class="item-row">
          <text class="label">提运单号</text>
          <text class="value">{{ item.transportNo }}</text>
        </view>
        <view class="item-row">
          <text class="label">客户名称</text>
          <text class="value">{{ item.customerName }}</text>
        </view>
        <view class="item-row">
          <text class="label">录入时间</text>
          <text class="value">{{ item.entryTime }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 悬浮按钮 -->
    <view class="float-btn">
      <uv-icon name="plus" color="#FFFFFF" size="24"></uv-icon>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// 筛选值
const typeValue = ref('');
const dateValue = ref('');
const customerValue = ref('');
const dropDownHeight = ref(44); // 下拉菜单高度，默认44px

// 类型选项
const typeOptions = [
  { text: '全部类型', value: '' },
  { text: '类型一', value: '1' },
  { text: '类型二', value: '2' },
  { text: '类型三', value: '3' }
];

// 日期选项
const dateOptions = [
  { text: '全部时间', value: '' },
  { text: '今天', value: 'today' },
  { text: '本周', value: 'week' },
  { text: '本月', value: 'month' },
  { text: '本年', value: 'year' }
];

// 客户选项
const customerOptions = [
  { text: '全部客户', value: '' },
  { text: '客户A', value: 'A' },
  { text: '客户B', value: 'B' },
  { text: '客户C', value: 'C' }
];

// 计算当前选中的显示文本
const currentType = computed(() => {
  const selected = typeOptions.find(item => item.value === typeValue.value);
  return selected ? selected.text : '类型';
});

const currentDate = computed(() => {
  const selected = dateOptions.find(item => item.value === dateValue.value);
  return selected ? selected.text : '单据时间';
});

const currentCustomer = computed(() => {
  const selected = customerOptions.find(item => item.value === customerValue.value);
  return selected ? selected.text : '客户';
});

// watch选择变化
watch([typeValue, dateValue, customerValue], ([newType, newDate, newCustomer]) => {
  console.log('类型:', newType);
  console.log('日期:', newDate);
  console.log('客户:', newCustomer);
});

// 列表数据
const listData = ref([
  {
    documentNo: 'EP202405311501001',
    transportNo: 'TSLGZP24040011045',
    customerName: '某二股份有限公司',
    entryTime: '2024-9-26 10:22:11'
  },
  {
    documentNo: 'EP202405311501001',
    transportNo: 'TSLGZP24040011045',
    customerName: '某二股份有限公司',
    entryTime: '2024-9-26 10:22:11'
  },
  {
    documentNo: 'EP202405311501001',
    transportNo: 'TSLGZP24040011045',
    customerName: '某二股份有限公司',
    entryTime: '2024-9-26 10:22:11'
  },
  {
    documentNo: 'EP202405311501001',
    transportNo: 'TSLGZP24040011045',
    customerName: '某二股份有限公司',
    entryTime: '2024-9-26 10:22:11'
  }
]);
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F5F7FA;
  padding-bottom: 30rpx;
}

.filter-tabs {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #FFFFFF;
}

:deep(.uv-drop-down) {
//   &__menu {
//     &__item {
//       font-size: 28rpx;
//       color: #666666;
      
//       &--active {
//         color: #1890FF;
//       }
//     }
//   }

//   &__title {
//     font-size: 28rpx;
//     color: #333333;
//   }
}

.list-container {
  height: calc(100vh - 88rpx);
  padding: 20rpx;
}

.list-item {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .item-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      font-size: 28rpx;
      color: #666666;
    }

    .value {
      font-size: 28rpx;
      color: #333333;

      &.highlight {
        color: #1890FF;
      }
    }
  }
}

.float-btn {
  position: fixed;
  right: 30rpx;
  bottom: 40rpx;
  width: 100rpx;
  height: 100rpx;
  background: #1890FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(24, 144, 255, 0.35);
  z-index: 99;
}
</style> 