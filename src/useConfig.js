import React, { createContext, useContext, useEffect, useState } from "react"

const ConfigContext = createContext()

export function useConfig() {
  return useContext(ConfigContext)
}

export function ConfigProvider({ children, configPath = "config.json" }) {
  const [config, setConfig] = useState({})

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
        setConfig(data)
      })
      .catch((err) => {
        setConfig({})
        console.warn(`Couldn't load config from ${configPath}:\n ${err}`)
      })
  }, [])

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}
