<template>
  <view>
    <!-- 搜索框 -->
    <my-search @myclick='searchBox'></my-search>
    <view class="scroll-container">
      <!-- 左侧 -->
      <scroll-view scroll-y="true" :style="{height:wh+'px'}" class="scroll-left">
        <block v-for="(value,index) in cateList">
          <view :class="index===active?'active':''" @click="addActive(index)">{{value.cat_name}}</view>
        </block>
      </scroll-view>

      <!-- 右侧 -->
      <scroll-view scroll-y="true" :style="{height:wh+'px'}" class="scroll-right" :scroll-top="scrollTop">
        <view v-for="(lv2,i2) in cateLevel2" class='cateV2' :key="i2">
          / {{lv2.cat_name}} /
          <!-- 三级分类 -->
          <view class="cateV3">
            <view class="cateV3-item" v-for="(lv3,i3) in lv2.children" :key='i3' @click='gotoGoodsList(lv3)'>
              <image :src="lv3.cat_icon || defaultPic"></image>
              <text>{{lv3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        wh: 0,
        cateList: [],
        active: 0,
        cateLevel2: [],
        scrollTop:0,
        defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    onLoad() {
      //获取手机的信息，包括品牌型号 宽度 高度vh:0
      this.wh = uni.getSystemInfoSync().windowHeight-50;
      // console.log(this.wh)
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        console.log(res)
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        console.log(res.message[0].children)
        this.cateLevel2 = res.message[0].children
      },
      addActive(index) {
        this.active = index
        // 修改cateLevel2的值
        this.cateLevel2 = this.cateList[index].children
        //点击左侧每一项都时候都让右侧回到最顶部
        //scrollTop的值不能每次都设为0.应该在0和1之间切换，1px可以忽略
        this.scrollTop=this.scrollTop===0?this.scrollTop=1:this.scrollTop=0
      },
      //去商品列表页
      gotoGoodsList(lv3){
        console.log(lv3)
        uni.navigateTo({
        	url: '/subpkg/goods-list/goods-list?cid='+lv3.cat_id
        });
      },
      searchBox(){
        uni.navigateTo({
        	url: '/subpkg/search/search'
        });
      }
    }
  }
</script>

<style lang="scss">
  .scroll-container {
    display: flex;

    .scroll-left {
      width: 120px;

      view {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #ffffff;
          position: relative;

          // 渲染激活项左侧的红色指示边线
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }

    }

    .scroll-right {
      view{
        display:inline-block;
      }
      .cateV2 {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        padding: 15px 0;
        // margin:15px 0;
        .cateV3 {
           display:flex;
           flex-wrap:wrap;
           margin-top:15px;
           // flex-direction: row;
           .cateV3-item{
             width:33.33%;
             display:flex;
             flex-direction:column;
             justify-content: center;
             align-items: center;
             image{
               width:60px;
               height:60px;
               border:1px solid #ff0000;
               margin:5px 0;
               
             }
           }

        }
      }
    }
  }
</style>
