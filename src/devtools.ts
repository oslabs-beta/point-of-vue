import { setupDevtoolsPlugin, DevtoolsPluginApi } from '@vue/devtools-api'
import { deepCopy, debounce } from './utils'

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
  
  /* Creates a deepy copy of current state and pushes to copyOfState in order to remove reference in memory */
  const currentToCopy = (current: any, copy: any): void => {
    const temp = deepCopy(current);

    for (const key in temp){
      if (!copy[key]){
        copy[key] = [];
      }
      copy[key].push(temp[key])
    }
  };

  /* Pulls corresponding copy of state and assigns it to the event in the timeline */
  const getEventState = (index: number) => {
    const eventState: any = {};
    for (const key in copyOfState){
      eventState[key] = deepCopy(copyOfState[key][index]);
    }
    return eventState;
  };

  /* Grabs the state of the application from the devtools api */
  const getCompState = (): Function => {
    let hasBeenCalled: boolean = false
    const inner = (stateArr: any): any => {
      if (hasBeenCalled === false){
        hasBeenCalled = true
        stateArr.forEach((obj: any) => {
          if (obj.type === 'provided') {
            currentState[obj.key] = {}
            for (const property in obj.value){
              const types: string[] = Object.values(obj.value[property]).map(el => typeof el)
              if (!types.includes('function')) {
                // if(obj.value[property].__v_isRef === true){
                //   console.log(obj.value[property])
                //   currentState[obj.key][property] = obj.value[property]._value
                // }else{
                  currentState[obj.key][property] = obj.value[property]
              }
            }  
          }  
          
        })
        console.log("currentState:", currentState)
        currentToCopy(currentState, copyOfState);

        // application changes triger new deep copy of state to be pushed into timeline
        window.addEventListener('click', () => {

          currentToCopy(currentState, copyOfState);
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
          eventCounter += 1;
        });
        // add debounce
        window.addEventListener('keyup', debounce(() => {

          currentToCopy(currentState, copyOfState);
          console.log('copyOfState:', copyOfState);
          
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
        }));

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

    api.on.getInspectorTree((payload, context) => {
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
      const inner = (input: any, key: any) => {
        
          // if (typeof input[key] !== 'object'){
          //   payload.state[key].push(
          //     {
          //     key: key,
          //     value: currentState[payload.nodeId][key],
          //     editable: true
          //     }
          //   )
          // }else{
            if (currentState[payload.nodeId][key].__v_isRef === true){
              payload.state[key].push(
                {
                key: currentState[payload.nodeId][key]._value,
                value: currentState[payload.nodeId][key]._value,
                editable: true
                }
              )
            } else {
              for (const prop in currentState[payload.nodeId][key]){
                payload.state[key].push(
                  {
                  key: prop,
                  value: currentState[payload.nodeId][key][prop],
                  editable: true
                  }
                )
              }
            // }  
          }
        }
      if (payload.inspectorId === inspectorId) {
        if (currentState[payload.nodeId]) {
          payload.state = {};
           
          for (const key in currentState[payload.nodeId]){
            payload.state[key] = [];
            inner(currentState[payload.nodeId], key); 
          }  
        }
      }    
            
      
    })

    setInterval(() => {
      api.sendInspectorTree(inspectorId)
    }, 500)

    api.on.editInspectorState(payload => {
      if (payload.inspectorId === inspectorId) {
        if(currentState[payload.nodeId]){
          console.log('edit payload:', payload)
          
          console.log('edit payload.state.value:', payload.state.value)
          if(currentState[payload.nodeId][payload.type].__v_isRef === true){
            console.log("ref is true");
            currentState[payload.nodeId][payload.type].value = payload.state.value;
          }
          if (typeof currentState[payload.nodeId][payload.type] !== 'object'){
            console.log('edit:',  currentState[payload.nodeId][payload.type])
           
            currentState[payload.nodeId][payload.type] = payload.state.value;
          }else{
            currentState[payload.nodeId][payload.type][payload.path.toString()] = payload.state.value;
          }

          
          
          currentToCopy(currentState, copyOfState);

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
      console.log("payload.instanceData.Array", payload.instanceData.state)
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
