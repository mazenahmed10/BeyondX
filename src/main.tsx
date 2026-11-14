import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { App } from './app/App'

// Development only: lets automated checks drive the app state. Not present in production builds.
if (import.meta.env.DEV) {
  void Promise.all([import('./app/store'), import('./app/storyStore'), import('./app/kidStore')]).then(([a, s, k]) => {
    ;(window as unknown as Record<string, unknown>).__btm = { app: a.useAppStore, story: s.useStoryStore, kid: k.useKidStore }
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
