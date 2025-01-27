<template>
  <view class="container">
    <!-- 顶部Logo区域 -->
    <view class="header">
      <image class="logo" src="/static/bigLogo.png" mode="aspectFit"></image>
    </view>
    <view class="mainBlock">
    <!-- 日期和客户选择区域 -->
    <view class="selector-area">
      <view class="selector-row">
        <!-- <view class="selector-item" @click="openDatePicker">
          <text class="selector-text">{{ dateRange }}</text>
          <uni-icons type="calendar" size="16" color="#666666"></uni-icons>
        </view> -->
        <view>
           <!-- 日期选择器 -->
    <uni-datetime-picker
      ref="datePickerRef"
      type="daterange"
      v-model="range"
      @change="onDateConfirm"
      rangeSeparator="至"
    />
        </view>
        <view class="divider"></view>
        <view class="selector-item" @click="openCustomerPicker">
          <text class="selector-text">{{ selectedCustomer || '请选择客户' }}</text>
          <uni-icons type="bottom" size="16" color="#666666"></uni-icons>
        </view>
      </view>
    </view>
    <!-- 客户选择器 -->
    <uni-popup ref="popupRef" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text @click="cancelSelect">取消</text>
          <text @click="confirmSelect">确定</text>
        </view>
        <picker-view
          :indicator-style="'height: 50px;'"
          :value="pickerValue"
          @change="pickerChange"
          class="picker-view"
        >
          <picker-view-column>
            <view class="item" v-for="(item, index) in customerOptions" :key="index">
              {{ item.text }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </uni-popup>
    <!-- 数据卡片网格 -->
    <view class="grid-container">
      <view v-for="(item, index) in statsData" :key="index" class="grid-item">
        <view :class="['stat-card', { 'active': index === 0 }]">
          <text class="stat-title">{{ item.title }}</text>
          <view class="stat-value">
            <text class="number">{{ formatNumber(item.value) }}</text>
            <text class="unit">单</text>
          </view>
          <view v-if="index === 0" class="card-border"></view>
        </view>
      </view>
    </view>

    <!-- 图表区域 -->
    <view class="chart-section">
      <view class="chart-header">
        <text class="unit-text">单位：单</text>
        <view class="legend">
          <view class="legend-item">
            <view class="legend-color blue"></view>
            <text>进口</text>
          </view>
          <view class="legend-item">
            <view class="legend-color yellow"></view>
            <text>出口</text>
          </view>
        </view>
      </view>
      <view class="charts-box">
        <canvas type="2d" canvas-id="column-dom" id="column-dom" class="charts" @touchstart="tap" />
      </view>
    </view>
  </view>

    <!-- 悬浮按钮 -->
    <view class="float-btn">
      <!-- <uv-icon name="plus" color="#FFFFFF" size="24"></uv-icon> -->
    </view>

    <!-- 底部导航栏 -->
    <view class="tabbar">
      <view class="tab-item active">
        <text class="iconfont icon-home"></text>
        <text>首页</text>
      </view>
      <view class="tab-item">
        <text class="iconfont icon-user"></text>
        <text>我的</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import UCharts from '@qiun/ucharts';

// 统计数据
const statsData = ref([
  { title: '物流单据', value: 13560 },
  { title: '物流单据', value: 13560 },
  { title: '物流单据', value: 13560 }
]);

// 底部导航当前索引
const tabbarIndex = ref(0);

let columnChart: any = null;

const chartData = {
  categories: ['24-6', '24-7', '24-8', '24-9', '24-10', '24-11', '24-12'],
  series: [
    {
      name: '进口',
      data: [600, 500, 500, 470, 550, 600, 450]
    },
    {
      name: '出口',
      data: [300, 250, 280, 250, 300, 320, 280]
    }
  ]
};



const opts = {
  type: 'column',
  padding: [15, 15, 0, 15],
  legend: {
    show: false
  },
  color: ['#1890FF', '#FFA940'],
  xAxis: {
    disableGrid: true,
    fontSize: 12,
    color: '#999999'
  },
  yAxis: {
    gridType: 'dash',
    splitNumber: 4,
    min: 0,
    max: 800,
    fontSize: 12,
    color: '#999999'
  },
  extra: {
    column: {
      type: 'group',
      width: 20,
      activeBgColor: '#000000',
      activeBgOpacity: 0.08
    }
  }
};

// 点击事件（如果需要）
const tap = (e: any) => {
  columnChart.touchLegend(e);
  columnChart.showToolTip(e);
};

// 初始化图表
const initChart = () => {
  const query = uni.createSelectorQuery();
  query.select('#column-dom')
    .fields({ node: true, size: true })
    .exec((res) => {
      if (res[0]) {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        canvas.width = res[0].width * uni.getSystemInfoSync().pixelRatio;
        canvas.height = res[0].height * uni.getSystemInfoSync().pixelRatio;
        
        columnChart = new UCharts({
          canvasId: 'column-dom',
          canvas2d: true,  // 启用canvas2d
          context: ctx,    // 传入上下文
          type: 'column',
          fontSize: 11,
          legend: opts.legend,
          background: '#FFFFFF',
          pixelRatio: uni.getSystemInfoSync().pixelRatio,
          categories: chartData.categories,
          series: chartData.series,
          animation: true,
          width: res[0].width,
          height: res[0].height,
          padding: opts.padding,
          xAxis: opts.xAxis,
          yAxis: opts.yAxis,
          extra: opts.extra
        });
      }
    });
};

// 引用组件实例
const datePickerRef = ref<any>(null);
const popupRef = ref<any>(null);
const range = ref(['2021-02-1', '2021-3-28']);
// 日期选择相关
const startDate = ref('2024-12-01');
const endDate = ref('2024-12-31');
const dateRange = computed(() => `${startDate.value}至${endDate.value}`);

// 客户选择相关
const pickerValue = ref([0]);
const selectedCustomer = ref('');
const customerOptions = [
  { text: '全部客户', value: '' },
  { text: '客户A', value: 'A' },
  { text: '客户B', value: 'B' },
  { text: '客户C', value: 'C' }
];

// 打开日期选择器
const openDatePicker = () => {
  datePickerRef.value?.show();
};

// 打开客户选择器
const openCustomerPicker = () => {
  popupRef.value?.open();
};

// 日期选择回调
const onDateConfirm = (e: any) => {
  if (Array.isArray(e)) {
    const [start, end] = e;
    startDate.value = start;
    endDate.value = end;
  }
};

// 选择器变化事件
const pickerChange = (e: any) => {
  pickerValue.value = e.detail.value;
};

// 确认选择
const confirmSelect = () => {
  const index = pickerValue.value[0];
  selectedCustomer.value = customerOptions[index].text;
  popupRef.value?.close();
};

// 取消选择
const cancelSelect = () => {
  popupRef.value?.close();
};

// 单元格标题样式
const titleStyle = {
  fontSize: '28rpx',
  color: '#333333'
};

// 格式化数字，添加千分位
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

onMounted(() => {
  initChart();
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F5F7FA;
  padding-bottom: 120rpx;
  padding: 18rpx;
  border-radius: 20rpx;
  padding-bottom: 100rpx;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  margin-bottom: 18rpx;

  .logo {
    width: 100%;
    height: 320rpx;
  }

  .sub-logo {
    width: 120rpx;
    height: 60rpx;
  }
}
.mainBlock{
  background: #FFFFFF;
  border-radius: 12rpx;
  padding: 18rpx 23rpx;
}
.selector-area {
  .selector-row {
    display: flex;
    align-items: center;
    background: #FFFFFF;
    border-radius: 8rpx;

    .selector-item {
      flex: 1;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20rpx;

      .selector-text {
        font-size: 28rpx;
        color: #333333;
      }

      &:active {
        opacity: 0.7;
      }
    }

    .divider {
      width: 1rpx;
      height: 40rpx;
      background-color: #EBEEF5;
      margin: 0 20rpx;
    }
  }
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30rpx;
  margin: 18rpx 0;
}

.stat-card {
  background-color: #FFFFFF;
  padding: 27rpx 0 33rpx;
  border-top: 6rpx solid #0096FF;
  box-shadow: 0px 0px 10rpx 0px rgba(3,0,0,0.31);
  border-radius: 10rpx;
  text-align: center;

  .stat-title {
    font-size: 26rpx;
    color: #000;
    line-height: 24rpx;
  }

  .stat-value {
    margin-top: 12rpx;
    color: #0096FF;
    .number {
      font-size: 40rpx;
      font-weight: bold;
      line-height: 31rpx;
    }
    .unit {
      font-size: 26rpx;
    }
  }
}

.chart-section {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 30rpx;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .unit-text {
      font-size: 24rpx;
      color: #999999;
    }

    .legend {
      display: flex;
      gap: 30rpx;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .legend-color {
          width: 28rpx;
          height: 12rpx;
          border-radius: 6rpx;

          &.blue {
            background-color: #1890FF;
          }

          &.yellow {
            background-color: #FFA940;
          }
        }

        text {
          font-size: 24rpx;
          color: #666666;
        }
      }
    }
  }

  .charts-box {
    height: 400rpx;
    width: 100%;
  }

  .charts {
    width: 100%;
    height: 100%;
  }
}

.float-btn {
  position: fixed;
  right: 30rpx;
  bottom: 140rpx; // 保持在底部导航栏上方
  width: 79rpx;
  height: 79rpx;
  background: url('../../static/add.png') no-repeat center center;
  background-size: 100% 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(24, 144, 255, 0.35);
  z-index: 99;
}

.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #FFFFFF;
  display: flex;
  border-top: 1rpx solid #EBEEF5;

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    color: #999999;
    gap: 6rpx;

    &.active {
      color: #1890FF;
    }

    .iconfont {
      font-size: 40rpx;
    }
  }
}

.popup-content {
  background-color: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #EBEEF5;
  
  text {
    font-size: 32rpx;
    color: #333333;
    padding: 10rpx;
    
    &:active {
      opacity: 0.7;
    }
  }
}

.picker-view {
  width: 100%;
  height: 400rpx;
}

.item {
  line-height: 50px;
  text-align: center;
  font-size: 28rpx;
  color: #333333;
}
</style>
