import { App } from 'vue';
import { getCompState } from './devtools';
declare function install(app: App, options?: {}): void;
export { getCompState, install as default };
