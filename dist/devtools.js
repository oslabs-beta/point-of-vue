import { setupDevtoolsPlugin } from '@vue/devtools-api';
import { deepCopy, debounce } from './utils';
/* Plugin Functionality */
function setupDevtools(app) {
    const stateType = 'POV Plugin State';
    const inspectorId = 'point-of-vue-plugin';
    const timelineLayerId = 'pov-state';
    const currentState = {};
    const copyOfState = {};
    let devtoolsApi;
    let trackId = 0;
    let groupId = 'group-1';
    let eventCounter = 1;
    /* Creates a deep copy of current state, pushes to copyOfState to remove reference in memory */
    const currentToCopy = (current, copy) => {
        const temp = deepCopy(current);
        const tempKeys = Object.keys(temp);
        tempKeys.forEach((key) => {
            if (!copy[key]) {
                copy[key] = [];
            }
            copy[key].push(temp[key]);
        });
    };
    /* Pulls corresponding copy of state and assigns it to the event in the timeline */
    const getEventState = (index) => {
        const eventState = {};
        const copyOfStateKeys = Object.keys(copyOfState);
        copyOfStateKeys.forEach((key) => {
            eventState[key] = deepCopy(copyOfState[key][index]);
        });
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
                        const objKeys = Object.keys(obj.value);
                        objKeys.forEach((property) => {
                            const types = Object.values(obj.value[property]).map((el) => typeof el);
                            if (!types.includes('function')) {
                                currentState[obj.key][property] = obj.value[property];
                            }
                        });
                    }
                });
                currentToCopy(currentState, copyOfState);
                // application changes triger new deep copy of state to be pushed into timeline
                window.addEventListener('click', () => {
                    currentToCopy(currentState, copyOfState);
                    devtoolsApi.addTimelineEvent({
                        layerId: timelineLayerId,
                        event: {
                            time: Date.now(),
                            data: getEventState(eventCounter),
                            title: `event ${eventCounter}`,
                            groupId,
                        },
                    });
                    eventCounter += 1;
                });
                window.addEventListener('keyup', debounce(() => {
                    currentToCopy(currentState, copyOfState);
                    devtoolsApi.addTimelineEvent({
                        layerId: timelineLayerId,
                        event: {
                            time: Date.now(),
                            data: getEventState(eventCounter),
                            title: `event ${eventCounter}`,
                            groupId,
                        },
                    });
                    eventCounter += 1;
                }));
                devtoolsApi.addTimelineEvent({
                    layerId: timelineLayerId,
                    event: {
                        time: Date.now(),
                        data: getEventState(0),
                        title: 'Default State',
                        groupId,
                    },
                });
            }
        };
        return inner;
    };
    const inspectComponentToInspectorState = getCompState();
    const devtools = {
        trackStart: (label) => {
            groupId = `track${trackId += 1}`;
            devtoolsApi.addTimelineEvent({
                layerId: timelineLayerId,
                event: {
                    time: Date.now(),
                    data: {
                        label,
                    },
                    title: label,
                    groupId,
                },
            });
            return () => {
                devtoolsApi.addTimelineEvent({
                    layerId: timelineLayerId,
                    event: {
                        time: Date.now(),
                        data: {
                            label,
                            done: true,
                        },
                        title: label,
                        groupId,
                    },
                });
            };
        },
    };
    setupDevtoolsPlugin({
        id: 'point-of-vue-plugin',
        label: 'Point Of Vue Plugin',
        packageName: 'point-of-vue',
        homepage: 'https://vuejs.org',
        componentStateTypes: [stateType],
        enableEarlyProxy: true,
        app,
    }, (api) => {
        devtoolsApi = api;
        api.addInspector({
            id: inspectorId,
            label: 'Point-Of-Vue!',
            icon: 'visibility',
        });
        api.on.getInspectorTree((payload) => {
            if (payload.inspectorId === inspectorId) {
                payload.rootNodes = [];
                Object.keys(currentState).forEach((key) => {
                    payload.rootNodes.push({
                        id: `${key}`,
                        label: `${key}`,
                    });
                });
            }
        });
        api.on.getInspectorState((payload) => {
            const currentToInspector = (input, key, property = key) => {
                if (input[key].__v_isRef === true) {
                    payload.state[property].push({
                        key: input[key]._value,
                        value: input[key]._value,
                        editable: true,
                    });
                }
                else {
                    const inputKeyKeys = Object.keys(input[key]);
                    inputKeyKeys.forEach((prop) => {
                        payload.state[property].push({
                            key: prop,
                            value: input[key][prop],
                            editable: true,
                        });
                    });
                }
                // }
            };
            if (payload.inspectorId === inspectorId) {
                if (currentState[payload.nodeId]) {
                    payload.state = {};
                    const currentStatePayloadKeys = Object.keys(currentState[payload.nodeId]);
                    currentStatePayloadKeys.forEach((key) => {
                        payload.state[key] = [];
                        currentToInspector(currentState[payload.nodeId], key);
                    });
                }
            }
        });
        setInterval(() => {
            api.sendInspectorTree(inspectorId);
        }, 500);
        api.on.editInspectorState((payload) => {
            const inspectorStateToCurrent = (input) => {
                if (input.__v_isRef === true) {
                    input.value = payload.state.value;
                }
                else {
                    input[payload.path.toString()] = payload.state.value;
                }
            };
            if (payload.inspectorId === inspectorId) {
                if (currentState[payload.nodeId]) {
                    inspectorStateToCurrent(currentState[payload.nodeId][payload.type]);
                    currentToCopy(currentState, copyOfState);
                    devtoolsApi.addTimelineEvent({
                        layerId: timelineLayerId,
                        event: {
                            time: Date.now(),
                            data: getEventState(eventCounter),
                            title: `event ${eventCounter}`,
                            groupId,
                        },
                    });
                    eventCounter += 1;
                }
            }
        });
        api.on.inspectComponent((payload) => {
            inspectComponentToInspectorState(payload.instanceData.state);
        });
        api.addTimelineLayer({
            id: timelineLayerId,
            color: 0xff984f,
            label: 'Point-Of-Vue',
        });
    });
    return devtools;
}
export default setupDevtools;
