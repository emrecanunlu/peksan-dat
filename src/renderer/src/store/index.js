import { createStore } from 'vuex'
import authModule from './modules/auth'
import productionModule from './modules/production'
import snackbarModule from './modules/snackbar'

const store = createStore({
  modules: {
    auth: authModule,
    snackbar: snackbarModule,
    production: productionModule
  }
})

export default store
