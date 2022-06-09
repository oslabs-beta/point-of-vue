import { MyPluginData } from './data';
export declare function setupDevtools(app: any, data: MyPluginData): {
    trackStart: (label: string) => () => void;
};
