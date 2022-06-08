<template>
  <view class="cart-box" v-if="cart.length!==0">
    <my-address></my-address>

    <view class="cartbox">
      <view class="cartTitle">
        <uni-icons type="shop" size="18"></uni-icons>
        <view class="cart_title_text">购物车</view>
      </view>
      <view class="cart">
        <uni-swipe-action>
          <view class="cart_item" v-for="(c,index) in cart" :key="index">
            <uni-swipe-action-item :right-options="options" @click="deleteGoods(c)">
              <goods :goods="c" :showRadio=true :showNumBox=true @radio_click="radioClick" @changeNum="changeNum">
              </goods>
            </uni-swipe-action-item>
          </view>
        </uni-swipe-action>
      </view>
    </view>
    <!-- 结算区 -->
    <settle></settle>
  </view>
  <!-- 空白购物车 -->
  <view class="emptyCart" v-else>
    <image src="../../static/emptyCart.gif"></image>
    <view class="emptyCart_text">空空如也</view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'
  import badgeMix from '../../mixins/tabar_badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        options: [{
            text: '删除',
            style: {
              backgroundColor: '#c00000'
            }
          }

        ]
      };
    },
    computed: {
      ...mapState('m_cart', ['cart']),
      ...mapGetters('m_cart', ['checkedCount', 'checkedAmount'])
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsStatus', 'updateGoodsCount', 'deleteGoodsItem']),
      radioClick(e) {
        this.updateGoodsStatus(e)
      },
      changeNum(e) {
        this.updateGoodsCount(e)
      },
      deleteGoods(goods) {
        this.deleteGoodsItem(goods.goods_id)
      }
    }


  }
</script>

<style lang="scss">
  .cart-box {
    padding-bottom: 50px;

    .cartbox {
      .cartTitle {
        padding-left: 5px;
        display: flex;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #cccccc;

        .cart_title_text {
          margin-left: 8px;
        }
      }
    }
  }
    .emptyCart {
      width: 100%;
      height: 100%;
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position:absolute;
      top:0;
      bottom:0;
      left:0;
      right:0;
      &>image{
        
      }
      .emptyCart_text{
        width:100%;
        height:100%;
       
        text-align:center;
        font-weight:20px;
        font-weight:bold;
      }
    }
  
</style>
