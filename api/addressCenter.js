import request from "./ibreq"

// 资产中心基路由
const BASE_URL = "merchant/v1"

/**
 * 地址薄
 */
export default class AddressCenter {
  // 查询地址薄列表
  async getAddressBookPage(params) {
    return request({
      url: BASE_URL + '/addressBook/findAddressBookPage',
      method: "POST",
      data: params
    })
  }

  // 获取币种列表
  async getCoinList(params) {
    return request({
      url: BASE_URL + "/coinList/getCoinList",
      method: "POST",
      data: params
    })
  }

  // 新增提币地址
  async addAddress(params) {
    return request({
      url: BASE_URL + "/addressBook/addAddressBook",
      method: "POST",
      data: params
    })
  }

  // 修改提币地址
  async updateAddress(params) {
    return request({
      url: BASE_URL + "/addressBook/updateAddressBook",
      method: "POST",
      data: params
    })
  }

  // 删除提币地址
  async deleteAddress(params) {
    return request({
      url: BASE_URL + "/addressBook/deleteAddressBook",
      method: "POST",
      data: params
    })
  }

  // 请求网关接口地址
  async gatewayList(params) {
    return request({
      url: BASE_URL + "/assets/gatewayList",
      method: "POST",
      data: params
    })
  }
}