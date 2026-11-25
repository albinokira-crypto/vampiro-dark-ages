import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registrarServiceWorkerAtualizacao } from './services/autoUpdate'
import { getTemaSalvo, aplicarTema } from './services/theme'

aplicarTema(getTemaSalvo())

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

registrarServiceWorkerAtualizacao()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
