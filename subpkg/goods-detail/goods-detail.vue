<template>
  <view class="detail_box">
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in goodsDetail.pics" :key="index">
        <view class="swiper-item">
          <image :src="item.pics_big" @click="preview(index)"></image>
        </view>
      </swiper-item>
    </swiper>
    <!-- 信息区 -->
    <!-- 
    解决价格加载的时候闪烁undefined的问题：
      那是因为页面刚加载的时候 goodsDetail还没有值，所以会展示undefined
      我们只需要判断goodsDetail有值的时候再渲染页面即可
    -->
    <view class="detail_info" v-if="goodsDetail.goods_price" >
      <!-- 价格 -->
      <view class="info_price">￥{{goodsDetail.goods_price}}</view>
      <!-- 标题 -->
      <view class="info_main">
        <view class="info_title">{{goodsDetail.goods_name}}</view>
        <view class="info_collection">
          <uni-icons type="star" size="18"></uni-icons>
          <view class="coll_text">收藏</view>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递: 免运费 </view>
    </view>
    <!-- 图文展示区 -->
    <rich-text :nodes="goodsDetail.goods_introduce"></rich-text>
    <!-- 按钮导航 -->
    <view class="goods-carts">
      <uni-goods-nav :options="options" :fill="true" :button-group="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  import { mapState,mapMutations,mapGetters} from 'vuex'
  export default {
    computed:{
      ...mapState('m_cart',['cart']),
      ...mapGetters('m_cart',['total'])
    },
    watch:{
      total(newVal){
        const result=this.options.find((item)=>{return item.text==='购物车'})
        // const result=this.options.find((item)=>item.text==='购物车')
        console.log(result);
        if(result){
          result.info=newVal
        }
      },
      total:{
        handler(newVal){
          const result=this.options.find((item)=>{return item.text==='购物车'})
          if(result){result.info=newVal}
        },
        immediate:true
      }
    },
    data() {
      return {
        goodsDetail: [],
        options: [{
          icon: 'shop',
          text: '店铺',
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0
        }],
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#FFCD1E',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#EF1224',
            color: '#fff'
          }
        ],
      };
    },
    onLoad(options) {
      const goods_id = options.goods_id;
      this.getGoodsDetail(goods_id)
    },
    methods: {
      ...mapMutations('m_cart',['addToCart']),
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        //解决商品详情信息图图片下面右白边的问题
        // 解决 .webp 格式图片在 ios 设备上无法正常显示的问题：
        console.log(res);
        res.message.goods_introduce =
          res.message.goods_introduce.replace(/<img/g, '<img style="display:block;" ').replace(/webp/g, 'jpg')


        this.goodsDetail = res.message
      },
      preview(index) {
        console.log(index)
        uni.previewImage({
          current: index,
          urls: this.goodsDetail.pics.map(x => x.pics_big)
        })
      },
      onClick(e) {
        console.log(e)
        if(e.content.text==='购物车'){
          uni.switchTab({
            url:'/pages/cart/cart'
          })
        }
      },
      buttonClick(e) {
        console.log(e)
        if(e.content.text==='加入购物车'){
          //组织一个商品信息
          const goods={
            goods_id:this.goodsDetail.goods_id, 
            goods_name:this.goodsDetail.goods_name, 
            goods_price:this.goodsDetail.goods_price, 
            goods_count:1, 
            goods_small_logo:this.goodsDetail.goods_small_logo, 
            goods_state:true
          }
          this.addToCart(goods)
        }
      }
    }
  }
</script>

<style lang="scss">
  .detail_box{
    padding-bottom:50px;
  }
  swiper {
    height: 750rpx;

    swiper-item {
      width: 100%;
      height: 100%;

      .swiper-item {
        width: 100%;
        height: 100%;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }

  }

  .detail_info {
    padding: 20rpx 10rpx;

    .info_price {
      font-size: 18px;
      color: #c00000;
      font-weight: bold;
    }

    .info_main {
      display: flex;
      justify-content: space-between;

      .info_title {
        flex: 9;
        border-right: 1px solid #c8c8c8;
        padding-right: 10rpx;
        box-sizing: border-box;
      }

      .info_collection {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-left: 10rpx;

        .coll_text {
          font-size: 14px;
          color: #c6c6c6;
        }
      }
    }

    .yf {
      font-size: 14px;
      color: #a5a5a5;
      padding: 15rpx 0;
    }
  }
  .goods-carts{
    position:fixed;
    bottom:0;
    left:0;
    right:0;
  }
</style>
