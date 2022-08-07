import { withdrawAdmin } from "~/api"

export const state = () => ({
  
})

export const mutations = {

}

export const actions = {
  // 查询收款统计
  queryTransDetail: async ({commit}, params) => {
    let res = withdrawAdmin.queryTransDetail(params)
    return res
  }
}