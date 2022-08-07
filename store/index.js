export const state = () => ({
    isMount: false,
    not_china: false,
    page_show: true
})
export const actions = {
    changeMount(state) {
        state.isMount = true
    },
    isChina({ commit }) {
        commit('isChina')
    },
    closeCertificationPage({ commit }) {
        commit('closeCertificationPage')
    },
    openCertificationPage({ commit }) {
        commit('openCertificationPage')
    }
}
export const mutations = {
    changeMount(state) {
        state.isMount = true
    },
    isChina(state) {
        state.not_china = true
    },
    closeCertificationPage(state) {
        state.page_show = false
    },
    openCertificationPage(state) {
        state.page_show = true
    }
}