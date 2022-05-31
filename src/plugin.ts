// //     - Initial setup and registration of our dev tool
// //     - Where we initialize our timeline layers
// //     - Initialize our state panel
// //     - Populate our timeline
// //     - Import the formatted state from our format file
// //     - Populate our state panel with this info

// // setupDevtoolsPlugin function
// import { setupDevtoolsPlugin } from '@vue/devtools-api'
// import { App } from 'vue'

// export function setupDevtools (app: App) {
//   setupDevtoolsPlugin({ 
//     id: 'point-of-vue-plugin',
//     label: 'Point of Vue',
//     packageName: 'pointofvue',
//     homepage: 'https://vuejs.org',
//     settings: {
//     test1: {
//       label: 'I like vue devtools',
//       type: 'boolean',
//       defaultValue: true
//     },
//     test2: {
//       label: 'Quick choice',
//       type: 'choice',
//       defaultValue: 'a',
//       options: [
//         { value: 'a', label: 'A' },
//         { value: 'b', label: 'B' },
//         { value: 'c', label: 'C' }
//       ],
//       component: 'button-group'
//     },
//     test3: {
//       label: 'Long choice',
//       type: 'choice',
//       defaultValue: 'a',
//       options: [
//         { value: 'a', label: 'A' },
//         { value: 'b', label: 'B' },
//         { value: 'c', label: 'C' },
//         { value: 'd', label: 'D' },
//         { value: 'e', label: 'E' }
//       ]
//     },
//     test4: {
//       label: 'What is your name?',
//       type: 'text',
//       defaultValue: ''
//     }
//   },
//     app
//   },
//     // The second argument of setupDevtoolsPlugin is a callback which will get the Vue Devtools API as the first argument:
//     (api) => {
//       console.log(api.getSettings());
//     // api.addTimelineLayer({
//     //   id: STATE_LAYER,
//     //   label: 'Test Layer',
//     //   color: 0xe5df88
//     // });
//   })
// }

export{}