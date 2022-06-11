"use strict";
const getCompState = () => {
    let hasBeenCalled = false;
    const inner = (stateArr) => {
        if (hasBeenCalled === false) {
            hasBeenCalled = true;
            stateArr.forEach((obj) => {
                if (obj.type === 'provided') {
                    currentState[obj.key] = {};
                    //const valArr: object[] = Object.values(obj.value);
                    //const keyArr: string[] = Object.keys(obj.value);
                    //for (let i = 0; i < valArr.length; i++){
                    for (const property in obj.value) {
                        const types = Object.values(obj.value[property]).map(el => typeof el);
                        if (!types.includes('function')) {
                            currentState[obj.key][property] = obj.value[property];
                        }
                    }
                }
            });
            currentToCopy(currentState, copyOfState);
            console.log("copyOfState:", copyOfState);
            window.addEventListener('click', event => {
                currentToCopy(currentState, copyOfState);
                console.log("copyOfState:", copyOfState);
                //console.log("added copy of state");
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
                console.log("added timeline event");
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
                });
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
            });
        }
    };
    return inner;
    //}
};
