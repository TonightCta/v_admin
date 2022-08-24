import {bossAssetsCenter} from "~/api"

export const state = () => ({
    // 所有币种
    allCoins: {},
    merchantInfo: {},
    allRates: {},
    currentRate: 'USD',
    isAuthBox:window.sessionStorage.getItem('isAuthBox') || 1,
    allRateSymbols: {
        TWD: "NT$",
        AUD: "A$",
        HKD: "$",
        KRW: "₩",
        SGD: "$",
        JPY: "J￥",
        EUR: "€",
        GBP: "￡",
        USD: "$",
        MYR: "＄",
        CNY: "¥",
        THB: "฿"
    }
})

export const mutations = {
    setCurrentRate(state, rate) {
        state.currentRate = rate
    },
    setAllCoins(state, coins) {
        state.allCoins = coins
    },
    setMerchantInfo(state, info) {
        state.merchantInfo = info
    },
    setAllRates(state, rates) {
        state.allRates = rates
    },
    setIsAuthBox(state,opt){
        state.isAuthBox = opt;
        window.sessionStorage.setItem('isAuthBox',opt)
    }
}

export const actions = {
    changeCurrentRate({ commit }, rate) {
        commit('setCurrentRate', rate)
    },
    merchantAssetsInfo: async ({ commit }, params) => {
        let res = await bossAssetsCenter.merchantAssetsInfo(params)
        if (res.code === 200) {
            let coins = {}
            for (let coin of res.data.coinStatementList) {
                coins[coin.asset] = coin
            }
            commit('setAllCoins', coins)
            commit('setAllRates', res.data.fxrateUSD)
            commit('setMerchantInfo', res.data.merchantInfo)
        }
        return res
    },

    queryWalletAssetsFlow: async ({ commit }, params) => {
        params.walletId = window.sessionStorage.getItem('userId')
        params.ignoreUserId = true
        let res = await bossAssetsCenter.queryWalletAssetsFlow(params)
        return res
    },

    queryWithdrawHistory: async ({ commit }, params) => {
        params.walletId = window.sessionStorage.getItem('userId')
        let res = await bossAssetsCenter.queryWithdrawHistory(params)
        return res
    },

    checkAddress: async ({ commit }, params) => {
        let res = await bossAssetsCenter.checkAddress(params)
        return res
    },

    isAddressExist: async ({ commit }, params) => {
        let res = await bossAssetsCenter.isAddressExist(params)
        return res
    },

    merchantWithdraw: async ({ commit }, params) => {
        let res = await bossAssetsCenter.merchantWithdraw(params)
        return res
    },
    pushNotifyAgain: async ({ commit }, params) => {
        let res = await bossAssetsCenter.pushNotifyAgain(params)
        return res
    },
    queryWalletNotify: async ({ commit }, params) => {
        let res = await bossAssetsCenter.queryWalletNotify(params)
        return res
    },
    updateMerchantAssetsInfo: async ({ commit }, params) => {
        let res = await bossAssetsCenter.updateMerchantAssetsInfo(params)
        return res
    },
    queryAllMerchant: async ({ commit }) => {
        const res = await bossAssetsCenter.queryAllMerchant();
        return res
    },
    queryAllAddress: async ({ commit }, params) => {
        const res = await bossAssetsCenter.queryAllAddress(params);
        return res;
    },
    transferCoin: async ({ commit }, params) => {
        const res = await bossAssetsCenter.transferCoin(params);
        return res;
    },
    getGoogleAuth: async ({ commit }) => {
        const res = await bossAssetsCenter.getGoogleAuth();
        return res;
    },
    bindGoogleAuth: async ({ commit }, params) => {
        const res = await bossAssetsCenter.bindGoogleAuth(params);
        return res;
    },
    getAllMerchants:async({commit},params) => {
        const res = await bossAssetsCenter.getAllMerchants(params);
        return res;
    },
    importWallet:async({commit},params) => {
        const res = await bossAssetsCenter.importWallet(params);
        return res;
    },
    setHash:async({commit},params) => {
        const res = await bossAssetsCenter.setHash(params);
        return res;
    },
    setWhiteIP:async({commit},params) => {
        const res = await bossAssetsCenter.setWhiteIP(params);
        return res;
    },
    addMerchant:async({commit},params) => {
        const res = await bossAssetsCenter.addMerchant(params);
        return res;
    },
    rejectWithdraw:async({commit},params) => {
        const res = await bossAssetsCenter.rejectWithdraw(params);
        return res;
    },
    rebackOrder:async({commit},params) => {
        const res = await bossAssetsCenter.rebackOrder(params);
        return res;
    },
    userWithdraw:async({commit},params) => {
        const res = await bossAssetsCenter.userWithdraw(params);
        return res;
    },

    queryMerchantCoins: async ({ commit },params) => {
        const res = await bossAssetsCenter.queryAllMerchantCoins(params);
        return res
    },

    queryCoinCollectFee: async ({ commit },params) => {
        const res = await bossAssetsCenter.queryCoinCollectFee(params);
        return res
    },

    sendCoinCollectFee: async ({ commit },params) => {
        const res = await bossAssetsCenter.sendCoinCollectFee(params);
        return res
    },

    updateMerchantCoinConfig:async({commit},params) => {
        const res = await bossAssetsCenter.updateMerchantCoinConfig(params);
        return res;
    },
    editMerchantName:async({commit},params) => {
        const res = await bossAssetsCenter.editMerchantName(params);
        return res;
    }
}