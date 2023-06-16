import React, { ReactNode, createContext, useContext, useEffect, useState } from "react"

const ConfigContext = createContext<unknown>({})

export function useConfig<AdaptedConfig = unknown>() {
  return useContext<AdaptedConfig | unknown>(ConfigContext)
}

interface ConfigProviderProps<Config = object, AdaptedConfig = Config> {
  children: ReactNode
  configPath: string
  adapter?: (config: Config) => AdaptedConfig
}

export function ConfigProvider<Config, AdaptedConfig>({
  children,
  configPath = "config.json",
  adapter,
}: ConfigProviderProps) {
  const [config, setConfig] = useState<Config | AdaptedConfig | object>({})

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
        setConfig({})
        console.warn(`Couldn't load config from ${configPath}:\n ${err}`)
      })
  }, [])

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}
