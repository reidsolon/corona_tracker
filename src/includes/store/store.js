import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
     tableContainer: {
        countries: {
            row: [],
        },
        map: {
            row: [],
            center: [0,0],
            zoom: parseInt(1)
        },

        mapInfo: {
            //loading--
            loadingSpecfic: false,
            loadingSummary: false,

            specificSummary: {},
            summary: {
              confirmed: {value: 0},
              recovered: {value: 0},
              deaths: {value: 0},
            },
            tableRow: [],
            singleRow: {},
        },
        news: {
            loadingNews: false,
            latestSituations: [],
            newsRow: []
        },
        selectedByType: 'confirmed',
        selectedCountry: 'worldwide'
     }
  },
  mutations: {
    ADD_TODO (state, payload) {
      state.todos.push(payload)
    },
    
  },
  getters: {
      _getTodos: state => {
          return state.todos
      }
  }
})