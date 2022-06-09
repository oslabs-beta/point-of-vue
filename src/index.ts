import { App } from 'vue';
import { setupDevtools } from './devtools';

function install(app:App, options = {}) {
  if (process.env.NODE_ENV === 'development' || __VUE_PROD_DEVTOOLS__) {
    setupDevtools(app);
  };
};

export {
  install as default
};