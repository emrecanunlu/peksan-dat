import { createStore } from 'vuex'
import authModule from './modules/auth'
import productionModule from './modules/production'
import snackbarModule from './modules/snackbar'
import workorderModule from './modules/workorder'

const store = createStore({
  modules: {
    auth: authModule,
    snackbar: snackbarModule,
    production: productionModule,
    workorder: workorderModule
  }
})

export default store
