// add readonly to input statement from vue to export
// readonly copy of state to prevent two-way binding
import { reactive } from "vue"

const state = reactive({
  counter: 0,
  colorCode : 'blue'
})

const methods = {
  decreaseCounter () {
    state.counter -= 1;
   console.log('decrease by one');

 },

  increaseCounter () {
    state.counter += 1;
   console.log('increase by one');
 },
//  uncomment if using readonly
//  setColorCode (val) {
//   state.colorCode = val;
//  }
}

const getters = {
  counterSquared() {
    return state.counter * state.counter;
  } 
}

export default {
  // switch lines below to enable readonly
  // state: readonly(state,)
  state,
  methods,
  getters
}