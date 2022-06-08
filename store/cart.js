export default{
  namespaced:true,
  //模块的state数据
  state:()=>({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
        // 每个商品的信息对象，都包含如下 6 个属性：
        // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart:JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  mutations:{
    //添加购物车
    addToCart(state,goods){
       //先判断购物车中是否有这个商品，没有的化就添加到购物车，有的化就只更新商品数量即可
       //有的化就返回一个商品对象，没有的话就返回undefined
       const result=state.cart.find(item=>item.goods_id===goods.goods_id)
       
       if(!result){//没有
         state.cart.push(goods)
       }else{//有
         result.goods_count++
       }
       //调用saveToStorage方法
       this.commit('m_cart/saveToStorage')
    },
    saveToStorage(state){//持久化存储购物车中的数据
      uni.setStorageSync('cart', JSON.stringify(state.cart));
    },
    updateGoodsStatus(state,goods){//更新商品的勾选状态
      const findResult=state.cart.find(x=>x.goods_id===goods.goods_id)
      if(findResult){
         findResult.goods_state=goods.goods_state
         //持久化存储
         this.commit('m_cart/saveToStorage')
      }
    },
    updateGoodsCount(state,goods){
       const findResult=state.cart.find(x=>x.goods_id===goods.goods_id)
       if(findResult){
          findResult.goods_count=goods.goods_count
          //持久化存储
          this.commit('m_cart/saveToStorage')
       }
    },
    deleteGoodsItem(state,goods_id){
      state.cart=state.cart.filter(x=>x.goods_id!==goods_id)
     console.log(state.cart)
      //持久化存储
      this.commit('m_cart/saveToStorage')
    },
    //实现商品的全选与反选
    updateAllGoodsState(state,newState){
      state.cart.forEach(item=>item.goods_state===newState)
      //持久化存储
      this.commit('m_cart/saveToStorage')
    }
  },
  getters:{
    //统计购物车中商品的总数量
    total(state){
      var c=0;
      state.cart.forEach((item)=>{
          c+=item.goods_count
      })
      console.log(c)
      return c;
    },
    //动态渲染已勾选商品的数量
    checkedCount(state){
      var count=0;
      state.cart.forEach(item=>{
        if(item.goods_state){
          count+=item.goods_count;
        }
      })
      // console.log(count)
      return count;
    },
    //动态渲染所有勾选商品的总金额
    checkedAmount(state){
      var totalamount=0;
      state.cart.forEach(item=>{
        if(item.goods_state){
          totalamount+=item.goods_price
        }
      })
      return totalamount;
    }
  }
}