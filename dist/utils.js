// Debouncer to only push state when user finishes typing something out
const debounce = (fn, timeout = 600) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { fn.apply(this, args); }, timeout);
    };
};
// Deep copy algorithm to remove object reference from memory/Create a new object in memory
const deepCopy = (input) => {
    if (typeof input !== 'object')
        return input;
    let copy = new input.constructor();
    for (const key in input) {
        const element = input[key];
        copy[key] = deepCopy(element);
    }
    return copy;
};
export { debounce, deepCopy };
