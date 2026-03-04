import { useState } from 'react'
import TiradaDados from './components/TiradaDados/TiradaDados'

const TABS = [
  { id: 'tiradas', label: 'Tiradas', icono: '🎲', componente: <TiradaDados /> },
  { id: 'fichas',  label: 'Fichas',  icono: '📋', componente: null },
  { id: 'combate', label: 'Combate', icono: '⚔️',  componente: null },
]

function Proximamente({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <div className="text-5xl mb-4">🚧</div>
      <p className="text-lg">{label} — próximamente</p>
    </div>
  )
}

function App() {
  const [tabActiva, setTabActiva] = useState('tiradas')
  const tab = TABS.find(t => t.id === tabActiva)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-800 px-6 py-3 flex items-center gap-4">
        <h1 className="text-2xl font-bold text-red-500 tracking-widest">MUTANTE</h1>
        <nav className="flex gap-1 ml-4" role="navigation" aria-label="Módulos">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTabActiva(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tabActiva === t.id
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              aria-current={tabActiva === t.id ? 'page' : undefined}
            >
              {t.icono} {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Contenido */}
      <main className="flex-1 p-6">
        {tab?.componente ?? <Proximamente label={tab?.label} />}
      </main>
    </div>
  )
}

export default App
