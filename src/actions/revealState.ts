// Actions: Display State File
//     - actionGlobalCopyState: copies global state to clipboard
//      - actionGlobalPasteState: pastes global state from clipboard
//      - actionGlobalSaveState: saves state as json
//      - getFileOpener ??
//      - openFile ??
//      - actionGlobalOpenStateFile ??

//import { appendFile } from "fs";

//          --computed state functions: how do we grab, separate fxn ?

// ^^ functions Pinia used to display state
//     - do we need all these ? Do we want to utilize the clipboard system?

// //     - function to track changes in composition state fxns ? (  see Johannes file)


//app.config.globalProperties.stateArray = [];

export default {
  // type of state needs to be proxy?
  getCompState : (state: object): object => {
    const copyOfState: object = state;
    console.log("copyOfState:", copyOfState);
    return copyOfState;
  }
}
