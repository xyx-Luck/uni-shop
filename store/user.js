export default {
  // 开启命名空间
  namespaced: true,

  // state 数据
  state: () => ({
    // 收货地址
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
  }),

  // 方法
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      //持久化存储数据
      this.commit('m_user/saveAddressToStorage')
    },
    //持久化存储数据
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
  },

  // 数据包装器
  getters: {
    rcvAddress(state){
      //判断有没有收获地址
      if(!state.address.provinceName) return '';
      return state.address.provinceName+state.address.cityName+state.address.countyName+state.address.detailInfo
    }
  },
}
