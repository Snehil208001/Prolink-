import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
})
import { UnreadProvider } from './context/UnreadContext'
import { NotificationProvider } from './context/NotificationContext'
import { ChatWebSocketProvider } from './context/ChatWebSocketContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <UnreadProvider>
              <NotificationProvider>
                <ChatWebSocketProvider>
                  <App />
                </ChatWebSocketProvider>
              </NotificationProvider>
            </UnreadProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
