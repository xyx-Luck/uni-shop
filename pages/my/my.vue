<template>
  <view>
    <!-- 判断是否有token显示不同的页面 -->
    <my-login v-if="!token"></my-login>
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
  import {mapState} from 'vuex'
  import badgeMix from '../../mixins/tabar_badge.js'
  export default {
    mixins:[badgeMix],
    data() {
      return {
      };
    },
    computed:{
      ...mapState('m_cart',['token'])
    }
  }
</script>

<style lang="scss">

</style>
