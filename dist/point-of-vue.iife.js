/*!
  * point-of-vue v0.1.7
  * (c) 2022 
  * @license MIT
  */
(function (exports, vue) {
    'use strict';

    function getDevtoolsGlobalHook() {
        return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
    }
    function getTarget() {
        // @ts-ignore
        return (typeof navigator !== 'undefined' && typeof window !== 'undefined')
            ? window
            : typeof global !== 'undefined'
                ? global
                : {};
    }
    const isProxyAvailable = typeof Proxy === 'function';

    const HOOK_SETUP = 'devtools-plugin:setup';
    const HOOK_PLUGIN_SETTINGS_SET = 'plugin:settings:set';

    let supported;
    let perf;
    function isPerformanceSupported() {
        var _a;
        if (supported !== undefined) {
            return supported;
        }
        if (typeof window !== 'undefined' && window.performance) {
            supported = true;
            perf = window.performance;
        }
        else if (typeof global !== 'undefined' && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
            supported = true;
            perf = global.perf_hooks.performance;
        }
        else {
            supported = false;
        }
        return supported;
    }
    function now() {
        return isPerformanceSupported() ? perf.now() : Date.now();
    }

    class ApiProxy {
        constructor(plugin, hook) {
            this.target = null;
            this.targetQueue = [];
            this.onQueue = [];
            this.plugin = plugin;
            this.hook = hook;
            const defaultSettings = {};
            if (plugin.settings) {
                for (const id in plugin.settings) {
                    const item = plugin.settings[id];
                    defaultSettings[id] = item.defaultValue;
                }
            }
            const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
            let currentSettings = Object.assign({}, defaultSettings);
            try {
                const raw = localStorage.getItem(localSettingsSaveId);
                const data = JSON.parse(raw);
                Object.assign(currentSettings, data);
            }
            catch (e) {
                // noop
            }
            this.fallbacks = {
                getSettings() {
                    return currentSettings;
                },
                setSettings(value) {
                    try {
                        localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
                    }
                    catch (e) {
                        // noop
                    }
                    currentSettings = value;
                },
                now() {
                    return now();
                },
            };
            if (hook) {
                hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
                    if (pluginId === this.plugin.id) {
                        this.fallbacks.setSettings(value);
                    }
                });
            }
            this.proxiedOn = new Proxy({}, {
                get: (_target, prop) => {
                    if (this.target) {
                        return this.target.on[prop];
                    }
                    else {
                        return (...args) => {
                            this.onQueue.push({
                                method: prop,
                                args,
                            });
                        };
                    }
                },
            });
            this.proxiedTarget = new Proxy({}, {
                get: (_target, prop) => {
                    if (this.target) {
                        return this.target[prop];
                    }
                    else if (prop === 'on') {
                        return this.proxiedOn;
                    }
                    else if (Object.keys(this.fallbacks).includes(prop)) {
                        return (...args) => {
                            this.targetQueue.push({
                                method: prop,
                                args,
                                resolve: () => { },
                            });
                            return this.fallbacks[prop](...args);
                        };
                    }
                    else {
                        return (...args) => {
                            return new Promise(resolve => {
                                this.targetQueue.push({
                                    method: prop,
                                    args,
                                    resolve,
                                });
                            });
                        };
                    }
                },
            });
        }
        async setRealTarget(target) {
            this.target = target;
            for (const item of this.onQueue) {
                this.target.on[item.method](...item.args);
            }
            for (const item of this.targetQueue) {
                item.resolve(await this.target[item.method](...item.args));
            }
        }
    }

    function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
        const descriptor = pluginDescriptor;
        const target = getTarget();
        const hook = getDevtoolsGlobalHook();
        const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
        if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
            hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
        }
        else {
            const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
            const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
            list.push({
                pluginDescriptor: descriptor,
                setupFn,
                proxy,
            });
            if (proxy)
                setupFn(proxy.proxiedTarget);
        }
    }

    let copyOfState = {};
    const getCompState = (state, stateName) => {
        console.log("copyOfState:", copyOfState);
        if (!copyOfState[stateName]) {
            copyOfState[stateName] = [];
        }
        copyOfState[stateName].push(state);
    };
    /* Plugin Functionality */
    function setupDevtools(app) {
        const stateType = 'POV Plugin State';
        const inspectorId = 'point-of-vue-plugin';
        const timelineLayerId = 'pov-state';
        setupDevtoolsPlugin({
            id: 'point-of-vue-plugin',
            label: 'Point Of Vue Plugin',
            packageName: 'point-of-vue',
            homepage: 'https://vuejs.org',
            componentStateTypes: [stateType],
            app
        }, api => {
            api.addInspector({
                id: inspectorId,
                label: 'Point-Of-Vue!',
                icon: 'pets',
            });
            api.on.getInspectorTree((payload, context) => {
                if (payload.inspectorId === inspectorId) {
                    payload.rootNodes = [];
                    for (const key in copyOfState) {
                        payload.rootNodes.push({
                            id: `${key}`,
                            label: `${key}`
                        });
                    }
                }
            });
            api.on.getInspectorState((payload) => {
                if (payload.inspectorId === inspectorId) {
                    if (copyOfState[payload.nodeId]) {
                        payload.state = {};
                        const stateObj = vue.toRaw(copyOfState[payload.nodeId][copyOfState[payload.nodeId].length - 1]);
                        for (const key in stateObj) {
                            payload.state[key] = [
                                {
                                    key: key,
                                    value: stateObj[key],
                                    editable: false
                                }
                            ];
                        }
                    }
                }
            });
            api.addTimelineLayer({
                id: timelineLayerId,
                color: 0xff984f,
                label: 'Point-Of-Vue'
            });
        });
    }

    function install(app, options = {}) {
        {
            setupDevtools(app);
        }
    }

    exports["default"] = install;
    exports.getCompState = getCompState;

    Object.defineProperty(exports, '__esModule', { value: true });

})(this["point-of-vue"] = this["point-of-vue"] || {}, Vue);
