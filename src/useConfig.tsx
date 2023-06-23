import React, { Context, ReactNode, createContext, useContext, useEffect, useState } from "react"

type GenericConfig<T extends object> = {
  isError: boolean
  isLoading: boolean
  config: T
}

interface ConfigProviderProps<Config = object, AdaptedConfig = Config> {
  children: ReactNode
  configPath: string
  adapter?: (config: Config) => AdaptedConfig
}

const ConfigContext = createContext<GenericConfig<object>>({
  isError: false,
  isLoading: true,
  config: {}
})

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
  const initial = adapter ? adapter({}) : {}
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
        const adaptedData: AdaptedConfig = adapter ? adapter(data) : data
        setConfig(adaptedData)
      })
      .catch((err) => {
        setConfig({} as AdaptedConfig)
        setIsError(true)
        console.warn(`Couldn't load config from ${configPath}:\n ${err}`)
      }).finally(() => {
        setIsLoading(false)
      })
  }, [])

  const value = {
    isLoading,
    isError,
    config
  }

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}
