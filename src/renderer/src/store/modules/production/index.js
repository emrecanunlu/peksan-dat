import workOrderService from "@/utils/services/workOrder";

const productionModule = {
    namespaced: true,
    state: () => ({
        toBeProduced: 0,
        produced: 0,
        remaining: 0,
        isLabelVerification: false,
        datNo: ""
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
        setDatNo: (state, payload) => {
            state.datNo = payload
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
        activeLabelVerification: ({ commit }, { datNo }) => {
            commit('setIsLabelVerification', true)
            commit('setDatNo', datNo)
        },
        closeLabelVerification: ({ commit }) => {
            commit('setIsLabelVerification', false)
            commit('setDatNo', '')
        }
    },
    getters: {
        isLabelVerification: (state) => {
            return state.isLabelVerification
        },
        datNo: (state) => {
            return state.datNo
        }
    }
}

export default productionModule
