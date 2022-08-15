import request from "~/plugins/axios"
import { bossMember } from "~/api"
import eVue from "~/plugins/eVue"

let showToast = false


export function clearLocalStorage() {
  window.sessionStorage.removeItem('TOKEN')
  window.sessionStorage.removeItem('refreshToken')
  window.sessionStorage.removeItem('userId')
  window.sessionStorage.removeItem('enterpriseManagerId')
  window.sessionStorage.removeItem('enterpriseMemberId')
}

export default async function ibRequest(params) {
  let token = window.sessionStorage.getItem('TOKEN')
  let userId = window.sessionStorage.getItem('userId')
  let enterpriseManagerId = window.sessionStorage.getItem('enterpriseManagerId')
  if (!token || !userId || !enterpriseManagerId) {
    eVue.$error(window.$nuxt.$vuetify.lang.t('$vuetify.message.is_login'))
    setTimeout(() => {
      clearLocalStorage()
      window.$nuxt.$router.push('/login')
    }, 1500);
    return new Promise((rs, rj) => { })
  } else {
    if (params.data) {
      params.data.enterpriseManagerId = window.sessionStorage.getItem('enterpriseManagerId')
      if (!params.data.ignoreUserId) {
        params.data.userId = window.sessionStorage.getItem('userId')
      }
    }
    let res = await request(params)
    if (res.code == '401') {
      let refresh_res = await bossMember.refreshToken()
      if (refresh_res.code == '200') {
        return request(params)
      } else {
        if (!showToast) {
          showToast = true
          eVue.$error(window.$nuxt.$vuetify.lang.t('$vuetify.message.is_expired'))
        }
        setTimeout(() => {
          showToast = false
          clearLocalStorage()
          window.$nuxt.$router.push('/login')
        }, 2000);
      }
    }
    return res
  }
}