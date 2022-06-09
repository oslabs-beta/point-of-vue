/*!
  * point-of-vue v0.1.7
  * (c) 2022 
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('@vue/devtools-api');
require('vue');

let copyOfState = {};
const getCompState = (state, stateName) => {
    console.log("copyOfState:", copyOfState);
    if (!copyOfState[stateName]) {
        copyOfState[stateName] = [];
    }
    copyOfState[stateName].push(state);
};

function install(app, options = {}) {
}

exports["default"] = install;
exports.getCompState = getCompState;
