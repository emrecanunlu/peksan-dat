import barrelSerialService from '@/utils/services/barrelSerial'

const workorderModule = {
    namespaced: true,
    state: () => ({
        loading: false,
        remainingList: [],
        selectedIndex: 0
    }),
    mutations: {
        setRemainingList: (state, payload) => {
            state.remainingList = payload
        },
        setSelectedIndex: (state, payload) => {
            state.selectedIndex = payload
        },
        setLoading: (state, payload) => {
            state.loading = payload
        },

    },
    actions: {
        loadRemainingList: async ({ commit }, payload) => {
            commit('setLoading', true)
            barrelSerialService.getAll(payload)
                .then(({ data: result }) => {
                    commit('setRemainingList', result)
                })
                .finally(() => {
                    commit('setLoading', false)
                })
        },
        setSelectedIndex: ({ commit }, payload) => {
            commit('setSelectedIndex', payload)
        }
    },
    getters: {
        getRemainingList: (state) => state.remainingList,
        getSelectedIndex: (state) => state.selectedIndex,
        getLoading: (state) => state.loading
    }
}

export default workorderModule 