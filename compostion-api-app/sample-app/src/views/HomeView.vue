<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div 
    :style="{ color: store.state.colorCode }"
    class="counter"  
    >
      {{ store.state.counter }}
    </div>
    <div class="squared">
      {{ store.state.counter }}
      <sup>2</sup> =
      {{ store.getters.counterSquared() }}
    </div>
    <div class="buttons">
      
      <button @click="store.methods.decreaseCounter">-</button>
      <button @click="store.methods.increaseCounter">+</button>
    </div>
    <div>
      <!-- change value of v-model to "colorCode" if using readonly(no two-way binding) -->
      <input v-model="store.state.colorCode" placeholder="Enter Color Code" type="text">
    </div>
   
  </div>
</template>

<script>
// import computed from Vue if using read-only
import { inject } from 'vue';


export default {
  name: 'HomeView',
  setup() {
    const store = inject('store');

    // uncomment colorCode to change color of counter if using readonly
    // const colorCode = computed({
    //   get(){
    //     return store.state.colorCode;
    //   },
    //   set(val){
    //     store.methods.setColorCode(val);
    //   }  
    // })
    return {
      store,
      //  colorCode

    }
  }
}
</script>
<style>

/* div {
  margin-bottom: 10px;
}
.counter {
  font-size: 80px;
}
.buttons button {
  font-size: 40px;
  width: 100px;
  margin: 0 10px;
} */

</style>
