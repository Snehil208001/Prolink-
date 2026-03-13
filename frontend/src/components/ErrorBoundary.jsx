import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('React Error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 24,
          maxWidth: 600,
          margin: '40px auto',
          fontFamily: 'system-ui, sans-serif',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ color: '#c00', marginBottom: 12 }}>Something went wrong</h2>
          <pre style={{
            background: '#f5f5f5',
            padding: 16,
            overflow: 'auto',
            fontSize: 12,
            borderRadius: 4,
          }}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <button
            onClick={() => this.setState({ error: null })}
            style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
