import { NavLink, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AppContext } from '../../state/AppContext.js'

export function NavBar() {
  const { hasData } = useContext(AppContext)
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center h-14 gap-4">
        <button
          onClick={() => navigate(hasData ? '/library' : '/')}
          className="font-semibold text-indigo-700 text-base shrink-0"
        >
          ChatGPT Explorer
        </button>

        {hasData && (
          <>
            <div className="hidden sm:flex items-center gap-1 ml-2">
              <NavLink to="/library" className={linkClass}>Library</NavLink>
              <NavLink to="/timeline" className={linkClass}>Timeline</NavLink>
              <NavLink to="/search" className={linkClass}>Search</NavLink>
            </div>
            <div className="flex-1" />
            <NavLink to="/settings" className={linkClass}>Settings</NavLink>

            {/* Mobile menu button */}
            <button
              className="sm:hidden p-1 rounded text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </>
        )}
      </div>

      {mobileOpen && hasData && (
        <div className="sm:hidden border-t border-gray-200 px-4 py-2 flex flex-col gap-1">
          <NavLink to="/library" className={linkClass} onClick={() => setMobileOpen(false)}>Library</NavLink>
          <NavLink to="/timeline" className={linkClass} onClick={() => setMobileOpen(false)}>Timeline</NavLink>
          <NavLink to="/search" className={linkClass} onClick={() => setMobileOpen(false)}>Search</NavLink>
          <NavLink to="/settings" className={linkClass} onClick={() => setMobileOpen(false)}>Settings</NavLink>
        </div>
      )}
    </nav>
  )
}
