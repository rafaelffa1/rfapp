/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

global.context = 'http://192.168.0.102:8002';

AppRegistry.registerComponent(appName, () => App);
