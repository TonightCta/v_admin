import request from "./ibreq"

const BASE_URL = "merchant/v1"

/**
 * 资产中心
 */
export default class BossAssetsCenter {
    // 查询收款统计
    async merchantAssetsInfo(params) {
        return await request({
            url: BASE_URL + "/assets/merchantAssetsInfo",
            method: "POST",
            data: params
        })
    }

    // 查询流水
    async queryWalletAssetsFlow(params) {
        return await request({
            url: BASE_URL + "/assetsFlow/queryWalletAssetsFlow",
            method: "POST",
            data: params
        })
    }

    // 查询提币流水
    async queryWithdrawHistory(params) {
        return await request({
            url: BASE_URL + "/userWithdraw/queryUserWithdrawHistory",
            method: "POST",
            data: params
        })
    }

    // 检查地址合法性
    async checkAddress(params) {
        return await request({
            url: BASE_URL + "/addressBook/checkAddress",
            method: "POST",
            data: params
        })
    }

    // 地址是否存在
    async isAddressExist(params) {
        return await request({
            url: BASE_URL + "/addressBook/queryAddressFromAddressBook",
            method: "POST",
            data: params
        })
    }

    // 提交提币审核
    async merchantWithdraw(params) {
        return await request({
            url: BASE_URL + "/userWithdraw/merchantWithdraw",
            method: "POST",
            data: params
        })
    }
    //一键重发
    async pushNotifyAgain(params) {
        return await request({
            url: BASE_URL + "/secure/v1/pushNotifyAgain",
            method: "POST",
            data: params
        })
    }
    //异常回调订单查询
    async queryWalletNotify(params) {
        return await request({
            url: BASE_URL + "/secure/v1/queryWalletNotify",
            method: "POST",
            data: params
        })
    }
    async updateMerchantAssetsInfo(params) {
        return await request({
            url: BASE_URL + "/assets/updateMerchantAssetsInfo",
            method: "POST",
            data: params
        })
    }
    //获取所有商家
    async queryAllMerchant(){
        return await request({
            url:BASE_URL + "/user/merchants",
            method:'GET'
        })
    }
    //获取所有商家币种配置
    async queryAllMerchantCoins(params){
        return await request({
            url:BASE_URL + "/manager/merchantCoins",
            method:'POST',
            data:params
        })
    }

    //获取归集数据
    async queryCoinCollectFee(params){
        return await request({
            url:BASE_URL + "/manager/poolFee",
            method:'POST',
            data:params
        })
    }

    // 发起归集操作
    async sendCoinCollectFee(params){
        return await request({
            url:BASE_URL + "/manager/calculateMerchantPoolFee",
            method:'POST',
            data:params
        })
    }

    //获取所有地址
    async queryAllAddress(params){
        return await request({
            url:BASE_URL + "/assets/wallets",
            method:"POST",
            data:params
        })
    }
    //发起提币
    async transferCoin(params){
        return await request({
            url:BASE_URL + "/assets/wallets/checkout ",
            method:"POST",
            data:params
        })
    }
    //谷歌验证码
    async getGoogleAuth(){
        return await request({
            url:BASE_URL + '/user/getGoogleAuth',
            method:"GET"
        })
    }
    //绑定谷歌验证码
    async bindGoogleAuth(params){
        return await request({
            url:BASE_URL + '/user/bindGoogleAuth',
            method:"POST",
            data:params
        })
    }
    //商家列表
    async getAllMerchants(params){
        return await request({
            url:BASE_URL + '/assets/merchants',
            method:"POST",
            data:params
        })
    }
    //导入钱包
    async importWallet(params){
        return await request({
            url:BASE_URL + `/assets/bindMerchants`,
            method:"POST",
            data:params
        })
    }
    //设置交易HASH
    async setHash(params){
        return await request({
            url:BASE_URL + '/userWithdraw/pass',
            method:"POST",
            data:params
        })
    }
    //设置白名单IP
    async setWhiteIP(params){
        return await request({
            url:BASE_URL + '/user/info/setServerIp',
            method:"POST",
            data:params
        })
    }
    //新增商户
    async addMerchant(params){
        return await request({
            url:BASE_URL + "/manager/createMerchant",
            method:"POST",
            data:params
        })
    }
    //更新商户币种配置
    async updateMerchantCoinConfig(params){
        return await request({
            url:BASE_URL + "/manager/saveMerchantCoins",
            method:"POST",
            data:params
        })
    }
    //拒绝提币
    async rejectWithdraw(params){
        return await request({
            url:BASE_URL + "/userWithdraw/reject",
            method:"POST",
            data:params
        })
    }
    //重新回调
    async rebackOrder(params){
        return await request({
            url:BASE_URL + "/assetsFlow/notify",
            method:"POST",
            data:params
        })
    }
    //用户提币
    async userWithdraw(params){
        return await request({
            url:BASE_URL + "/assetsFlow/userWithdraw",
            method:"POST",
            data:params
        })
    }
}