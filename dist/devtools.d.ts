declare function setupDevtools(app: any): {
    trackStart: (label: string) => () => void;
};
export default setupDevtools;
