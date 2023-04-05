# react-use-config
Hook that provides runtime configuration via a hosted config.json file

# Example

````javascript
import { useConfig, ConfigProvider } from '@unholster/react-use-config'

const CONFIG_PATH = ...

<ConfigProvider configPath={CONFIG_PATH}>
  <App />
</ConfigProvider>


function App() {
  const config = useConfig()
  ...
}

````
