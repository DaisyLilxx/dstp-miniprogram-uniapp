<template>
  <view class="container">
    <!-- 客户信息 -->
    <view class="section">
      <view class="section-header">
        <text>客户</text>
        <text class="add-btn" @click="onAddCustomer">+ 添加客户</text>
      </view>
      <view class="form-item">
        <text class="label">单据号</text>
        <input class="input" type="text" placeholder="系统自动生成" disabled />
      </view>
      <view class="form-item">
        <text class="label">SO单号</text>
        <input class="input" v-model="formData.soNo" placeholder="请输入" />
      </view>
      <view class="form-item">
        <text class="label">船司</text>
        <input class="input" v-model="formData.company" placeholder="请输入" />
      </view>
      <view class="form-item">
        <text class="label">SO单据</text>
        <view class="upload-btn">+ 上传单据</view>
      </view>
    </view>

    <!-- 国内运输信息 -->
    <view class="section">
      <view class="section-header">
        <text>国内运输信息</text>
        <uv-icon name="arrow-up" size="16" color="#666666"></uv-icon>
      </view>
      <view class="form-group">
        <text class="label">运输车牌号</text>
        <view class="input-list">
          <view v-for="(plate, index) in formData.plateNos" :key="index" class="input-item">
            <input class="input" v-model="plate.value" placeholder="请输入" />
            <view class="delete-btn" @click="deletePlateNo(index)">
              <uv-icon name="trash" size="16" color="#999999"></uv-icon>
            </view>
          </view>
          <view class="add-btn" @click="addPlateNo">+ 添加</view>
        </view>
      </view>
      <view class="form-item">
        <text class="label">SO单据</text>
        <view class="upload-btn">+ 添加</view>
      </view>
    </view>

    <!-- 堆场装箱信息 -->
    <view class="section">
      <view class="section-header">
        <text>堆场装箱信息</text>
        <uv-icon name="arrow-up" size="16" color="#666666"></uv-icon>
      </view>
      <view class="form-item">
        <text class="label">入场时间</text>
        <view class="input" @click="showTimePicker = true">
          {{ formData.entryTime || '请选择' }}
          <uv-icon name="calendar" size="16" color="#666666"></uv-icon>
        </view>
      </view>
      <view class="form-item">
        <text class="label">SO单据</text>
        <view class="upload-btn">+ 上传单据</view>
      </view>
      <view class="form-item">
        <text class="label">装箱时间</text>
        <view class="input" @click="showTimePicker = true">
          {{ formData.packingTime || '请选择' }}
          <uv-icon name="calendar" size="16" color="#666666"></uv-icon>
        </view>
      </view>
      <view class="form-item">
        <text class="label">装箱时间</text>
        <view class="input" @click="showTimePicker = true">
          {{ formData.packingEndTime || '请选择' }}
          <uv-icon name="calendar" size="16" color="#666666"></uv-icon>
        </view>
      </view>
    </view>

    <!-- 报关信息 -->
    <view class="section">
      <view class="section-header">
        <text>报关信息</text>
        <uv-icon name="arrow-up" size="16" color="#666666"></uv-icon>
      </view>
      <view class="form-item">
        <text class="label">报关单号</text>
        <input class="input" v-model="formData.customsNo" placeholder="请输入" />
      </view>
    </view>

    <!-- 货物清单信息 -->
    <view class="section">
      <view class="section-header">
        <text>货物清单信息</text>
        <uv-icon name="arrow-up" size="16" color="#666666"></uv-icon>
      </view>
      <view class="form-item">
        <text class="label">提单单号</text>
        <input class="input" v-model="formData.blNo" placeholder="请输入" />
      </view>
      <view class="goods-list">
        <view class="goods-item" v-for="(item, index) in formData.goodsList" :key="index">
          <view class="goods-row">
            <text>集装箱号</text>
            <text>柜型</text>
            <text>货物名称</text>
            <text>数量</text>
            <text class="delete-column">操作</text>
          </view>
          <view class="goods-row">
            <input v-model="item.containerNo" placeholder="请输入" />
            <input v-model="item.containerType" placeholder="请输入" />
            <input v-model="item.goodsName" placeholder="请输入" />
            <input v-model="item.quantity" placeholder="请输入" type="number" />
            <view class="delete-btn" @click="deleteGoods(index)">
              <uv-icon name="trash" size="16" color="#999999"></uv-icon>
            </view>
          </view>
        </view>
        <view class="add-goods" @click="addGoods">+ 添加</view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-btns">
      <button class="btn outline" @click="onLogisticsMap">物流图谱</button>
      <button class="btn cancel" @click="onCancel">取消</button>
      <button class="btn submit" @click="onSubmit">提交</button>
    </view>

    <!-- 时间选择器 -->
    <uv-datetime-picker
      v-model="showTimePicker"
      :value="currentTime"
      @confirm="onTimeConfirm"
      @cancel="showTimePicker = false"
    ></uv-datetime-picker>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 表单数据
