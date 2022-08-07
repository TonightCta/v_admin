import request from "./ibreq"

// 资产中心基路由
const BASE_URL = "/xcloud-mgr-provider-assets"

/**
 * 资产中心
 */
export default class WithdrawAdmin {
  // 查询收款统计
  async queryTransDetail(params) {
    return await request({
      url: BASE_URL + "/withdrawAdmin/queryTransactionDetail",
      method: "POST",
      data: params
    })
  }
}