import { useState } from 'react'
import { useFichas } from '../../hooks/useFichas'
import { resolverIniciativa, penalizadorPorDano } from '../../utils/dados'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function crearCombatiente({ nombre, destreza, instinto, hpMax, tipo = 'npc', fichaId = null }) {
  return {
    id: crypto.randomUUID(),
    nombre,
    destreza: Number(destreza) || 2,
    instinto: Number(instinto) || 2,
    iniciativa: null,
    dado_iniciativa: null,
    hp: { actual: Number(hpMax) || 6, maximo: Number(hpMax) || 6 },
    tipo,
    fichaId,
  }
}

// ─── Formulario para añadir combatiente manual ────────────────────────────────

function FormularioManual({ onAnadir, onCancelar }) {
  const [nombre, setNombre] = useState('')
  const [destreza, setDestreza] = useState(2)
  const [instinto, setInstinto] = useState(2)
  const [hpMax, setHpMax] = useState(6)

  function handleSubmit(e) {
    e.preventDefault()
    if (!nombre.trim()) return
    onAnadir(crearCombatiente({ nombre: nombre.trim(), destreza, instinto, hpMax }))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-4 space-y-3" aria-label="Añadir combatiente">
      <h3 className="font-bold text-sm">Combatiente manual</h3>
      <input
        type="text"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        placeholder="Nombre…"
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 text-sm"
        aria-label="Nombre del combatiente"
        autoFocus
      />
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'DES', value: destreza, set: setDestreza },
          { label: 'INS', value: instinto, set: setInstinto },
          { label: 'HP', value: hpMax, set: setHpMax, max: 50 },
        ].map(({ label, value, set, max = 5 }) => (
          <div key={label}>
            <label className="block text-xs text-gray-400 mb-1">{label}</label>
            <input
              type="number"
              min={1}
              max={max}
              value={value}
              onChange={e => set(Number(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-red-500"
              aria-label={label}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 font-bold text-sm"
        >
          Añadir
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

// ─── Selector de fichas ────────────────────────────────────────────────────────

function SelectorFichas({ fichas, idsEnCombate, onAnadir, onCancelar }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4" aria-label="Importar desde fichas">
      <h3 className="font-bold text-sm mb-3">Importar desde fichas</h3>
      {fichas.length === 0 ? (
        <p className="text-sm text-gray-500 mb-3">No hay fichas guardadas.</p>
      ) : (
        <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
          {fichas.map(f => {
            const yaEsta = idsEnCombate.has(f.fichaId ?? f.id)
            return (
              <button
                key={f.id}
                onClick={() => !yaEsta && onAnadir(f)}
                disabled={yaEsta}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  yaEsta
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <span className="font-semibold">{f.nombre}</span>
                <span className="text-gray-400 ml-2 text-xs">
                  DES {f.atributos.destreza} · INS {f.atributos.instinto} · HP {f.hp.actual}/{f.hp.maximo}
                </span>
                {yaEsta && <span className="text-gray-500 ml-2 text-xs">(ya en combate)</span>}
              </button>
            )
          })}
        </div>
      )}
      <button
        onClick={onCancelar}
        className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
      >
        Cancelar
      </button>
    </div>
  )
}

// ─── Fila de combatiente ──────────────────────────────────────────────────────

function FilaCombatiente({ combatiente, esActivo, esIniciativaRolada, onActualizar, onEliminar }) {
  const { nombre, destreza, instinto, iniciativa, dado_iniciativa, hp, tipo } = combatiente
  const pen = penalizadorPorDano(hp.actual, hp.maximo)
  const porcentaje = hp.maximo > 0 ? hp.actual / hp.maximo : 0
  const colorHP = porcentaje > 0.5 ? 'bg-green-500' : porcentaje > 0.25 ? 'bg-yellow-500' : 'bg-red-500'

  function tirarIniciativa() {
    const { dado, total } = resolverIniciativa(destreza, instinto)
    onActualizar({ iniciativa: total, dado_iniciativa: dado })
  }

  return (
    <div
      className={`rounded-xl p-3 border-2 transition-colors ${
        esActivo ? 'border-red-500 bg-gray-750' : 'border-transparent bg-gray-800'
      }`}
      aria-current={esActivo ? 'true' : undefined}
    >
      <div className="flex items-start gap-3">
        {/* Iniciativa */}
        <div className="w-12 text-center flex-shrink-0">
          {iniciativa !== null ? (
            <div>
              <div className="text-xl font-bold tabular-nums">{iniciativa}</div>
              <div className="text-xs text-gray-500">({dado_iniciativa}+{destreza}+{instinto})</div>
            </div>
          ) : (
            <button
              onClick={tirarIniciativa}
              className="text-xs text-gray-400 hover:text-white border border-gray-600 rounded px-1 py-1.5 leading-none"
              aria-label={`Tirar iniciativa de ${nombre}`}
            >
              1d10
            </button>
          )}
        </div>

        {/* Nombre + tipo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">{nombre}</span>
            <span className="text-xs text-gray-500">{tipo === 'jugador' ? '👤' : '🤖'}</span>
            {esActivo && <span className="text-xs bg-red-600 text-white px-1.5 rounded">TURNO</span>}
            {pen < 0 && (
              <span className="text-xs bg-yellow-700 text-yellow-200 px-1.5 rounded">
                {pen} dados
              </span>
            )}
          </div>

          {/* HP bar */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${colorHP} transition-all`}
                style={{ width: `${Math.max(0, porcentaje * 100)}%` }}
              />
            </div>
            <span className="text-xs tabular-nums text-gray-300 w-16 text-right">
              {hp.actual}/{hp.maximo} HP
            </span>
            <button
              onClick={() => onActualizar({ hp: { ...hp, actual: clamp(hp.actual - 1, 0, hp.maximo) } })}
              className="w-6 h-6 rounded bg-gray-700 hover:bg-red-700 text-sm font-bold leading-none"
              aria-label={`Reducir HP de ${nombre}`}
            >−</button>
            <button
              onClick={() => onActualizar({ hp: { ...hp, actual: clamp(hp.actual + 1, 0, hp.maximo) } })}
              className="w-6 h-6 rounded bg-gray-700 hover:bg-green-700 text-sm font-bold leading-none"
              aria-label={`Aumentar HP de ${nombre}`}
            >+</button>
          </div>
        </div>

        {/* Eliminar */}
        <button
          onClick={onEliminar}
          className="text-gray-600 hover:text-red-400 text-lg leading-none flex-shrink-0"
          aria-label={`Eliminar ${nombre} del combate`}
        >✕</button>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PanelCombate() {
  const { fichas } = useFichas()
  const [combatientes, setCombatientes] = useState([])
  const [turnoIndex, setTurnoIndex] = useState(0)
  const [ronda, setRonda] = useState(1)
  const [combateActivo, setCombateActivo] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(null) // null | 'manual' | 'fichas'

  const iniciativaRolada = combatientes.every(c => c.iniciativa !== null)
  const idsEnCombate = new Set(combatientes.map(c => c.fichaId ?? c.id))

  function anadir(combatiente) {
    setCombatientes(prev => [...prev, combatiente])
    setMostrarForm(null)
  }

  function anadirDesdeFicha(ficha) {
    const c = crearCombatiente({
      nombre: ficha.nombre,
      destreza: ficha.atributos.destreza,
      instinto: ficha.atributos.instinto,
      hpMax: ficha.hp.maximo,
      tipo: ficha.tipo,
      fichaId: ficha.id,
    })
    c.hp.actual = ficha.hp.actual
    anadir(c)
  }

  function eliminar(id) {
    setCombatientes(prev => {
      const nuevo = prev.filter(c => c.id !== id)
      if (turnoIndex >= nuevo.length) setTurnoIndex(0)
      return nuevo
    })
  }

  function actualizar(id, cambios) {
    setCombatientes(prev => prev.map(c => c.id === id ? { ...c, ...cambios } : c))
  }

  function tirarTodasIniciativas() {
    setCombatientes(prev => prev.map(c => {
      const { dado, total } = resolverIniciativa(c.destreza, c.instinto)
      return { ...c, iniciativa: total, dado_iniciativa: dado }
    }))
  }

  function iniciarCombate() {
    if (combatientes.length === 0) return
    if (!iniciativaRolada) tirarTodasIniciativas()
    setCombatientes(prev => [...prev].sort((a, b) => (b.iniciativa ?? 0) - (a.iniciativa ?? 0)))
    setTurnoIndex(0)
    setRonda(1)
    setCombateActivo(true)
  }

  function siguienteTurno() {
    setTurnoIndex(prev => {
      const next = prev + 1
      if (next >= combatientes.length) {
        setRonda(r => r + 1)
        return 0
      }
      return next
    })
  }

  function finalizarCombate() {
    setCombateActivo(false)
    setTurnoIndex(0)
    setRonda(1)
  }

  function limpiarCombate() {
    setCombatientes([])
    setCombateActivo(false)
    setTurnoIndex(0)
    setRonda(1)
    setMostrarForm(null)
  }

  const combatienteActivo = combatientes[turnoIndex] ?? null

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Combate</h2>
          {combateActivo && (
            <p className="text-sm text-gray-400">
              Ronda {ronda} · Turno de <span className="text-white font-semibold">{combatienteActivo?.nombre}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {combateActivo ? (
            <>
              <button
                onClick={siguienteTurno}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-bold"
                aria-label="Siguiente turno"
              >
                Siguiente →
              </button>
              <button
                onClick={finalizarCombate}
                className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
                aria-label="Finalizar combate"
              >
                Fin
              </button>
            </>
          ) : (
            <>
              {combatientes.length > 0 && (
                <button
                  onClick={iniciarCombate}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-bold"
                  aria-label="Iniciar combate"
                >
                  ¡Iniciar!
                </button>
              )}
              {combatientes.length > 0 && (
                <button
                  onClick={limpiarCombate}
                  className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
                  aria-label="Limpiar combate"
                >
                  Limpiar
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lista de combatientes */}
      {combatientes.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-4xl mb-3">⚔️</p>
          <p className="mb-6">Añade combatientes para empezar.</p>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {combatientes.map((c, idx) => (
            <FilaCombatiente
              key={c.id}
              combatiente={c}
              esActivo={combateActivo && idx === turnoIndex}
              esIniciativaRolada={iniciativaRolada}
              onActualizar={cambios => actualizar(c.id, cambios)}
              onEliminar={() => eliminar(c.id)}
            />
          ))}
        </div>
      )}

      {/* Formulario inline */}
      {mostrarForm === 'manual' && (
        <div className="mb-4">
          <FormularioManual
            onAnadir={c => anadir(c)}
            onCancelar={() => setMostrarForm(null)}
          />
        </div>
      )}
      {mostrarForm === 'fichas' && (
        <div className="mb-4">
          <SelectorFichas
            fichas={fichas}
            idsEnCombate={idsEnCombate}
            onAnadir={anadirDesdeFicha}
            onCancelar={() => setMostrarForm(null)}
          />
        </div>
      )}

      {/* Botones de añadir (ocultos durante combate) */}
      {!combateActivo && !mostrarForm && (
        <div className="flex gap-2">
          <button
            onClick={() => setMostrarForm('manual')}
            className="flex-1 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold text-sm"
            aria-label="Añadir combatiente manual"
          >
            + Manual
          </button>
          <button
            onClick={() => setMostrarForm('fichas')}
            className="flex-1 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold text-sm"
            aria-label="Añadir desde fichas"
          >
            + Desde fichas
          </button>
        </div>
      )}

      {/* Info penalizadores */}
      {combatientes.length > 0 && (
        <div className="mt-4 text-xs text-gray-600 space-y-0.5">
          <p>Penalizadores: &lt;75% HP → −1 · &lt;50% → −2 · &lt;25% → −3</p>
        </div>
      )}
    </div>
  )
}
