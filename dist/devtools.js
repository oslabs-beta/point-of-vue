import { setupDevtoolsPlugin } from '@vue/devtools-api';
import { toRaw } from 'vue-demi';
let copyOfState = {};
export const getCompState = (state, stateName) => {
    console.log("copyOfState:", copyOfState);
    if (!copyOfState[stateName]) {
        copyOfState[stateName] = [];
    }
    ;
    copyOfState[stateName].push(state);
};
/* Plugin Functionality */
export function setupDevtools(app) {
    const stateType = 'POV Plugin State';
    const inspectorId = 'point-of-vue-plugin';
    const timelineLayerId = 'pov-state';
    setupDevtoolsPlugin({
        id: 'point-of-vue-plugin',
        label: 'Point Of Vue Plugin',
        packageName: 'point-of-vue',
        homepage: 'https://vuejs.org',
        componentStateTypes: [stateType],
        enableEarlyProxy: true,
        app
    }, api => {
<<<<<<< HEAD
        devtoolsApi = api;
        // console.log('api', api.on.getInspectorState);
        api.on.inspectComponent((payload, context) => {
            payload.instanceData.state.push({
                type: stateType,
                key: '$hello',
                value: data.message,
                editable: false
            });
            // console.log('payload inspect comp', payload)
            const stateArr = payload.instanceData.state;
            // console.log('api on get inspector state', api.on.getInspectorState)
            stateArr.forEach(obj => {
                if (obj.type === 'provided') {
                    const valArr = Object.values(obj.value);
                    const keyArr = Object.keys(obj.value);
                    for (let i = 0; i < valArr.length; i++) {
                        const types = Object.values(valArr[i]).map(el => typeof el);
                        if (!types.includes('function')) {
                            copyOfState[keyArr[i]] = [toRaw(valArr[i])];
                            console.log('copy of state', copyOfState);
                        }
                    }
                }
            });
        });
        setInterval(() => {
            api.notifyComponentUpdate();
        }, 50);
        api.on.visitComponentTree((payload, context) => {
            // console.log('payload visit comp tree', payload)
            const node = payload.treeNode;
            if (payload.componentInstance.type.meow) {
                node.tags.push({
                    label: 'meow',
                    textColor: 0x000000,
                    backgroundColor: 0xff984f
                });
            }
        });
=======
>>>>>>> d01fdaf5c628e4ea44dbcf5ec50892de0fc98ff8
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
<<<<<<< HEAD
        api.on.getInspectorState((payload, context) => {
            // console.log('copyofstate 204', copyOfState)
=======
        api.on.getInspectorState((payload) => {
>>>>>>> d01fdaf5c628e4ea44dbcf5ec50892de0fc98ff8
            if (payload.inspectorId === inspectorId) {
                if (copyOfState[payload.nodeId]) {
                    payload.state = {};
                    const stateObj = toRaw(copyOfState[payload.nodeId][copyOfState[payload.nodeId].length - 1]);
<<<<<<< HEAD
                    // console.log('getInspectorState is running')
                    // console.log('stateObj:', stateObj)
                    // console.log("copyOfState[payload.nodeId][0] keys", Object.keys(copyOfState[payload.nodeId][0]))
                    // console.log('toRaw:', toRaw(copyOfState[payload.nodeId][0]))
=======
>>>>>>> d01fdaf5c628e4ea44dbcf5ec50892de0fc98ff8
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
;
