<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <my-search @myclick='gotoSearch'></my-search> 
    </view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <navigator :url="'/subpkg/goods-detail/goods-detail?goods_id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 商品分类 -->
    <view class='nav-list'>
      <view v-for="(nav,index) in navList" :key='index' class='nav-item' @click="navClickHandler(nav)">
        <image :src="nav.image_src" class="nav-img"></image>
      </view>
    </view>
    <!-- 楼层 -->
    <view class='floor'>
      <view class='floor-item' v-for="(floor,index) in floorList" :key='index'>
        <!-- 楼层标题 -->
        <image :src="floor.floor_title.image_src" mode="" class='floor-title'></image>
        <view class='img-box'>
          <!-- 左侧 -->
          <navigator :url="floor.product_list[0].url">
            <image :src="floor.product_list[0].image_src" :style="{width:floor.product_list[0].image_width+'rpx'}"
              mode='widthFix'>
          </navigator>

          <!-- 右侧 -->
          <view class='right-img-box' >
            <navigator 
              :url="img.url" 
              v-for="(img,i) in floor.product_list" 
              :key="i" v-if="i!==0">
              <image :src="img.image_src" :style="{width:img.image_width-2+'rpx'}" mode='widthFix'></image>
            </navigator>
          </view>  
        </view>
      </view>
    </view>
  </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        swiperList: [],
        navList: [],
        floorList: [] //楼层数据
      };
    },
    onLoad() {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.swiperList = res.message
        uni.$showMsg('获取成功')
      },
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        this.navList = res.message
      },
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) return uni.$showMsg('数据加载失败')
        //实现点击每一个图片跳转到对应的列表
        // 接口返回的navigator_url和我们创建的页面的名字不一样，所以赋值之前先给每个数据中添加一个我们自定义的url
        res.message.forEach((item) => {
          item.product_list.forEach(i => {
            i.url = '/subpkg/goods-list/goods-list?' + i.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
        console.log(res)
      },
      navClickHandler(nav) { //点击分类第一项，跳转到分类页面
        if (nav.name == '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          });
        }
      },
      gotoSearch(){
        console.log('~~~')
        uni.navigateTo({
        	url: '/subpkg/search/search'
        });
      }
    }
  }
</script>

<style lang="scss">
  .search-box{
    position:sticky;
    top:0;
    z-index: 999;
  }
  swiper {
    height: 330rpx;

    .swiper-item,
    navigator {
      width: 100%;
      height: 100%;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor {
    .floor-item{
      margin:15rpx 0;
    }
    .img-box {
      display: flex;
      padding-left:10rpx;
    }

    navigator {
      display: inline-block;
    }

    .floor-title {
      height: 60rpx;
      width: 100%;
    }

    .right-img-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }
</style>
