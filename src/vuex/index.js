import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		cart : {},
		seller: {}
	},
	mutations:{
		cartAdd: (state,payload)=> {
			state.cart = payload;
		},
		sellerAdd: (state,payload)=> {
			state.seller = payload;
		}
	},
// 	getters: {
// 		cartAdd(state){
// 			return state.cart;
// 		}	
// 	}
});

export default store;