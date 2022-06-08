<template>
  <view class="goods-item">

    <!-- 左 -->
    <view class='goods-box-left'>
      <!-- 控制radio的显示与隐藏 -->
      <radio :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="radioclickhandler" />
      <!-- -->
      <image :src="goods.goods_small_logo ||defaultPic "></image>
    </view>
    <!-- 右 -->
    <view class="goods-box-right">
      <vew class='goods-name'>{{goods.goods_name}}</vew>
      <view class="goods-box-right-bottom">
        <view class="goods-price">￥{{goods.goods_price | tofixed()}}</view>
        <uni-number-box 
          :value="goods.goods_count" 
          :min="1" 
          background="#cfcdc6" 
          v-if="showNumBox"
          @change="changeValue" 
        />
      </view>

    </view>

  </view>
</template>

<script>
  export default {
    name: "goods",
    props: {
      goods: {
        type: Object,
        default: {}
      },
      showRadio: {
        type: Boolean,
        default: false
      },
      showNumBox:{
        type:Boolean,
        default:false
      }
    },
    filters: {
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    },
    data() {
      return {
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
      };
    },
    methods: {
      radioclickhandler() {
        this.$emit('radio_click', {
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state,
        })
      },
      changeValue(val){
        this.$emit('changeNum',{
          goods_id:this.goods.goods_id,
          goods_count:+val,
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    padding: 3px 0;
    border-bottom: 1px solid #cccccc;
    display: flex;
    justify-content: space-between;

    .goods-box-left {
      display: flex;
      justify-content: space-around;
      align-items: center;
      // width: 120px;
      height: 100px;
      margin-right: 5px;

      image {
        width: 120px;
        height: 100px;
      }
    }

    .goods-box-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 14px;
        color: #666666;
      }

      .goods-box-right-bottom {
        display:flex;
        justify-content: space-between;
        padding-right:5px;
        .goods-price {
          color: #c00000;
          font-weight: bold;
        }
      }

    }
  }
</style>
