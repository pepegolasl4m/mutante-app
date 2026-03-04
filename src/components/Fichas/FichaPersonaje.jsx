import { useState } from 'react'
import { ATRIBUTOS } from '../../data/atributos'
import { HABILIDADES } from '../../data/habilidades'
import { GENERACIONES, getPMMaximo } from '../../data/generaciones'

// ─── Utilidades ───────────────────────────────────────────────────────────────

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function CampoTexto({ label, value, onChange, placeholder = '' }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
      />
    </div>
  )
}

function FilaValor({ label, value, onChange, min = 0, max = 5, abrev = '' }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="text-sm text-gray-300 w-32 truncate">{label}</span>
      {abrev && <span className="text-xs text-gray-500 w-8">{abrev}</span>}
      <button
        onClick={() => onChange(clamp(value - 1, min, max))}
        className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 font-bold leading-none"
        aria-label={`Reducir ${label}`}
      >−</button>
      <span className="w-8 text-center font-bold tabular-nums">{value}</span>
      <button
        onClick={() => onChange(clamp(value + 1, min, max))}
        className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 font-bold leading-none"
        aria-label={`Aumentar ${label}`}
      >+</button>
    </div>
  )
}

function TrackerHP({ hp, onCambiarActual }) {
  const porcentaje = hp.maximo > 0 ? hp.actual / hp.maximo : 0
  const color = porcentaje > 0.5 ? 'bg-green-500' : porcentaje > 0.25 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-400">HP</span>
        <span className="text-sm font-bold">{hp.actual} / {hp.maximo}</span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} transition-all`}
            style={{ width: `${Math.max(0, porcentaje * 100)}%` }}
          />
        </div>
        <button
          onClick={() => onCambiarActual(clamp(hp.actual - 1, 0, hp.maximo))}
          className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 font-bold leading-none"
          aria-label="Reducir HP"
        >−</button>
        <button
          onClick={() => onCambiarActual(clamp(hp.actual + 1, 0, hp.maximo))}
          className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 font-bold leading-none"
          aria-label="Aumentar HP"
        >+</button>
      </div>
    </div>
  )
}

function TrackerPM({ pm, onCambiarActual }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-400">PM</span>
        <span className="text-sm font-bold">{pm.actual} / {pm.maximo}</span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${pm.maximo > 0 ? Math.max(0, pm.actual / pm.maximo * 100) : 0}%` }}
          />
        </div>
        <button
          onClick={() => onCambiarActual(clamp(pm.actual - 1, 0, pm.maximo))}
          className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 font-bold leading-none"
          aria-label="Reducir PM"
        >−</button>
        <button
          onClick={() => onCambiarActual(clamp(pm.actual + 1, 0, pm.maximo))}
          className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 font-bold leading-none"
          aria-label="Aumentar PM"
        >+</button>
      </div>
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS_FICHA = ['Info', 'Atributos', 'Habilidades', 'Estado']

// ─── Componente principal ─────────────────────────────────────────────────────

