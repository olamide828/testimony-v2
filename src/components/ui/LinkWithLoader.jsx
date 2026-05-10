import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * A wrapper around any clickable element that shows
 * a loading spinner on the element itself while the
 * next page loads, so users get immediate feedback.
 */
export function LinkWithLoader({ to, className, children, ...props }) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault()
    setLoading(true)
    // Small delay so spinner is visible, then navigate
    setTimeout(() => navigate(to), 80)
  }

  return (
    <a href={to} onClick={handleClick} className={`relative ${className || ''}`} {...props}>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit z-10">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
        </span>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </a>
  )
}

export default LinkWithLoader
