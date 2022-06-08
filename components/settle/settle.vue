<template>
  <view class="settle-box">
    <label class="radio" @click="changeAllState">
      <radio :checked='isFullChecked' color="#c00000" /><text>结算</text>
    </label>
    <!-- 合计 -->
    <view class="settle-amount">
      合计:<text class="amount">{{checkedAmount}}</text>
    </view>
    <!-- 结算 -->
    <view class="btn-settle">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  import {mapGetters,mapMutations} from 'vuex'
  export default {
    name: "settle",
    data() {
      return {

      };
    },
    computed:{
      ...mapGetters('m_cart',['checkedCount','checkedAmount','total']),
      isFullChecked(){//判断是否全选
        //如果购物车中的商品总数量与已勾选的商品总共数量相等，就是全选，否则就是非全选
      
        return this.total === this.checkedCount

      }
    },
    methods:{
      ...mapMutations('m_cart',['updateAllGoodsState']),
      changeAllState(){
        console.log(this.total)
        console.log(this.checkedCount)
        console.log(this.isFullChecked)
        this.updateAllGoodsState(!this.isFullChecked)
      }
    }
  }
</script>

<style lang="scss">
  .settle-box {
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    // background: #ccc;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index:999;
    font-size:14px;
    background:#fff;
    .radio {}

    .settle-amount {
      .amount {
        color:#c00000;
        font-weight:bold;
      }
    }

    .btn-settle {
      height:50px;
      line-height:50px;
      color:#fff;
      min-width:100px;
      padding:0 10px;
      background:#c00000;
      text-align:center;
    }
  }
</style>
