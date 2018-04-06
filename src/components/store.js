import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        isAuthenticated: !!localStorage.getItem('user'),
        currentUser: (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : {},
        selectedImage: null
    },
    mutations: {
        setAuth(state) {
            state.isAuthenticated = true;
        },
        unAuth(state) {
            state.isAuthenticated = false;
        },
        setCurrentUser(state, obj) {
            state.currentUser = obj
            Vue.axios.defaults.headers.common['session_id'] = obj.session_id
            Vue.axios.defaults.headers.common['session_token'] = obj.session_token
        },
        unSetCurrentUser(state) {
            localStorage.removeItem('user')
            state.currentUser = {}
            
            delete Vue.axios.defaults.headers.common['session_id']
            delete Vue.axios.defaults.headers.common['session_token']
        },
        selectImage(state, obj) {
            state.selectedImage = obj
        },
        clearSelectedImage(state) {
            state.selectedImage = null
        }
    }
})