export default function FichaPersonaje({ ficha, onActualizar, onVolver }) {
  const [tabActivo, setTabActivo] = useState('Info')

  function setAtributo(id, valor) {
    const nuevosAtributos = { ...ficha.atributos, [id]: valor }
    const cambios = { atributos: nuevosAtributos }

    // Recalcular HP máximo si cambia Resistencia
    if (id === 'resistencia') {
      const nuevoHpMax = valor * 3
      cambios.hp = { maximo: nuevoHpMax, actual: clamp(ficha.hp.actual, 0, nuevoHpMax) }
    }

    onActualizar(cambios)
  }

  function setHabilidad(id, valor) {
    onActualizar({ habilidades: { ...ficha.habilidades, [id]: valor } })
  }

  function setGeneracion(gen) {
    const pmMax = getPMMaximo(gen)
    onActualizar({
      generacion: gen,
      pm: { maximo: pmMax, actual: clamp(ficha.pm.actual, 0, pmMax) },
    })
  }

  const habilidadesPorAtributo = ATRIBUTOS.map(attr => ({
    atributo: attr,
    habilidades: HABILIDADES.filter(h => h.atributo === attr.id),
  })).filter(g => g.habilidades.length > 0)

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onVolver}
          className="text-gray-400 hover:text-white px-2 py-1 rounded"
          aria-label="Volver a la lista"
        >← Volver</button>
        <h2 className="flex-1 text-lg font-bold truncate">{ficha.nombre}</h2>
        <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
          {ficha.tipo === 'npc' ? 'NPC' : 'Jugador'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-900 rounded-lg p-1">
        {TABS_FICHA.map(tab => (
          <button
            key={tab}
            onClick={() => setTabActivo(tab)}
            aria-current={tabActivo === tab ? 'true' : undefined}
            className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${
              tabActivo === tab ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >{tab}</button>
        ))}
      </div>

      {/* Tab: Info */}
      {tabActivo === 'Info' && (
        <div className="space-y-4 bg-gray-800 rounded-xl p-4">
          <CampoTexto
            label="Nombre del personaje"
            value={ficha.nombre}
            onChange={v => onActualizar({ nombre: v })}
            placeholder="Nombre…"
          />
          <CampoTexto
            label="Jugador"
            value={ficha.jugador}
            onChange={v => onActualizar({ jugador: v })}
            placeholder="Nombre del jugador…"
          />
          <div>
            <label className="block text-xs text-gray-400 mb-1">Tipo</label>
            <div className="flex gap-2">
              {['jugador', 'npc'].map(tipo => (
                <button
                  key={tipo}
                  onClick={() => onActualizar({ tipo })}
                  aria-pressed={ficha.tipo === tipo}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    ficha.tipo === tipo ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tipo === 'jugador' ? 'Jugador' : 'NPC'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Generación</label>
            <select
              value={ficha.generacion}
              onChange={e => setGeneracion(Number(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
              aria-label="Seleccionar generación"
            >
              {GENERACIONES.map(g => (
                <option key={g.id} value={g.id}>{g.nombre} — {g.pmMaximo} PM</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Notas</label>
            <textarea
              value={ficha.notas}
              onChange={e => onActualizar({ notas: e.target.value })}
              placeholder="Descripción, trasfondo, poderes…"
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>
        </div>
      )}

      {/* Tab: Atributos */}
      {tabActivo === 'Atributos' && (
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-3">Rango 1–5. HP máximo = Resistencia × 3.</p>
          {ATRIBUTOS.map(a => (
            <FilaValor
              key={a.id}
              label={a.nombre}
              abrev={a.abrev}
              value={ficha.atributos[a.id] ?? 2}
              onChange={v => setAtributo(a.id, v)}
              min={1}
              max={5}
            />
          ))}
        </div>
      )}

      {/* Tab: Habilidades */}
      {tabActivo === 'Habilidades' && (
        <div className="bg-gray-800 rounded-xl p-4 space-y-4">
          <p className="text-xs text-gray-500">Rango 0–5.</p>
          {habilidadesPorAtributo.map(({ atributo, habilidades }) => (
            <div key={atributo.id}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 border-b border-gray-700 pb-1">
                {atributo.nombre}
              </h3>
              {habilidades.map(h => (
                <FilaValor
                  key={h.id}
                  label={h.nombre}
                  value={ficha.habilidades[h.id] ?? 0}
                  onChange={v => setHabilidad(h.id, v)}
                  min={0}
                  max={5}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Estado */}
      {tabActivo === 'Estado' && (
        <div className="bg-gray-800 rounded-xl p-4 space-y-6">
          <TrackerHP
            hp={ficha.hp}
            onCambiarActual={actual => onActualizar({ hp: { ...ficha.hp, actual } })}
          />
          <TrackerPM
            pm={ficha.pm}
            onCambiarActual={actual => onActualizar({ pm: { ...ficha.pm, actual } })}
          />
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Penalizador −1 cuando HP ≤ 50 %</p>
            <p>• Penalizador −2 cuando HP ≤ 25 %</p>
            <p>• Penalizador −3 cuando HP ≤ 10 %</p>
          </div>
        </div>
      )}
    </div>
  )
}
