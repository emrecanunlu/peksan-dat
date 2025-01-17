import workOrderService from "@/utils/services/workOrder";

const productionModule = {
    namespaced: true,
    state: () => ({
        toBeProduced: 0,
        produced: 0,
        remaining: 0,
    }),
    mutations: {
        setProductionQuantities: (state, payload) => {
            state.produced = payload.produced;
            state.remaining = payload.remaining;
            state.toBeProduced = payload.toBeProducedItem.value;
        },
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
        }
    },
    getters: {

    }
}

export default productionModule
