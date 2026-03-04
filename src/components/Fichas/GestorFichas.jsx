import { useState } from 'react'
import { useFichas } from '../../hooks/useFichas'
import FichaPersonaje from './FichaPersonaje'

function tarjetaResumen(ficha) {
  const { nombre, jugador, tipo, generacion, hp, pm } = ficha
  return { nombre, jugador, tipo, generacion, hp, pm }
}

export default function GestorFichas() {
  const { fichas, crearFicha, eliminarFicha, actualizarFicha } = useFichas()
  const [fichaActivaId, setFichaActivaId] = useState(null)
  const [confirmEliminar, setConfirmEliminar] = useState(null)

  const fichaActiva = fichaActivaId ? fichas.find(f => f.id === fichaActivaId) ?? null : null

  function handleCrear(tipo) {
    const id = crearFicha(tipo)
    setFichaActivaId(id)
  }

  function handleEliminar(id) {
    if (confirmEliminar === id) {
      eliminarFicha(id)
      setConfirmEliminar(null)
      if (fichaActivaId === id) setFichaActivaId(null)
    } else {
      setConfirmEliminar(id)
    }
  }

  function handleActualizar(cambios) {
    if (fichaActivaId) actualizarFicha(fichaActivaId, cambios)
  }

  function exportarJSON() {
    const blob = new Blob([JSON.stringify(fichas, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mutante-fichas.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importarJSON(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const datos = JSON.parse(ev.target.result)
        if (Array.isArray(datos)) {
          // Importar cada ficha que no exista ya (por id)
          const idsExistentes = new Set(fichas.map(f => f.id))
          datos.filter(f => !idsExistentes.has(f.id)).forEach(f => {
            actualizarFicha(f.id, f) // no hace nada si no existe
          })
          // Reemplazar todo
          window.localStorage.setItem('mutante_fichas', JSON.stringify(datos))
          window.location.reload()
        }
      } catch {
        // JSON inválido — ignorar
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // ── Vista: editor de ficha ──────────────────────────────────────────────────
  if (fichaActiva) {
    return (
      <FichaPersonaje
        ficha={fichaActiva}
        onActualizar={handleActualizar}
        onVolver={() => setFichaActivaId(null)}
      />
    )
  }

  // ── Vista: lista de fichas ──────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Fichas</h2>
        <div className="flex gap-2">
          <label
            className="cursor-pointer px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
            aria-label="Importar fichas desde JSON"
          >
            Importar
            <input type="file" accept=".json" onChange={importarJSON} className="hidden" />
          </label>
          {fichas.length > 0 && (
            <button
              onClick={exportarJSON}
              className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
            >
              Exportar
            </button>
          )}
        </div>
      </div>

      {fichas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-3">📋</p>
          <p className="mb-6">Aún no hay fichas. ¡Crea la primera!</p>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {fichas.map(ficha => (
            <div
              key={ficha.id}
              className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3"
            >
              <button
                className="flex-1 text-left"
                onClick={() => setFichaActivaId(ficha.id)}
                aria-label={`Abrir ficha de ${ficha.nombre}`}
              >
                <div className="font-semibold">{ficha.nombre}</div>
                <div className="text-xs text-gray-400">
                  {ficha.jugador || (ficha.tipo === 'npc' ? 'NPC' : 'Sin jugador')}
                  {' · '}HP {ficha.hp.actual}/{ficha.hp.maximo}
                  {' · '}PM {ficha.pm.actual}/{ficha.pm.maximo}
                </div>
              </button>
              <button
                onClick={() => handleEliminar(ficha.id)}
                className={`text-xs px-2 py-1 rounded ${
                  confirmEliminar === ficha.id
                    ? 'bg-red-600 text-white'
                    : 'text-gray-500 hover:text-red-400'
                }`}
                aria-label={`Eliminar ficha de ${ficha.nombre}`}
              >
                {confirmEliminar === ficha.id ? '¿Seguro?' : '✕'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => handleCrear('jugador')}
          className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-sm"
          aria-label="Crear ficha de jugador"
        >
          + Jugador
        </button>
        <button
          onClick={() => handleCrear('npc')}
          className="flex-1 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold text-sm"
          aria-label="Crear ficha de NPC"
        >
          + NPC
        </button>
      </div>
    </div>
  )
}
