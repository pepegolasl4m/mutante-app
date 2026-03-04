import { useState } from 'react'
import { ATRIBUTOS } from '../../data/atributos'
import { HABILIDADES } from '../../data/habilidades'
import { resolverTirada } from '../../utils/dados'

const VALOR_MIN = 0
const VALOR_MAX = 5

function SelectorValor({ label, value, onChange, min = VALOR_MIN, max = VALOR_MAX }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-sm w-20">{label}</span>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 font-bold text-lg leading-none"
        aria-label={`Reducir ${label}`}
      >−</button>
      <span className="w-8 text-center font-bold text-xl tabular-nums">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 font-bold text-lg leading-none"
        aria-label={`Aumentar ${label}`}
      >+</button>
    </div>
  )
}

function ResultadoTirada({ resultado }) {
  if (!resultado) return null

  const { dados, total, dificultad, exito, exitos, atributo, habilidad } = resultado
  const colorBorde = exito ? 'border-green-500' : 'border-red-500'
  const colorTexto = exito ? 'text-green-400' : 'text-red-400'

  return (
    <div className={`mt-6 border-2 ${colorBorde} rounded-xl p-4 bg-gray-800`} role="region" aria-label="Resultado de la tirada">
      <div className="text-sm text-gray-400 mb-3 text-center">
        3d6 ({dados}) + {atributo} + {habilidad} = <span className="text-white font-bold text-lg">{total}</span>
        <span className="text-gray-500"> vs </span>
        <span className="text-white">{dificultad}</span>
      </div>
      <div className={`text-center text-2xl font-bold ${colorTexto}`}>
        {exito ? `✓ ÉXITO${exitos > 1 ? ` (${exitos} éxitos)` : ''}` : '✗ FALLO'}
      </div>
      {exito && exitos > 1 && (
        <div className="text-center text-sm text-gray-400 mt-1">
          Margen: +{total - dificultad} sobre la dificultad
        </div>
      )}
    </div>
  )
}

export default function TiradaDados() {
  const [atributoId, setAtributoId] = useState('fuerza')
  const [valorAtributo, setValorAtributo] = useState(3)
  const [habilidadId, setHabilidadId] = useState('ninguna')
  const [valorHabilidad, setValorHabilidad] = useState(0)
  const [dificultad, setDificultad] = useState(15)
  const [resultado, setResultado] = useState(null)
  const [lanzando, setLanzando] = useState(false)

  const atributoActual = ATRIBUTOS.find(a => a.id === atributoId)

  function lanzar() {
    setLanzando(true)
    setResultado(null)
    setTimeout(() => {
      const res = resolverTirada(valorAtributo, valorHabilidad, dificultad)
      setResultado({
        ...res,
        dificultad,
        atributo: valorAtributo,
        habilidad: valorHabilidad,
      })
      setLanzando(false)
    }, 300)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-6 text-center tracking-wide">🎲 Calculadora de tiradas</h2>

      {/* Atributo */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">Atributo</label>
        <div className="flex gap-3 items-center">
          <select
            value={atributoId}
            onChange={e => setAtributoId(e.target.value)}
            className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-white border border-gray-600 focus:outline-none focus:border-red-500"
            aria-label="Seleccionar atributo"
          >
            {ATRIBUTOS.map(a => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
          <SelectorValor
            label={atributoActual?.abrev}
            value={valorAtributo}
            onChange={setValorAtributo}
            min={1}
          />
        </div>
      </div>

      {/* Habilidad */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">Habilidad</label>
        <div className="flex gap-3 items-center">
          <select
            value={habilidadId}
            onChange={e => setHabilidadId(e.target.value)}
            className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-white border border-gray-600 focus:outline-none focus:border-red-500"
            aria-label="Seleccionar habilidad"
          >
            {HABILIDADES.map(h => (
              <option key={h.id} value={h.id}>{h.nombre}</option>
            ))}
          </select>
          <SelectorValor
            label="Nivel"
            value={valorHabilidad}
            onChange={setValorHabilidad}
          />
        </div>
      </div>

      {/* Dificultad */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1">Dificultad</label>
        <div className="flex items-center gap-3">
          <SelectorValor
            label="Dif."
            value={dificultad}
            onChange={setDificultad}
            min={3}
            max={31}
          />
          <span className="text-gray-500 text-sm">(base 15)</span>
        </div>
      </div>

      {/* Botón lanzar */}
      <button
        onClick={lanzar}
        disabled={lanzando}
        className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg tracking-wide transition-colors"
      >
        {lanzando ? 'Lanzando…' : 'Lanzar dados'}
      </button>

      <ResultadoTirada resultado={resultado} />
    </div>
  )
}
