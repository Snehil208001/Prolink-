import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { UnreadProvider } from './context/UnreadContext'
import { ChatWebSocketProvider } from './context/ChatWebSocketContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UnreadProvider>
            <ChatWebSocketProvider>
              <App />
            </ChatWebSocketProvider>
          </UnreadProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
