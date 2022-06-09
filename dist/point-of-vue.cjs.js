/*!
  * point-of-vue v0.1.7
  * (c) 2022 
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var devtoolsApi = require('@vue/devtools-api');
var vue = require('vue');

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
    devtoolsApi.setupDevtoolsPlugin({
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
