<p align="center">
  <img src="./assets/pov-header.png">
</p>

**Point-of-Vue is a Vue Devtool Plugin which brings advanced state debugging tools to the native Vue Composition API. Learn more about Point-of-Vue through our [Medium]() article.**

* Displays the current state of your Vue application
* Provides a time-line of all previous states for time-travel debugging
* In-browser editing for edge-case testing

[Homepage]() |
[NPM](https://www.npmjs.com/package/point-of-vue) | 
[LinkedIn]()


# Install with Yarn or NPM
```bash
npm install point-of-vue

or

yarn add point-of-vue
```

# Integrate into Vue App
```javascript
// main.js
import { createApp } from 'vue'
import pointofvue from 'point-of-vue'

const app = createApp(App);

app.use(pointofvue);
```

# Getting Started In Devtools
## Accessing the State Panel:
![State Panel](/assets/state-panel-demo.gif)
## Point-of-Vue Timeline:
![State Timeline](/assets/state-timeline.gif)
## Editing State Within Point-of-Vue:
![State Editing](/assets/state-editor%20demo.gif)
## Trouble shooting:
If Point-of-Vue isn't showing up, click into the Components tab, then click back into Point-of-Vue tab in Devtools
![Troubleshoot](/assets/troubleshoot.gif)

# License
## [MIT](https://opensource.org/licenses/MIT)