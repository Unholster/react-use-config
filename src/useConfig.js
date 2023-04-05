import React, {
	createContext, useEffect, useMemo, useState,
  } from 'react'
  
  export const ConfigContext = createContext()
  
  export function ConfigProvider({
	children,
	configPath = 'config.json',
  }) {
	const [config, setConfig] = useState({})
	const [flags, setFlags] = useState([])
  
	const formatFlags = (flagConfig) => Object.keys(flagConfig).map((key) => ({ isActive: flagConfig[key], name: key }))
  
	useEffect(() => {
	  fetch(configPath, {
		headers: {
		  Accept: 'application/json',
		  'Content-Type': 'application/json',
		},
	  })
		.then((r) => r.json())
		.then((json) => {
		  console.log('json', json)
		  const data = json || {}
		  setConfig(data)
		  const flagConfig = data.flags || {}
		  setFlags(formatFlags(flagConfig))
		})
		.catch(() => {
		  setConfig({})
		  setFlags([])
		})
	}, [])
  
	const value = useMemo(() => ({ config, flags }), [config, flags])
  
	return (
	  <ConfigContext.Provider value={value}>
		{children}
	  </ConfigContext.Provider>
	)
  }
  