import { App } from 'vue';
import setupDevtools from './devtools';

export default function install(app:App) {
  if (process.env.NODE_ENV === 'development' || __VUE_PROD_DEVTOOLS__) {
    setupDevtools(app);
  }
}
