const mockLocalStorage = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = String(value);
        },
        clear: () => (store = {}),
    };
})();

export default mockLocalStorage;
