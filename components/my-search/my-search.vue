<template>
  <view class='search-box' :style="{'background':bgcolor}" @click="searchBoxHandler">
     <view class='search-item' :style="{'border-radius':radius+'px'}">
       <uni-icons type="search" size="17"></uni-icons>
       <text>搜索</text>
     </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    props:{
      bgcolor:{
        type:String,
        default:'#c00000'
      },
      radius:{
        type:Number,
        default:18
      }
      
    },
    data() {
      return {
        
      };
    },
    methods:{
      searchBoxHandler(){
        this.$emit('myclick')
      }
    }
  }
</script>

<style lang="scss">
.search-box{
  height:50px;
  box-sizing: border-box;
  padding: 6px 10px;
  .search-item{
    height:36px;
    line-height: 36px;
    background:#ffffff;
    width:100%;
    text-align:center;
    text{
      margin-left:5px;
    }
  }
}
</style>