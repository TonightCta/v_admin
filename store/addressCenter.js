import { addressCenter } from "~/api"

export const state = () => ({

})

export const mutations = {

}

export const actions = {
  // 获取币种列表
  getCoinList: async ({ commit }, params) => {
    let res = await addressCenter.getCoinList(params)
    return res
  },

  // 查询地址薄
  getAddressBookPage: async ({ commit }, params) => {
    params.walletId = window.localStorage.getItem('userId')
    let res = await addressCenter.getAddressBookPage(params)
    return res
  },

  // 新增地址
  addAddress: async ({ commit }, params) => {
    let res = await addressCenter.addAddress(params)
    return res
  },

  // 修改提币地址
  updateAddress: async ({ commit }, params) => {
    let res = await addressCenter.updateAddress(params)
    return res
  },

  // 删除提币地址
  deleteAddress: async ({ commit }, params) => {
    let res = await addressCenter.deleteAddress(params)
    return res
  },
  
  gatewayList: async ({ commit }, params) => {
    let res = await addressCenter.gatewayList(params)
    return res
  }
}