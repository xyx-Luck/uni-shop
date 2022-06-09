<template>
  <view class="login">
      <uni-icons type="contact" size="80" class='avater'></uni-icons>
      <button class="btn-login" open-type='getUserInfo' @getuserinfo="getUserInfo">
        一键登录
      </button>
      <view class="btn-tip">登陆后尽显更多权益</view>
  </view>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
  export default {
    name:"my-login",
    data() {
      return {
        
      };
    },
    methods:{
      ...mapMutations('m_user',['updateuserinfo']),
      getUserInfo(e){
        //首先判断用户是否授权
        if(e.detail.errMsg==='getUserInfo:fail auth deny') {
          uni.showToast({
          	title: '您取消了登录授权',
          	duration: 2000,
            icon:'none'
          });
          return;
        }
        this.updateuserinfo(e.detail.userInfo)
        // console.log(e)
        this.getToken(e.detail)
      },
      async getToken(info){
        const [err,res] = await uni.login().catch(err=>err)
        if(err||res.errMsg!=='login:ok') {
          uni.showToast({
          	title: '登录失败',
          	duration: 2000,
            icon:'none'
          });
          return;
        }
        // console.log(info)
        // console.log(res.code)
        //准备参数
         const query = {
            code:res.code,
            encryptedData: info.encryptedData,
            iv: info.iv,
            rawData: info.rawData,
            signature: info.signature
          }
        
          // 换取 token
          const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
       console.log(loginResult);
      }
    }
  }
</script>

<style lang="scss">
.login{
  height:750rpx;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .btn-login{
    width:90%;
    margin:15px auto;
    background:#c00000;
    color:#fff;
  }
  .btn-tip{
    font-size:14px;
  }
}
</style>