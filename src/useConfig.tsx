import React, {
  createContext, useContext, useEffect, useState,
} from 'react';

const ConfigContext = createContext(undefined);

export function useConfig() {
  return useContext(ConfigContext);
}

interface ConfigProviderProps <Config = unknown, AdaptedConfig = Config> {
  children: ReactNode;
  configPath: string;
  adapter?: (config: Config) => AdaptedConfig;
}

export function ConfigProvider<Config, AdaptedConfig>({ children, configPath = 'config.json', adapter}: ConfigProviderProps) {
  const [config, setConfig] = useState<Config | AdaptedConfig | {}>({});

  useEffect(() => {
    fetch(configPath, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((r) => r.json())
      .then((json) => {
        const data = json || {};
        const adaptedData: AdaptedConfig = adapter ? adapter(data) : data
        setConfig(adaptedData);
      })
      .catch((err) => {
        setConfig({});
        console.warn(`Couldn't load config from ${configPath}:\n ${err}`);
      });
  }, []);

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}
