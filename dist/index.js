import { setupDevtools, getCompState } from './devtools';
// import SomeComponent from '../src/SomeComponent.vue';
// import { MyPluginData } from './types';
function install(app, options = {}) {
    if (process.env.NODE_ENV === 'development' || __VUE_PROD_DEVTOOLS__) {
        setupDevtools(app);
    }
    ;
}
;
export { getCompState, install as default };
