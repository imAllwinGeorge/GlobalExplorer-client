import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter } from 'react-router-dom'
import App from './presentation/App'
import { Provider } from 'react-redux'
import { persistor, store } from './presentation/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <Toaster />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
