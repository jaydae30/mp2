import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import ServicesProvider from './context/ServicesProvider.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ServicesProvider>
        <App />
      </ServicesProvider>
    </BrowserRouter>
  </StrictMode>,
)
