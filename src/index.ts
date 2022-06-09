import { App } from 'vue';
import { setupDevtools, getCompState } from './devtools';

function install(app:App, options = {}) {
  if (process.env.NODE_ENV === 'development' || __VUE_PROD_DEVTOOLS__) {
    setupDevtools(app);
  };
};

export {
  getCompState,
  install as default
};