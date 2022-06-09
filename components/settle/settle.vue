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
    <view class="btn-settle" @click="settlement">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    name: "settle",
    data() {
      return {

      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'checkedAmount', 'total']),
      ...mapGetters('m_user', ['rcvAddress']),
      ...mapState('m_cart', ['token']),
      ...mapState('m_cart', ['cart']),
      isFullChecked() { //判断是否全选
        //如果购物车中的商品总数量与已勾选的商品总共数量相等，就是全选，否则就是非全选
        return this.total === this.checkedCoun
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      changeAllState() {
        this.updateAllGoodsState(!this.isFullChecked)
      },
      settlement() {
        //判断是否勾选了商品
        if (!this.checkedCount) {
          uni.showToast({
            title: '请勾选商品~~~',
            duration: 2000,
            icon: 'none'
          })
          return;
        };
        //判断是否选了收获地址
        if (!this.rcvAddress) {
          uni.showToast({
            title: '请选择收获地址~~~',
            duration: 2000,
            icon: 'none'
          })
          return;
        }
        // 判断是否登录了
        // if (!this.token) {
        //   uni.showToast({
        //     title: '请登录~~~',
        //     duration: 2000,
        //     icon: 'none'
        //   })
        //   return;
        // }
        //调用支付
        this.payOrder()
      },
      async payOrder() {
        const orderInfo = {
          order_price: 0.01,
          consignee_addr: this.rcvAddress,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        //发起请求创建订单
        const {data:res}=await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        console.log(res)
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
          // 1.3 得到服务器响应的“订单编号”
          const orderNumber = res.message.order_number
        
        // 2. 订单预支付
          // 2.1 发起请求获取订单的支付信息
          const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
          // 2.2 预付订单生成失败
          if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
          // 2.3 得到订单支付相关的必要参数
          const payInfo = res2.message.pay
          
          //发起微信支付
          // 3.1 调用 uni.requestPayment() 发起微信支付
             const [err, succ] = await uni.requestPayment(payInfo)
             // 3.2 未完成支付
             if (err) return uni.$showMsg('订单未支付！')
             // 3.3 完成了支付，进一步查询支付的结果
             const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
             // 3.4 检测到订单未支付
             if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
             // 3.5 检测到订单支付完成
             uni.showToast({
               title: '支付完成！',
               icon: 'success'
             })
          
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
    z-index: 999;
    font-size: 14px;
    background: #fff;

    .radio {}

    .settle-amount {
      .amount {
        color: #c00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      height: 50px;
      line-height: 50px;
      color: #fff;
      min-width: 100px;
      padding: 0 10px;
      background: #c00000;
      text-align: center;
    }
  }
</style>
