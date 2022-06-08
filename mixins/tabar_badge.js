import {mapGetters} from 'vuex'
export default{
  computed:{//把详情页中购物车的总数量同步到购物车页面
    ...mapGetters('m_cart',['total'])
  },
  watch:{//监听badge数值的变化
    total(){//只要tota数值变化了，就重新调用函数重新渲染
      this.setBadge()
    }
  },
  onShow(){
    this.setBadge()
  },
  methods:{
    setBadge(){
      uni.setTabBarBadge({//uni.setTabBarBadge为 tabBar 某一项的右上角添加文本。
        index: 2,
        text: this.total+''
      })
    }
  }
}