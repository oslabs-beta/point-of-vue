import { setupDevtoolsPlugin } from '@vue/devtools-api';
import { toRaw } from 'vue-demi';
let copyOfState = {};
// export const getCompState = (state: object, stateName: string): void => {
//   console.log("copyOfState:", copyOfState);
//   if (!copyOfState[stateName]) {
//     copyOfState[stateName] = [];
//   };
//   copyOfState[stateName].push(state);
// };
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
        api.addInspector({
            id: inspectorId,
            label: 'Point-Of-Vue!',
            icon: 'pets',
        });
        api.on.getInspectorTree((payload, context) => {
            console.log(payload);
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
            console.log('payload', payload);
            //  const stateArr = payload.instanceData.state
            // // console.log('api on get inspector state', api.on.getInspectorState)
            //     stateArr.forEach(obj => {
            //       if (obj.type === 'provided') {
            //         const valArr: object[] = Object.values(obj.value);
            //         const keyArr: string[] = Object.keys(obj.value);
            //         for (let i = 0; i < valArr.length; i++){
            //           const types: string[] = Object.values(valArr[i]).map(el => typeof el)
            //           if (!types.includes('function')) {
            //             copyOfState[keyArr[i]] = [toRaw(valArr[i])];
            //             console.log('copy of state', copyOfState)
            //             }
            //         }
            //       }
            //     })
            if (payload.inspectorId === inspectorId) {
                if (copyOfState[payload.nodeId]) {
                    payload.state = {};
                    const stateObj = toRaw(copyOfState[payload.nodeId][copyOfState[payload.nodeId].length - 1]);
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
        api.on.inspectComponent((payload, context) => {
            const stateArr = payload.instanceData.state;
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
        api.addTimelineLayer({
            id: timelineLayerId,
            color: 0xff984f,
            label: 'Point-Of-Vue'
        });
    });
}
;
