import './styles/theme.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from './context/CartContext'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </HashRouter>
    </QueryClientProvider>
  </StrictMode>,
)
