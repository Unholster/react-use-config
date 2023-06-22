import React, { Context, ReactNode, createContext, useContext, useEffect, useState } from "react"

type GenericConfig<T extends object> = T

interface ConfigProviderProps<Config = object, AdaptedConfig = Config> {
  children: ReactNode
  configPath: string
  adapter?: (config: Config) => AdaptedConfig
}

const ConfigContext = createContext<GenericConfig<object>>({})

export function useConfig<T extends object>() {
  return useContext<GenericConfig<T>>(ConfigContext as unknown as Context<GenericConfig<T>>)
}

export function ConfigProvider<
  Config extends object, 
  AdaptedConfig extends object = Config
>({
  children,
  configPath = "config.json",
  adapter,
}: ConfigProviderProps) {
  const [config, setConfig] = useState<AdaptedConfig>({} as AdaptedConfig)

  useEffect(() => {
    fetch(configPath, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((json) => {
        const data = json || {}
        const adaptedData: AdaptedConfig = adapter ? adapter(data) : data
        setConfig(adaptedData)
      })
      .catch((err) => {
        setConfig({} as AdaptedConfig)
        console.warn(`Couldn't load config from ${configPath}:\n ${err}`)
      })
  }, [])

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}
