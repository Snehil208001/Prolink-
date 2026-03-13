import { useEffect } from 'react'
import { Typography } from 'antd'
import Logo from '../components/Logo'
import './Splash.css'

const { Title, Text } = Typography

function Splash({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="splash">
      <div className="splash-bg" />
      <div className="splash-nodes">
        <div className="node node-1" />
        <div className="node node-2" />
        <div className="node node-3" />
        <div className="node node-4" />
        <div className="node node-5" />
        <div className="bubble bubble-1">💬</div>
        <div className="bubble bubble-2">💬</div>
      </div>
      <div className="splash-content">
        <div className="splash-logo">
          <Logo size={100} invert />
        </div>
        <Title style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          ProLink
        </Title>
        <Text style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
          Connect. Collaborate. Converse.
        </Text>
      </div>
    </div>
  )
}

export default Splash
