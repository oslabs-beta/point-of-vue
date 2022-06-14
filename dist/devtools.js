import { setupDevtoolsPlugin } from '@vue/devtools-api';
import deepCopy from './deepCopy';
/* Debounce function */
const debounce = (fn, timeout = 500) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { fn.apply(this, args); }, timeout);
    };
};
/* Plugin Functionality */
export function setupDevtools(app) {
    const stateType = 'POV Plugin State';
    const inspectorId = 'point-of-vue-plugin';
    const timelineLayerId = 'pov-state';
    let currentState = {};
    let copyOfState = {};
    let devtoolsApi;
    let trackId = 0;
    const groupId = 'group-1';
    let eventCounter = 1;
    /* Creates a deepy copy of current state and pushes to copyOfState in order to remove reference in memory */
    const currentToCopy = (current, copy) => {
        const temp = deepCopy(current);
        for (const key in temp) {
            if (!copy[key]) {
                copy[key] = [];
            }
            copy[key].push(temp[key]);
        }
    };
    /* Pulls corresponding copy of state and assigns it to the event in the timeline */
    const getEventState = (index) => {
        const eventState = {};
        for (const key in copyOfState) {
            eventState[key] = deepCopy(copyOfState[key][index]);
        }
        return eventState;
    };
    /* Grabs the state of the application from the devtools api */
    const getCompState = () => {
        let hasBeenCalled = false;
        const inner = (stateArr) => {
            if (hasBeenCalled === false) {
                hasBeenCalled = true;
                stateArr.forEach((obj) => {
                    if (obj.type === 'provided') {
                        currentState[obj.key] = {};
                        for (const property in obj.value) {
                            const types = Object.values(obj.value[property]).map(el => typeof el);
                            if (!types.includes('function')) {
                                if (obj.value[property].__v_isRef === true) {
                                    currentState[obj.key][property] = obj.value[property].value;
                                }
                                else {
                                    currentState[obj.key][property] = obj.value[property];
                                }
                            }
                        }
                    }
                });
                currentToCopy(currentState, copyOfState);
                // application changes triger new deep copy of state to be pushed into timeline
                window.addEventListener('click', () => {
                    currentToCopy(currentState, copyOfState);
                    const groupId = 'group-1';
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
                    });
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
                });
            }
        };
        return inner;
    };
    const inspectComponentToInspectorState = getCompState();
    const devtools = {
        trackStart: (label) => {
            const groupId = 'track' + trackId++;
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
            });
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
                });
            };
        }
    };
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
        });
        api.on.getInspectorTree((payload, context) => {
            if (payload.inspectorId === inspectorId) {
                payload.rootNodes = [];
                for (const key in currentState) {
                    payload.rootNodes.push({
                        id: `${key}`,
                        label: `${key}`
                    });
                }
            }
        });
        api.on.getInspectorState((payload) => {
            if (payload.inspectorId === inspectorId) {
                if (currentState[payload.nodeId]) {
                    payload.state = {};
                    for (const key in currentState[payload.nodeId]) {
                        payload.state[key] = [];
                        for (const prop in currentState[payload.nodeId][key])
                            payload.state[key].push({
                                key: prop,
                                value: currentState[payload.nodeId][key][prop],
                                editable: true
                            });
                    }
                }
            }
        });
        setInterval(() => {
            api.sendInspectorTree(inspectorId);
        }, 500);
        api.on.editInspectorState(payload => {
            if (payload.inspectorId === inspectorId) {
                if (currentState[payload.nodeId]) {
                    currentState[payload.nodeId][payload.type][payload.path.toString()] = payload.state.value;
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
        });
        //onMounted()
        api.on.inspectComponent((payload, context) => {
            inspectComponentToInspectorState(payload.instanceData.state);
        });
        api.addTimelineLayer({
            id: timelineLayerId,
            color: 0xff984f,
            label: 'Point-Of-Vue'
        });
    });
    return devtools;
}
;
