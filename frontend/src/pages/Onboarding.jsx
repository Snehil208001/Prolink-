import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Typography, Steps, Space } from 'antd'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import './Onboarding.css'

const { Title, Text } = Typography

const screens = [
  {
    title: 'Build Your Professional Network',
    desc: 'Connect with professionals and grow your career opportunities.',
    icon: '🌐',
    illustration: 'network',
  },
  {
    title: 'Chat and Collaborate',
    desc: 'Start conversations and collaborate instantly with your network.',
    icon: '💬',
    illustration: 'chat',
  },
  {
    title: 'Discover Opportunities',
    desc: 'Explore projects, collaborations, and career opportunities.',
    icon: '✨',
    illustration: 'opportunities',
  },
]

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1)
    } else {
      localStorage.setItem('prolink-onboarding', 'done')
      onComplete?.()
      navigate('/auth')
    }
  }

  const items = screens.map((s, index) => ({
    key: index,
  }))

  return (
    <div className={`onboarding ${theme}`}>
      <div className="onboarding-logo">
        <Logo size={40} />
      </div>
      <button className="theme-toggle onboarding-theme" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="onboarding-content">
        <div className={`onboarding-illustration ill-${screens[step].illustration}`}>
          {screens[step].illustration === 'network' && (
            <div className="ill-network">
              <div className="n n1" />
              <div className="n n2" />
              <div className="n n3" />
              <div className="n n4" />
              <div className="n center" />
              <svg className="lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="50" y1="50" x2="20" y2="25" />
                <line x1="50" y1="50" x2="80" y2="25" />
                <line x1="50" y1="50" x2="20" y2="75" />
                <line x1="50" y1="50" x2="80" y2="75" />
              </svg>
            </div>
          )}
          {screens[step].illustration === 'chat' && (
            <div className="ill-chat">
              <div className="msg msg-1" />
              <div className="msg msg-2" />
              <div className="msg msg-3" />
            </div>
          )}
          {screens[step].illustration === 'opportunities' && (
            <div className="ill-opportunities">
              <div className="opp opp-1" />
              <div className="opp opp-2" />
              <div className="opp opp-3" />
            </div>
          )}
        </div>

        <Title level={2} style={{ margin: '0 0 12px' }}>{screens[step].title}</Title>
        <Text type="secondary" style={{ fontSize: 16, display: 'block', marginBottom: 32 }}>
          {screens[step].desc}
        </Text>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Steps
            current={step}
            items={items}
            progressDot
            style={{ width: 120, margin: '0 auto' }}
          />
          <Button type="primary" size="large" block onClick={handleNext} style={{ height: 48, fontSize: 16 }}>
            {step < screens.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default Onboarding
