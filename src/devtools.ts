import { setupDevtoolsPlugin, DevtoolsPluginApi } from '@vue/devtools-api'
import { toRaw } from 'vue-demi';
// import { App } from 'vue'
import { MyPluginData } from './data'

let copyOfState: any = {};

export function setupDevtools(app: any, data: MyPluginData) {
  const stateType: string = 'My Awesome Plugin state'
  const inspectorId = 'my-awesome-plugin'
  const timelineLayerId = 'my-awesome-plugin'

  let devtoolsApi: DevtoolsPluginApi<{}>

  let trackId = 0

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
    id: 'my-awesome-devtools-plugin',
    label: 'My Awesome Plugin',
    packageName: 'my-awesome-plugin',
    homepage: 'https://vuejs.org',
    componentStateTypes: [stateType],
    enableEarlyProxy: true,
    app
  }, api => {
    devtoolsApi = api


    // console.log('api', api.on.getInspectorState);

    api.on.inspectComponent((payload, context) => {
      payload.instanceData.state.push({
        type: stateType,
        key: '$hello',
        value: data.message,
        editable: false
      })
      // console.log('payload inspect comp', payload)
    
      const stateArr = payload.instanceData.state
      // console.log('api on get inspector state', api.on.getInspectorState)
  
    stateArr.forEach(obj => {
      if (obj.type === 'provided') {
        const valArr: object[] = Object.values(obj.value);
        const keyArr: string[] = Object.keys(obj.value);
        for (let i = 0; i < valArr.length; i++){
          const types: string[] = Object.values(valArr[i]).map(el => typeof el)
          if (!types.includes('function')) {
            copyOfState[keyArr[i]] = [toRaw(valArr[i])];
            console.log('copy of state', copyOfState)
            }
        }
      }
    })
      
  })

    setInterval(() => {
      api.notifyComponentUpdate()
    }, 50)

    api.on.visitComponentTree((payload, context) => {
      // console.log('payload visit comp tree', payload)
      const node = payload.treeNode
      if (payload.componentInstance.type.meow) {
        node.tags.push({
          label: 'meow',
          textColor: 0x000000,
          backgroundColor: 0xff984f
        })
      }
    })

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
   

    api.on.getInspectorState((payload, context) => {
      // console.log('copyofstate 204', copyOfState)
      if (payload.inspectorId === inspectorId) {
        if (copyOfState[payload.nodeId]) {
          payload.state = {};
          const stateObj = toRaw(copyOfState[payload.nodeId][copyOfState[payload.nodeId].length - 1]);
          // console.log('getInspectorState is running')
          // console.log('stateObj:', stateObj)
          // console.log("copyOfState[payload.nodeId][0] keys", Object.keys(copyOfState[payload.nodeId][0]))
          // console.log('toRaw:', toRaw(copyOfState[payload.nodeId][0]))
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

    // window.addEventListener('click', event => {
    //   api.addTimelineEvent({
    //     layerId: timelineLayerId,
    //     event: {
    //       time: Date.now(),
    //       data: {
    //         mouseX: event.clientX,
    //         mouseY: event.clientY
    //       }
    //     }
    //   })
    // })
    window.addEventListener('click', event => {
      const groupId = 'group-1'

      devtoolsApi.addTimelineEvent({
        layerId: timelineLayerId,
        event: {
          time: Date.now(),
          data: {
            label: 'group test'
          },
          title: 'group test',
          groupId
        }
      })

      devtoolsApi.addTimelineEvent({
        layerId: timelineLayerId,
        event: {
          time: Date.now() + 10,
          data: {
            label: 'group test (event 2)',
          },
          title: 'group test',
          groupId
        }
      })

      devtoolsApi.addTimelineEvent({
        layerId: timelineLayerId,
        event: {
          time: Date.now() + 20,
          data: {
            label: 'group test (event 3)',
          },
          title: 'group test',
          groupId
        }
      })
    })
  })

  return devtools
}
