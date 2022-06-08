import { setupDevtoolsPlugin } from '@vue/devtools-api'
import { toRaw } from 'vue-demi';

let copyOfState: any = {};

export const getCompState = (state: object, stateName: string): void => {
  console.log("copyOfState:", copyOfState);
  
  if (!copyOfState[stateName]) {
    copyOfState[stateName] = [];
  };
  copyOfState[stateName].push(state);
};

export function setupDevtools(app: any) {
  const stateType: string = 'POV Plugin State'
  const inspectorId: string = 'point-of-vue-plugin'
  const timelineLayerId: string = 'pov-state'

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
    })
    
    api.on.getInspectorTree((payload, context) => {
      if (payload.inspectorId === inspectorId) {
        payload.rootNodes = [];
        for (const key in copyOfState){
          payload.rootNodes.push({
            id: `${key}`,
            label: `${key}`
          })
        }
      }
    })

    api.on.getInspectorState((payload) => {
      if (payload.inspectorId === inspectorId) {
        if (copyOfState[payload.nodeId]) {
          payload.state = {};
          const stateObj = toRaw(copyOfState[payload.nodeId][copyOfState[payload.nodeId].length - 1]);
          
          for (const key in stateObj){
            payload.state[key] = [
              {
              key: key,
              value: stateObj[key],
              editable: false
              }
            ]
          }
        }
      }
    })

    api.addTimelineLayer({
      id: timelineLayerId,
      color: 0xff984f,
      label: 'Point-Of-Vue'
    })
  })
};
