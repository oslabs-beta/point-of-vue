<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>counter: {{ store.state.counter }} </h2>
    
  </div>
</template>

<script>
import { inject } from 'vue';


export default {
  setup() {
    const store = inject('store', )

    return {
      store
    }
  }
}
</script>
