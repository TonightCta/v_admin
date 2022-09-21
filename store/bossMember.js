import { bossMember } from "~/api"
import config from "~/config"

export const state = () => ({
  user: {},
  accountInfo: {},
  walletInfo: [],
  is_register_join: false
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setAccountInfo(state, account) {
    state.accountInfo = account
  },
  setWalletInfo(state, wallet) {
    state.walletInfo = wallet
  },
  changeRegisterJoin(state) {
    state.is_register_join = !state.is_register_join
  }
}

export const actions = {
  changeRegisterJoin({ commit }) {
    commit('changeRegisterJoin')
  },
  // 查询用户信息
  queryUserInfo: async ({ commit }, params) => {
    params = {
      userId: window.sessionStorage.getItem('userId')
    }
    let res = await bossMember.queryUserInfo(params)
    if (res.code == '200') {
      commit('setUser', res.data.userLoginInfo)
      commit('setAccountInfo', res.data.accountInfo)
      commit('setWalletInfo', res.data.walletInfo)
    }
    return res
  },
  // 登录
  login: async ({ commit }, params) => {
    params.clientId = config.client.clientId
    params.clientSecret = config.client.clientSecret
    let res = await bossMember.loginToken(params)
    if (res.code == '200') {
      window.sessionStorage.setItem('TOKEN', res.data.token_type + ' ' + res.data.access_token)
      window.sessionStorage.setItem('refreshToken', res.data.token_type)
      window.sessionStorage.setItem('userId', res.data.userId)
      window.sessionStorage.setItem('enterpriseManagerId', res.data.enterpriseManagerId)
      window.sessionStorage.setItem('enterpriseMemberId', res.data.enterpriseMemberId)
      commit('setUser', res.data.userLoginInfo)
      commit('setWalletInfo', res.data.walletInfo)
    }
    return res
  },
  // 注册
  register: async ({ commit }, params) => {
    let res = await bossMember.register(params)
    return res
  },
  // 发验证码
  sendVerifyCode: async ({ commit }, params) => {
    let res = await bossMember.sendVerifyCode(params)
    return res
  },
  // 验证验证码
  checkVerifyCode: async ({ commit }, params) => {
    let res = await bossMember.checkVerifyCode(params)
    return res
  },
  // 设置交易密码
  setTransPwd: async ({ commit }, params) => {
    let res = await bossMember.setTransPwd(params)
    return res
  },
  // 重置登录密码
  resetLoginPwd: async ({ commit }, params) => {
    let res = await bossMember.resetLoginPwd(params)
    return res
  },
  // 修改登录/交易密码
  updatePwd: async ({ commit }, params) => {
    params.userId = window.sessionStorage.getItem('userId')
    let res = await bossMember.updatePwd(params)
    return res
  },
  // 注销
  logout: async ({ commit }, params = {}) => {
    window.sessionStorage.removeItem('TOKEN')
    window.sessionStorage.removeItem('refreshToken')
    window.sessionStorage.removeItem('userId')
    window.sessionStorage.removeItem('enterpriseManagerId')
    window.sessionStorage.removeItem('enterpriseMemberId')

    commit('setUser', {})
    commit('setAccountInfo', {})
    commit('setWalletInfo', {})
    return

    let res = await bossMember.logout(params)
    if (res.code == '200') {
      window.sessionStorage.clear()
      commit('setUser', {})
      commit('setAccountInfo', {})
      commit('setWalletInfo', {})
    }
    return res
  },
  // 刷新token
  refreshToken: async ({ commit }, params) => {
    params = {
      clientId: config.client.clientId,
      clientSecret: config.client.clientSecret,
      refreshToken: window.sessionStorage.getItem('refreshToken')
    }
    let res = await bossMember.refreshToken(params)
    return res
  },
  // 获取商家信息
  queryMerchantVerifyInfo: async ({ commit }, params) => {
    let res = await bossMember.queryMerchantVerifyInfo(params)
    return res
  },
  // 修改商家信息
  updateMerchantVerifyInfo: async ({ commit }, params) => {
    let res = await bossMember.updateMerchantVerifyInfo(params)
    return res
  },
  // 上传图片
  uploadFile: async ({ commit }, formData) => {
    let res = await bossMember.uploadFile(formData)
    return res
  },
  // 验证用户是否存在
  checkUserAccount: async ({ commit }, params) => {
    let res = await bossMember.checkUserAccount(params)
    return res
  },
  //获取api key
  queryUserApiKey: async ({ commit }, params) => {
    let res = await bossMember.queryUserApiKey(params)
    return res
  },
  //查询回调地址
  queryCallBackIp: async ({ commit }, params) => {
    let res = await bossMember.queryCallBackIp(params)
    return res
  },
  //设置回调地址
  setCallBackIp: async ({ commit }, params) => {
    let res = await bossMember.setCallBackIp(params)
    return res
  },
  //查询国家列表
  queryCountryList: async ({ commit }, params) => {
    let res = await bossMember.queryCountryList(params)
    return res
  },
  forgetPass: async ({ commit }, params) => {
    const res = await bossMember.forgetPass(params);
    return res;
  },
  autoLogin: async ({ commit }, params) => {
    let res = await bossMember.autoLogin(params);
    console.log(res);
    if (res.code == '200') {
      window.sessionStorage.setItem('TOKEN', res.data.token_type + ' ' + res.data.access_token)
      window.sessionStorage.setItem('refreshToken', res.data.token_type)
      window.sessionStorage.setItem('userId', res.data.userId)
      window.sessionStorage.setItem('enterpriseManagerId', res.data.enterpriseManagerId)
      window.sessionStorage.setItem('enterpriseMemberId', res.data.enterpriseMemberId)
      commit('setUser', res.data.userLoginInfo)
      commit('setWalletInfo', res.data.walletInfo)
    }
    return res
  },
}
