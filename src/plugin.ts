//     - Initial setup and registration of our dev tool
//     - Where we initialize our timeline layers
//     - Initialize our state panel
//     - Populate our timeline
//     - Import the formatted state from our format file
//     - Populate our state panel with this info

// setupDevtoolsPlugin function
import { setupDevtoolsPlugin } from '@vue/devtools-api'

export function setupDevtools (app) {
  setupDevtoolsPlugin({ 
    id: 'point-of-vue-plugin',
    label: 'Point of Vue',
    packageName: 'pointofvue',
    homepage: 'https://vuejs.org',
    app
  },
    // The second argument of setupDevtoolsPlugin is a callback which will get the Vue Devtools API as the first argument:
    (api) => {
      console.log(api.getSettings());
    // api.addTimelineLayer({
    //   id: STATE_LAYER,
    //   label: 'Test Layer',
    //   color: 0xe5df88
    // });
  })
}

