import { setupDevtoolsPlugin, DevtoolsPluginApi } from '@vue/devtools-api'
//import { toRaw } from 'vue-demi';
import deepCopy from './deepCopy'
//  import { onMounted } from 'vue'


/* Plugin Functionality */
export function setupDevtools(app: any) {
  const stateType: string = 'POV Plugin State'
  const inspectorId: string = 'point-of-vue-plugin'
  const timelineLayerId: string = 'pov-state'
  let currentState: any = {};
  let copyOfState: any = {};
  let devtoolsApi: DevtoolsPluginApi<{}>

  let trackId = 0

  const groupId = 'group-1'

  let eventCounter: any = 1;
  
  const currentToCopy = (current: any, copy: any): void => {
          const temp = deepCopy(current);
          for (const key in temp){
            if (!copy[key]){
              copy[key] = [];
            }
            copy[key].push(temp[key])
          }
        }

  const getEventState = (index: number) => {
    const eventState: any = {};
    for (const key in copyOfState){
      //console.log("copyOfState from getEventState:", copyOfState)
      //console.log("copyOfState[key]:", copyOfState[key][index])
      eventState[key] = deepCopy(copyOfState[key][index]);
    }
    //console.log("eventState:", eventState)
    return eventState;
  }

  const getCompState = (): Function => {
    let hasBeenCalled: boolean = false
    const inner = (stateArr: any): any => {
      if (hasBeenCalled === false){
        hasBeenCalled = true
        stateArr.forEach((obj: any) => {
          if (obj.type === 'provided') {
            currentState[obj.key] = {}
            //const valArr: object[] = Object.values(obj.value);
            //const keyArr: string[] = Object.keys(obj.value);
            //for (let i = 0; i < valArr.length; i++){
            for (const property in obj.value){
              const types: string[] = Object.values(obj.value[property]).map(el => typeof el)
              if (!types.includes('function')) {
                if(obj.value[property].__v_isRef === true){
                  currentState[obj.key][property] = obj.value[property].value
                }else{
                  currentState[obj.key][property] = obj.value[property]
                }
              }  
            }  
          }
        })
        currentToCopy(currentState, copyOfState);
        console.log("copyOfState:", copyOfState);

        window.addEventListener('click', event => {

          currentToCopy(currentState, copyOfState);
          console.log("copyOfState:", copyOfState);
          //console.log("added copy of state");
          const groupId = 'group-1'

          devtoolsApi.addTimelineEvent({
            layerId: timelineLayerId,
            event: {
              time: Date.now(),
              data: getEventState(eventCounter),
              title: `event ${eventCounter}`,
              groupId
            }
          })
          console.log("added timeline event")
          eventCounter += 1;
        });
        // add debounce
        window.addEventListener('keyup', event => {
          
          currentToCopy(currentState, copyOfState);
          console.log("copyOfState:", copyOfState);

          devtoolsApi.addTimelineEvent({
            layerId: timelineLayerId,
            event: {
              time: Date.now(),
              data: getEventState(eventCounter),
              title: `event ${eventCounter}`,
              groupId
            }
          })
          eventCounter += 1;
        });

        devtoolsApi.addTimelineEvent({
          layerId: timelineLayerId,
          event: {
            time: Date.now(),
            data: getEventState(0),
            title: `Default State`,
            groupId
          }
        })
      }
    }   
    return inner;
      //}
  }
  const inspectComponentToInspectorState = getCompState();

  const devtools = {
    trackStart: (label: string) => {
      const groupId = 'track' + trackId++

      devtoolsApi.addTimelineEvent({
        layerId: timelineLayerId,
        event: {
          time: Date.now(),
          data: {
            label
          },
          title: label,
          groupId
        }
      })

      return () => {
        devtoolsApi.addTimelineEvent({
          layerId: timelineLayerId,
          event: {
            time: Date.now(),
            data: {
              label,
              done: true
            },
            title: label,
            groupId
          }
        })
      }
    }
  }

  setupDevtoolsPlugin({
    id: 'point-of-vue-plugin',
    label: 'Point Of Vue Plugin',
    packageName: 'point-of-vue',
    homepage: 'https://vuejs.org',
    componentStateTypes: [stateType],
    enableEarlyProxy: true,
    app
  }, api => {

    

    devtoolsApi = api;

    api.addInspector({
      id: inspectorId,
      label: 'Point-Of-Vue!',
      icon: 'visibility',
    }, )

    //window.__vdevtools_ctx.currentTab = 'components';

    api.on.getInspectorTree((payload, context) => {
      //console.log("getInspectorTree payload:", payload)
      if (payload.inspectorId === inspectorId) {
        payload.rootNodes = [];
        for (const key in currentState){
          payload.rootNodes.push({
            id: `${key}`,
            label: `${key}`
          })
        }
      }
    })

    api.on.getInspectorState((payload) => {
      //console.log('payload', payload)
      //console.log('window', window)
      if (payload.inspectorId === inspectorId) {
        if (currentState[payload.nodeId]) {
          payload.state = {};
          //const stateObj = copyOfState[payload.nodeId][copyOfState[payload.nodeId].length - 1];
          
          for (const key in currentState[payload.nodeId]){
            payload.state[key] = []
            for (const prop in currentState[payload.nodeId][key])
              payload.state[key].push(
              {
              key: prop,
              value: currentState[payload.nodeId][key][prop],
              editable: true
              }
            )
          }
          //console.log('payload.state', payload.state)
        }
      }
    })

    setInterval(() => {
      api.sendInspectorTree(inspectorId)
    }, 500)


    //set: (object, path = arrayPath, value = state.value, cb) => 
    //  this.stateEditor.set(object, path, value, cb || this.stateEditor.createDefaultSetCallback(state))
    //});

    api.on.editInspectorState(payload => {
      if (payload.inspectorId === inspectorId) {
        if(currentState[payload.nodeId]){
          console.log('editInspectorStatepayload', payload);
          console.log(currentState[payload.nodeId]);
          currentState[payload.nodeId][payload.type][payload.path.toString()] = payload.state.value;

          currentToCopy(currentState, copyOfState);
          console.log("copyOfState:", copyOfState);

          devtoolsApi.addTimelineEvent({
            layerId: timelineLayerId,
            event: {
              time: Date.now(),
              data: getEventState(eventCounter),
              title: `event ${eventCounter}`,
              groupId
            }
          });  
          eventCounter += 1;
        }
      }
    })
    //onMounted()
    api.on.inspectComponent((payload, context) => {
      //console.log('window', window.__vdevtools_ctx);
      console.log("inspectComponent payload:", payload.instanceData.state);
      inspectComponentToInspectorState(payload.instanceData.state); 
    })

    api.addTimelineLayer({
      id: timelineLayerId,
      color: 0xff984f,
      label: 'Point-Of-Vue'
    })

  })

  return devtools
};
