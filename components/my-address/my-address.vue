<template>
  <view class="address">
    <!-- 添加地址 -->
    <view class="address-choose" v-if="JSON.stringify(address)==='{}' || JSON.stringify(address)==='undefined'">
      <button type="primary" size="mini" @click="chooseAddress">添加收获地址+</button>
    </view>
    <!-- 地址详情 -->
    <view class="address_info" v-else @click="chooseAddress">
       <view class="row1">
         <view class="username">
            <view>收货人: {{address.userName}}</view>
         </view>
         <view class="phone">
           <view>电话: {{address.telNumber}}</view>
           <uni-icons type="forward" size="18"></uni-icons>
         </view>
       </view>
       <view class="row2">
         <view class="row2-left">收货地址:</view> 
         <view class="row2-right">
            {{rcvAddress}}
         </view>
       </view>   
    </view>
   <view class="border-image"></view> 
  </view>
</template>

<script>
  import { mapState, mapMutations,mapGetters} from 'vuex'
  export default {
    name: "my-address",
    data() {
      return {
          // address:{}
      };
    },
    computed:{
      ...mapState('m_user', ['address']),
      ...mapGetters('m_user',['rcvAddress'])
    },
    methods:{
      ...mapMutations('m_user',['updateAddress']),
      // 选择收货地址
        async chooseAddress() {
          // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
          //    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
          const [err, succ] = await uni.chooseAddress().catch(err => err)
      
          // 2. 用户成功的选择了收货地址
          if (err === null && succ.errMsg === 'chooseAddress:ok') {
            // 为 data 里面的收货地址对象赋值
            // this.address = succ
            console.log(succ);
            this.updateAddress(succ)
          }
          
          console.log(err)
        }
    }
  }
</script>

<style lang="scss">
  .address {
    // height: 90px;
    .address-choose{
      width:100%;
      height:90px;
      display:flex;
      justify-content: center;
      align-items: center;
    }
    .address_info{
      padding:10px 5px;
      .row1{
        display:flex;
        justify-content: space-between;
        .phone{
          display:flex;
          justify-content: flex-start;
        }
      }
      .row2{
        display:flex;
        // justify-content: space-between;
        align-items: center;
        margin-top:10px;
        .row2-left{
          white-space: nowrap;
          margin-right:5px;
        }
      }
    }
    .border-image{
      width:100%;
      height:8px;
      background:linear-gradient(#bcff92,#fdffcd);
    }
  }
</style>
