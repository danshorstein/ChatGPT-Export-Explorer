import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppProvider, AppContext } from './state/AppContext.js'
import { AppShell } from './components/layout/AppShell.js'
import { WelcomeView } from './views/WelcomeView.js'
import { LibraryView } from './views/LibraryView.js'
import { ThreadView } from './views/ThreadView.js'
import { TimelineView } from './views/TimelineView.js'
import { SearchView } from './views/SearchView.js'
import { SettingsView } from './views/SettingsView.js'

function AppRoutes() {
  const { hasData, initializing } = useContext(AppContext)

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading…
      </div>
    )
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={hasData ? <Navigate to="/library" replace /> : <WelcomeView />} />
        <Route path="/import" element={<WelcomeView />} />
        <Route path="/library" element={hasData ? <LibraryView /> : <Navigate to="/" replace />} />
        <Route path="/library/:id" element={hasData ? <ThreadView /> : <Navigate to="/" replace />} />
        <Route path="/timeline" element={hasData ? <TimelineView /> : <Navigate to="/" replace />} />
        <Route path="/search" element={hasData ? <SearchView /> : <Navigate to="/" replace />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HashRouter>
  )
}
