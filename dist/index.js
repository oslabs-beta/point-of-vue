import setupDevtools from './devtools';
export default function install(app) {
    if (process.env.NODE_ENV === 'development' || __VUE_PROD_DEVTOOLS__) {
        setupDevtools(app);
    }
}
