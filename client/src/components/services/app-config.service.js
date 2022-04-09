export const getConfig = () => {
    const _appConfig = window['appConfig']
        return _appConfig.user
}

export const setConfig = (config) => {
    const _appConfig = window['appConfig']
    _appConfig.user= config
}


