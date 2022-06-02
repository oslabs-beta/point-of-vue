import { MyPluginData } from './data';
export declare const getCompState: (state: object, stateName: string) => void;
export declare function setupDevtools(app: any, data: MyPluginData): {
    trackStart: (label: string) => () => void;
};
