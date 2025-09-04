import { useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function Toast({ message, isVisible, onClose, duration = 3000 }) {
  const { theme } = useTheme()

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  if (!isVisible) return null

  return (
    <div className="toast-container">
      <div className="toast">
        <div className="toast-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 2000;
          animation: slideIn 0.3s ease-out;
        }

        .toast {
          background: var(--card-background);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          max-width: 400px;
          min-width: 300px;
        }

        .toast-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        .toast-message {
          color: var(--text-primary);
          font-size: 0.9rem;
          flex: 1;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .toast-close:hover {
          background: var(--accent-color);
          color: var(--text-primary);
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .toast-container {
            top: 10px;
            right: 10px;
            left: 10px;
          }

          .toast {
            min-width: auto;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