const formData = ref({
  soNo: '',
  company: '',
  plateNos: [{ value: '' }],
  entryTime: '',
  packingTime: '',
  packingEndTime: '',
  customsNo: '',
  blNo: '',
  goodsList: [
    {
      containerNo: '',
      containerType: '',
      goodsName: '',
      quantity: ''
    }
  ]
});

// 时间选择器
const showTimePicker = ref(false);
const currentTime = ref('');

// 添加货物
const addGoods = () => {
  formData.value.goodsList.push({
    containerNo: '',
    containerType: '',
    goodsName: '',
    quantity: ''
  });
};

// 添加客户
const onAddCustomer = () => {
  uni.showToast({
    title: '添加客户',
    icon: 'none'
  });
};

// 时间选择确认
const onTimeConfirm = (e: any) => {
  currentTime.value = e.value;
  showTimePicker.value = false;
};

// 取消
const onCancel = () => {
  uni.navigateBack();
};

// 提交
const onSubmit = () => {
  console.log('提交数据:', formData.value);
};

// 删除货物
const deleteGoods = (index: number) => {
  if (formData.value.goodsList.length === 1) {
    uni.showToast({
      title: '至少保留一项',
      icon: 'none'
    });
    return;
  }
  formData.value.goodsList.splice(index, 1);
};

// 添加车牌号
const addPlateNo = () => {
  formData.value.plateNos.push({ value: '' });
};

// 删除车牌号
const deletePlateNo = (index: number) => {
  if (formData.value.plateNos.length === 1) {
    uni.showToast({
      title: '至少保留一项',
      icon: 'none'
    });
    return;
  }
  formData.value.plateNos.splice(index, 1);
};

// 物流图谱
const onLogisticsMap = () => {
  uni.showToast({
    title: '查看物流图谱',
    icon: 'none'
  });
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F5F7FA;
  padding-bottom: 120rpx;
}

.section {
  margin: 20rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;

    .add-btn {
      font-size: 28rpx;
      color: #1890FF;
      font-weight: normal;
    }
  }
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;

  &:last-child {
    margin-bottom: 0;
  }

  &.add-item {
    cursor: pointer;
    
    &:active {
      opacity: 0.7;
    }
  }

  .label {
    width: 180rpx;
    font-size: 28rpx;
    color: #666666;
  }

  .input {
    flex: 1;
    height: 64rpx;
    background: #F5F7FA;
    border-radius: 6rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:disabled {
      color: #999999;
    }
  }

  .delete-btn {
    width: 80rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:active {
      opacity: 0.7;
    }
  }

  .add-btn {
    flex: 1;
    height: 64rpx;
    background: #F5F7FA;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #1890FF;
  }

  .upload-btn {
    width: 160rpx;
    height: 64rpx;
    background: #F5F7FA;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #1890FF;
  }
}

.goods-list {
  .goods-item {
    margin-bottom: 20rpx;
    padding: 20rpx;
    background: #F5F7FA;
    border-radius: 6rpx;

    .goods-row {
      display: grid;
      grid-template-columns: 2fr 1fr 2fr 1fr 60rpx;
      gap: 20rpx;
      margin-bottom: 20rpx;

      &:last-child {
        margin-bottom: 0;
      }

      text {
        font-size: 24rpx;
        color: #666666;

        &.delete-column {
          text-align: center;
        }
      }

      input {
        height: 64rpx;
        background: #FFFFFF;
        border-radius: 6rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
      }

      .delete-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64rpx;
        
        &:active {
          opacity: 0.7;
        }
      }
    }
  }

  .add-goods {
    height: 80rpx;
    background: #F5F7FA;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #1890FF;
  }
}

.bottom-btns {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 20rpx;
  background: #FFFFFF;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);

  .btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    margin: 0 20rpx;

    &.outline {
      background: #FFFFFF;
      color: #1890FF;
      border: 2rpx solid #1890FF;
    }

    &.cancel {
      background: #F5F7FA;
      color: #666666;
    }

    &.submit {
      background: #1890FF;
      color: #FFFFFF;
    }
  }
}

.form-group {
  display: flex;
  margin-bottom: 30rpx;

  .label {
    width: 180rpx;
    font-size: 28rpx;
    color: #666666;
    padding-top: 16rpx;
  }

  .input-list {
    flex: 1;

    .input-item {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .input {
        flex: 1;
        height: 64rpx;
        background: #F5F7FA;
        border-radius: 6rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
      }

      .delete-btn {
        width: 80rpx;
        height: 64rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:active {
          opacity: 0.7;
        }
      }
    }

    .add-btn {
      height: 64rpx;
      background: #F5F7FA;
      border-radius: 6rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      color: #1890FF;
      
      &:active {
        opacity: 0.7;
      }
    }
  }
}
</style> 