import workOrderService from "@/utils/services/workOrder";

const productionModule = {
    namespaced: true,
    state: () => ({
        toBeProduced: 0,
        produced: 0,
        remaining: 0,
        isLabelVerification: false,
        serialNumber: ''
    }),
    mutations: {
        setProductionQuantities: (state, payload) => {
            state.produced = payload.produced;
            state.remaining = payload.remaining;
            state.toBeProduced = payload.toBeProducedItem.value;
        },
        setIsLabelVerification: (state, payload) => {
            state.isLabelVerification = payload
        },
        setSerialNumber: (state, payload) => {
            state.serialNumber = payload
        }
    },
    actions: {
        loadProductionQuantities: async ({ commit }, payload) => {
            if (!payload) {
                commit('setProductionQuantities', {
                    produced: 0, remaining: 0, toBeProducedItem: {
                        value: 0
                    }
                })
                return
            }

            workOrderService.getProductionInformation(payload)
                .then(({ data: result }) => {
                    commit('setProductionQuantities', result)
                })
        },
        reset: ({ commit }) => {
            commit('setProductionQuantities', {
                produced: 0, remaining: 0, toBeProducedItem: {
                    value: 0
                }
            })
        },
        activeLabelVerification: ({ commit }, { serialNumber }) => {
            commit('setIsLabelVerification', true)
            commit('setSerialNumber', serialNumber)
        },
        closeLabelVerification: ({ commit }) => {
            commit('setIsLabelVerification', false)
            commit('setSerialNumber', '')
        }
    },
    getters: {
        isLabelVerification: (state) => {
            return state.isLabelVerification
        },
        serialNumber: (state) => {
            return state.serialNumber
        }
    }
}

export default productionModule
