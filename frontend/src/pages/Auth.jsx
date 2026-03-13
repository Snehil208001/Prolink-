import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, Form, Input, Button, message } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import { login, signup } from '../api/auth'
import './Auth.css'

function Auth() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { login: authLogin, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSignIn = async (values) => {
    setLoading(true)
    try {
      const token = await login({ email: values.email, password: values.password })
      authLogin(token)
      message.success('Signed in successfully')
      navigate('/feed')
    } catch (err) {
      message.error(err.body || err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (values) => {
    setLoading(true)
    try {
      const user = await signup({ name: values.name, email: values.email, password: values.password })
      const token = await login({ email: values.email, password: values.password })
      authLogin(token, user)
      message.success('Account created successfully')
      navigate('/feed')
    } catch (err) {
      message.error(err.body || err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const loginForm = (
    <Form name="signin" onFinish={handleSignIn} layout="vertical" size="large">
      <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <a href="#" className="auth-forgot">Forgot Password?</a>
      </div>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="auth-submit" block loading={loading}>
          Sign In
        </Button>
      </Form.Item>
    </Form>
  )

  const signupForm = (
    <Form name="signup" onFinish={handleSignUp} layout="vertical" size="large">
      <Form.Item name="name" rules={[{ required: true, message: 'Please input your Full Name!' }]}>
        <Input prefix={<UserOutlined />} placeholder="Full Name" />
      </Form.Item>
      <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!', min: 6 }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="Password (min 6 chars)" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="auth-submit" block loading={loading}>
          Create Account
        </Button>
      </Form.Item>
    </Form>
  )

  const tabItems = [
    { key: 'signin', label: 'Sign In', children: loginForm },
    { key: 'signup', label: 'Create Account', children: signupForm },
  ]

  return (
    <div className={`auth-page ${theme}`}>
      <div className="auth-left">
        <div className="auth-logo">
          <Logo size={64} invert />
        </div>
        <div className="auth-illustration">
          <div className="auth-net">
            <div className="an an1" />
            <div className="an an2" />
            <div className="an an3" />
            <div className="an an4" />
            <div className="an an5" />
          </div>
        </div>
        <p className="auth-quote">
          "Where professionals connect and conversations create opportunities."
        </p>
      </div>

      <div className="auth-right">
        <button className="theme-toggle auth-theme" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div className="auth-card card">
          <div className="auth-card-logo">
            <Logo size={48} showText />
          </div>

          <Tabs defaultActiveKey="signin" items={tabItems} centered animated={{ inkBar: true, tabPane: true }} />
        </div>
      </div>
    </div>
  )
}

export default Auth
