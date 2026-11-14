export const setApi = (state) => {
    const api = {
        setTheme: (theme) => (state.currentTheme = theme),
        setCurrentLevel: (n) => (state.currentLevel = n),
    };
    return api;
};
//# sourceMappingURL=api.js.map