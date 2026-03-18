import { useState } from 'react'
import { Avatar, Input, Button } from 'antd'
import {
  PictureOutlined,
  FileTextOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import './ComposePost.css'

export default function ComposePost({ user, onSubmit, posting }) {
  const [composeText, setComposeText] = useState('')
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

  const handleSubmit = () => {
    const content = composeText?.trim()
    if (!content) return
    onSubmit(content)
    setComposeText('')
  }

  return (
    <div className="feed-compose">
      <div className="compose-inner">
        <Avatar size={48} style={{ backgroundColor: 'var(--primary)' }}>{initials}</Avatar>
        <div className="compose-input-wrap">
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 4 }}
            placeholder={`Start a post, ${user?.name || 'there'}...`}
            value={composeText}
            onChange={(e) => setComposeText(e.target.value)}
            onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleSubmit() } }}
            className="compose-input-antd"
            variant="borderless"
          />
          <div className="compose-actions">
            <Button type="text" icon={<PictureOutlined />} className="compose-btn">
              Photo
            </Button>
            <Button type="text" icon={<VideoCameraOutlined />} className="compose-btn">
              Video
            </Button>
            <Button type="text" icon={<FileTextOutlined />} className="compose-btn">
              Document
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!composeText?.trim() || posting}
              className="compose-btn post-btn"
            >
              {posting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
