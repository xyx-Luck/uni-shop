<template>
  <view class="goodsListBox">
    <view class="goods-list">
      <view  v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <goods :goods="goods"></goods>
      </view>
      
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        goodsList: [],
        total: 0,
        //节流处理 如果没有加载完单用户还在一直下拉，就不请求数据
        isLoading:false,//isLoading表示数据是否在加载，false表示未加载,true表示已加载
        params: {
          query: '', //关键词
          cid: '', //分类id
          pagenum: 1, //页码
          pagesize: 10 //每页显示几条数据
        }
      };
    },
    onLoad() {
      this.getGoodsList()
    },
    
    methods: {
      async getGoodsList(cb) {
        this.isLoading=true//请求之前打开
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.params)
        console.log(res);
        this.total = res.message.total
        //合并数组
        this.goodsList = [...this.goodsList,...res.message.goods]
        //请求结束后关闭
        this.isLoading=false
        cb && cb()
      },
      onReachBottom(){//上拉触底
      //判断数据是否加载完成，如果已经记载完成了就不要继续加载了
      // pagesize * pagenum >=total  就是加载完毕
      if(this.params.pagesize * this.params.pagenum >= this.total) return uni.$showMsg()
      //加载前先判断是否处于加载中，如果处于加载中就不请求数据
      if(this.isLoading) return
         //页码值加1
         this.params.pagenum+=1
         this.getGoodsList()
      },
      onPullDownRefresh(){//下拉刷新
        //重置数据
        this.params.pagenum=1;
        this.goodsList=[];
        this.total=0;
        this.isLoading=false;
        //重新请求数据:只要数据请求完毕就关闭下拉刷新
        this.getGoodsList(() => uni.stopPullDownRefresh())
      },
      gotoDetail(goods){
        uni.navigateTo({
          url:"/subpkg/goods-detail/goods-detail?goods_id="+goods.goods_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .goodsListBox {
    width: 100%;
    height: 100%;
    .goods-list {
      padding: 10px 5px;
      
    }
  }
</style>
