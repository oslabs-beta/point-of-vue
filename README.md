<p align="center">
  <img src="./assets/pov-header.png">
</p>

**Point-of-Vue is a Vue Devtool Plugin which brings advanced state debugging tools to the native Vue Composition API. Learn more about Point-of-Vue through our [Medium](https://medium.com/@shelbydneuman/introducing-point-of-vue-aaf45ee3f0d ) article.**

* Displays the current state of your Vue application
* Provides a time-line of all previous states for time-travel debugging
* In-browser editing for edge-case testing

[Homepage](https://povjs.com/index.html) |
[NPM](https://www.npmjs.com/package/point-of-vue)

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
![State Panel](/assets/state-panel-crop.gif)
## Point-of-Vue Timeline:
![State Timeline](/assets/timeline-crop.gif)
## Editing State Within Point-of-Vue:
![State Editing](/assets/state-edits-recrop.gif)
## Trouble shooting:
If Point-of-Vue isn't showing up, click into the Components tab, then click back into Point-of-Vue tab in Devtools <br>
![Troubleshoot](/assets/troubleshoot-crop.gif)

# Contribute to Point-of-Vue

Point of Vue is an open source project backed by tech incubator OSLabs and is primed for iteration. Contributions are not only welcome but highly recommended, we believe that every open source contribution makes the entire community that much better.
**Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.**

## Features and improvements we’ve started or would like to see implemented:

* Expanding functionality to include state created with Pinia

* Expanding the edit feature to include the ability to edit deeply-nested state
 
* Currently the user must first visit the Inspect Components tab of the Vue devtools to be able to access state in the Point-Of-Vue tab, a future improvement could avoid this minor inconvenience, improving the UX

## Use a Consistent Coding Style (Airbnb)

We have our included our eslint setup in this repo to make this as painless as possible. Please also install the VS Code Eslint extension.


# Authors
[Will Robson](https://www.linkedin.com/in/william-k-robson/) | [@wrobson5467](https://github.com/wrobson5467) <br>
[Shelby Neuman](https://www.linkedin.com/in/shelbyneuman/) | [@shelbydneuman](https://github.com/shelbydneuman) <br>
[Tony Lei](https://www.linkedin.com/in/tony-lei/) | [@tonylei00](https://github.com/tonylei00) <br>
[Tristen Francis](https://www.linkedin.com/in/tristen-francis/) | [@TristenJF](https://github.com/TristenJF)

# License
### Point of Vue is developed under the [MIT License](https://opensource.org/licenses/MIT)