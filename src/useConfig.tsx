import React, { Context, createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"

type DefaultConfig = { [key: string]: any } | ((...args: any[]) => any)

type GenericConfig<T extends object> = {
  isError: boolean
  isLoading: boolean
  config: T,
  defaultConfig: DefaultConfig,
}

interface ConfigProviderProps<Config = object, AdaptedConfig = Config> {
  children: ReactNode
  configPath: string
  defaultConfig: DefaultConfig
}

const ConfigContext = createContext<GenericConfig<object>>({
  config: {},
  defaultConfig: {},
  isError: false,
  isLoading: true,
})


function getInitialConfig(defaultConfig: DefaultConfig, config: object): object {
  if (typeof defaultConfig === "function") {
    return defaultConfig(config)
  } 
    return { ...defaultConfig, ...config }
  
}

export function useConfig<T extends object>(localDefault: DefaultConfig = {}) {
  const context = useContext<GenericConfig<T>>(ConfigContext as unknown as Context<GenericConfig<T>>)
  const { config, defaultConfig } = context
  return {...context, config: {
    ...getInitialConfig(defaultConfig, config), ...getInitialConfig(localDefault, config), ...config
  }}
}

export function ConfigProvider<
  Config extends object,
  AdaptedConfig extends object = Config
>({
  children,
  configPath = "/config.json",
  defaultConfig = {},
}: ConfigProviderProps) {
  const initial = getInitialConfig(defaultConfig, {})
  const [config, setConfig] = useState<AdaptedConfig>(initial as AdaptedConfig)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)
    fetch(configPath, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((json) => {
        const data = json || {}
        setConfig(data)
      })
      .catch((err) => {
        setConfig({} as AdaptedConfig)
        setIsError(true)
        console.warn(`Couldn't load config from ${configPath}:\n ${err}`)
      }).finally(() => {
        setIsLoading(false)
      })
  }, [])


  const value = useMemo(() => ({
    config,
    defaultConfig,
    isError,
    isLoading,
  }), [config, defaultConfig, isError,  isLoading])

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}
