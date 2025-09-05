import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Header({ harvestWeeks, weekColors }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard')
  const [showSettings, setShowSettings] = useState(false)

  const menuItems = [
    'Dashboard',
    'Orchard', 
    'Transport',
    'Unloading',
    'Storage',
    'Collection'
  ]

  const handleMenuClick = (item) => {
    setActiveMenu(item)
    // TODO: Add navigation logic here
  }

  const handleSettings = () => {
    setShowSettings(!showSettings)
    // TODO: Open settings modal
  }

  return (
    <header className="fixed-header">
      <div className="header-container">
        {/* Left section - Title */}
        <div className="header-brand">
          <h1 className="brand-title">Apple Dashboard</h1>
        </div>

        {/* Center section - Navigation Menu */}
        <nav className="header-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item} className="nav-item">
                <button 
                  className={`nav-link ${activeMenu === item ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right section - Toolbar */}
        <div className="header-toolbar">
          <div className="toolbar-actions">          
            <button 
              className={`toolbar-btn settings-btn ${showSettings ? 'active' : ''}`}
              onClick={handleSettings}
              title="Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="settings-dropdown">
          <div className="settings-section">
            <h4>Orchard Management</h4>
            <button className="settings-option">Add New Orchard</button>
            <button className="settings-option">Edit Orchards</button>
          </div>
          <div className="settings-section">
            <h4>Harvest Weeks</h4>
            <button className="settings-option">Set Week Colors</button>
            <button className="settings-option">Configure Weeks</button>
          </div>
          <div className="settings-section">
            <h4>Storage</h4>
            <button className="settings-option">Add Storage</button>
            <button className="settings-option">Manage Storage</button>
          </div>
        </div>
      )}
    </header>
  )
}
