import { axios, SERVER_URL } from "~/plugins/axios"
import request from "./ibreq"
import noAuthRequest from "~/plugins/axios"

// 用户中心基路由
const BASE_URL = "/merchant/v1"

/**
 * 用户中心
 */
export default class BossMember {

  // 检查用户账户
  async checkUserAccount(params) {
    return await noAuthRequest({
      url: BASE_URL + '/user/login/checkUserAccount',
      method: "POST",
      data: params
    })
  }

  // 验证 短信/邮箱 验证码
  async checkVerifyCode(params) {

  }

  // 登录并获取api访问令牌
  async loginToken(params) {
    return await noAuthRequest({
      url: BASE_URL + '/user/login/v2/loginToken',
      method: "POST",
      data: params
    })
  }

  // 注销登录
  async logout(params) {
    return await request({
      url: BASE_URL + "/user/login/logout",
      method: "POST",
      data: params
    })
  }

  // 刷新令牌
  async refreshToken(params) {
    return await noAuthRequest({
      url: BASE_URL + "/user/login/refreshToken",
      method: "POST",
      data: params
    })
  }

  // 发送验证码
  async sendVerifyCode(params) {
    return await noAuthRequest({
      url: BASE_URL + "/user/sendEmailCode",
      method: "POST",
      data: params
    })
  }

  // 验证验证码
  async checkVerifyCode(params) {
    return await noAuthRequest({
      url: BASE_URL + "/user/login/checkVerifiyCode",
      method: "POST",
      data: params
    })
  }

  // 商户注册
  async register(params) {
    return await noAuthRequest({
      url: BASE_URL + '/user/info/registerWithAll',
      method: "POST",
      data: params
    })
  }

  // 设置交易密码
  async setTransPwd(params) {
    return await request({
      url: BASE_URL + "/user/info/setTransPwd",
      method: "POST",
      data: params
    })
  }

  // 重置登录密码
  async resetLoginPwd(params) {
    return await noAuthRequest({
      url: BASE_URL + "/user/info/resetLoginPwd",
      method: "POST",
      data: params
    })
  }

  // 修改登录/交易密码
  async updatePwd(params) {
    return await request({
      url: BASE_URL + "/user/info/updatePwd",
      method: "POST",
      data: params
    })
  }

  // 查询用户基本信息
  async queryUserInfo(params) {
    return await request({
      url: BASE_URL + "/user/info/queryUserInfo",
      method: "POST",
      data: params
    })
  }

  // 查询商户认证信息
  async queryMerchantVerifyInfo(params) {
    return await request({
      url: BASE_URL + "/user/info/queryMerchantVerifyInfo",
      method: "POST",
      data: params
    })
  }

  // 修改商户认证信息
  async updateMerchantVerifyInfo(params) {
    return await request({
      url: BASE_URL + "/user/info/updateMerchantVerifyInfo",
      method: "POST",
      data: params
    })
  }
  async queryUserApiKey(params) {
    return await request({
      url: BASE_URL + "/user/info/queryUserApiKey",
      method: "POST",
      data: params
    })
  }
  async queryCallBackIp(params) {
    return await request({
      url: BASE_URL + "/user/info/queryCallBackIp",
      method: "POST",
      data: params
    })
  }
  async setCallBackIp(params) {
    return await request({
      url: BASE_URL + "/user/info/setCallBackIp",
      method: "POST",
      data: params
    })
  }
  async queryCountryList(params) {
    return await request({
      url: BASE_URL + "/user/info/queryCountryList",
      method: "POST",
      data: params
    })
  }

  // 上传图片
  async uploadFile(formData) {
    let res = {}
    try {
      let result = await axios.post(SERVER_URL + BASE_URL + "/user/upload/imgUpload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: window.sessionStorage.getItem('TOKEN'),
          userId: window.sessionStorage.getItem('userId'),
          enterpriseManagerId: window.sessionStorage.getItem('enterpriseManagerId'),
          enterpriseMemberId: window.sessionStorage.getItem('enterpriseMemberId')
        }
      })
      res = result.data
    } catch (error) {

    }
    return res
  }
  //忘记密码
  async forgetPass(params) {
    return await noAuthRequest({
      url: BASE_URL + "/user/forgetPassword",
      method: "POST",
      data: params
    })
  }
  async autoLogin(params){
    return await noAuthRequest({
      url:BASE_URL + "/user/login/v2/loginUserToken",
      method:"POST",
      data:params
    })
  }
}