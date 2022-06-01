<template>
  <view class='search_box'>
      <view class="">
        <uni-search-bar 
          class="uni-mt-10" 
          radius="100" 
          placeholder="搜索" 
          clearButton="none" 
          cancelButton="none" 
          @input="input"
        />
      </view>  
      <!-- 搜索建议 -->
      <view class="search_suggest" v-if="searchList.length!==0">
        <view class="suggest_item" v-for="(item,index) in searchList" :key="index" @click="gotoDetail(item.goods_id)">
          <view class="suggest_text">{{item.goods_name}}</view>  
          <uni-icons type="forward"></uni-icons>
        </view>  
      </view>  
      <!-- 搜索历史 -->
      <view class="search_history" v-else>
        <view class="search_title">
           <view class='title'>搜索历史</view>
           <uni-icons type="trash" size="17" @click='clean'></uni-icons>
        </view>
        <!-- 搜索列表 -->
        <view class="search_list">
          <uni-tag :text="item" v-for="(item,index) in historys" @click="gotoGoodsList(item)"></uni-tag>
        </view>
      </view>  
  </view>
</template>

<script>
  export default {
    data() {
      return {
          kw:'',//搜索的关键字
          timer:null,
          searchList:[],
          searchHistory:['a','b','c']//搜索历史
      };
    },
    onLoad(){
       this.searchList=JSON.parse(uni.getStorageSync('kw')|| '[]') 
    },
    computed:{
      historys(){//解决搜索历史展示顺序问题
        return [...this.searchHistory].reverse()
      }
      
    },
    methods:{
      input(val){
        clearTimeout(this.timer)
        //防抖处理
        this.timer=setTimeout(()=>{
          this.kw=val
          this.getSearchList()
        },500)
      },
      async getSearchList(){
        if(this.kw.length===0){
          this.searchList=[]
          return;
        }
        const {data:res}=await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.kw})
        this.searchList=res.message
        this.getSearchHistory()
      },
      gotoDetail(id){
        uni.navigateTo({
        	url: '/subpkg/goods-detail/goods-detail?goods_id='+id
        });
      },
      getSearchHistory(){
        this.searchHistory.push(this.kw)
        //解决关键词重复的问题
        //1.将数组转换为set对象
        const set=new Set(this.searchHistory);
        //调用set对象的delete方法
        set.delete(this.kw)
        //调用set对此昂的add方法，向set中添加元素
        set.add(this.kw)
        //将set对象转为arr数组
        this.history=Array.from(set)
        //对数据进行持久化存储
        uni.setStorageSync('kw',JSON.stringify( this.history));
      },
      clean(){//清空搜索历史记录
        this.searchHistory=[]
        //清空本地存储
        uni.setStorageSync('kw','[]')
      },
      //点击搜索记录项跳转到商品列表页
      gotoGoodsList(kw){
        uni.navigateTo({
          url:"/subpkg/goods-list/goods-list?query="+kw
        })
      }
    }
  }
</script>

<style lang="scss">
.search_box{
  .search_suggest{
    padding:0 5px;
    .suggest_item{
      display:flex;
      justify-content: space-between;
      padding:7px 0;
      border-bottom:1px solid #eaeaea;
      .suggest_text{
          white-space: nowrap;
                // 溢出部分隐藏
                overflow: hidden;
                // 文本溢出后，使用 ... 代替
                text-overflow: ellipsis;
                margin-right: 3px;
                color:#666666;
                font-size:14px;
      }
    }
  }
  .search_history{
    padding:5px;
    .search_title{
      display:flex;
      justify-content: space-between;
      padding:3px 0;
      border-bottom:1px solid #d8d8d8;
      .title{
        font-size:14px;
        color:#666666;
      }
    }
    .search_list{
      display:flex;
      justify-content: flex-start;
      flex-wrap:wrap;
      margin-top:10px;
      .uni-tag{
        margin-top:5px;
        margin-right:5px;
      }
    }
  }
}
</style>
