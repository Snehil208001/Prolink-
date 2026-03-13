import './Logo.css'

/**
 * ProLink logo component. Use across the app for consistent branding.
 * @param {Object} props
 * @param {number} props.size - Width/height in px (default: 40)
 * @param {boolean} props.invert - Use white for dark backgrounds (default: false)
 * @param {boolean} props.showText - Show "ProLink" next to logo (default: false)
 */
function Logo({ size = 40, invert = false, showText = false, className = '' }) {
  return (
    <div className={`logo-wrap ${className}`} style={{ '--logo-size': `${size}px` }}>
      <img
        src="/prolink-logo.svg"
        alt="ProLink"
        className={invert ? 'logo-invert' : ''}
      />
      {showText && <span className="logo-text">ProLink</span>}
    </div>
  )
}

export default Logo
