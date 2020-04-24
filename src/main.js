import Vue from 'vue'
import App from './App.vue'
import VueMapbox from "vue-mapbox";
import Mapbox from "mapbox-gl";
import VueMoment from 'vue-moment'
import VueRouter from 'vue-router'

import TableContainer from './components/TableContainer'
import News from './components/News'

Vue.use(VueRouter)

Vue.use(VueMapbox, { mapboxgl: Mapbox });
Vue.use(VueMoment);
Vue.config.productionTip = false

Vue.component()

const routes = [
  { path: '/', component: TableContainer },
  { path: '/news', component: News}
]

const router = new VueRouter({
  routes 
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
