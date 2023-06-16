# react-use-config
Hook that provides runtime configuration via a hosted config.json file

# Example

````typescript
import { useConfig, ConfigProvider } from '@unholster/react-use-config'

const CONFIG_PATH = ...

// to set default config add new or derive from existing config. Is optional.
const configAdapter = (config: ConfigType): AdaptedConfigType => {
  return {
    ...config,
    // add any additional properties here
  }
}

<ConfigProvider configPath={CONFIG_PATH} configAdapter={configAdapter} >
  <App />
</ConfigProvider>


function App() {
  const config = useConfig<AdaptedConfigType>()
  ...
}

````
