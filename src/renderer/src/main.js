import { createApp } from 'vue'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import App from './App.vue'
import router from './plugins/router'
import vuetify from './plugins/vuetify'
import store from './store'

const app = createApp(App)

function resolveGLobalComponents(instance) {
    instance.use(vuetify);
}

app.use(store)
app.use(router)
app.use(vuetify)
app.use(Vue3Toastify, {
    dangerouslyHTMLString: true,
    useHandler: resolveGLobalComponents,
    hideProgressBar: true,
    closeButton: false,
    position: "bottom-right",
    expandCustomProps: true,
})


app.mount('#app')
