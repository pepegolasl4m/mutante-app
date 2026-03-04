import { useLocalStorage } from './useLocalStorage'
import { getPMMaximo } from '../data/generaciones'
import { ATRIBUTOS } from '../data/atributos'
import { HABILIDADES } from '../data/habilidades'

function crearFichaVacia(tipo = 'jugador') {
  const atributos = Object.fromEntries(ATRIBUTOS.map(a => [a.id, 2]))
  const habilidades = Object.fromEntries(
    HABILIDADES.filter(h => h.id !== 'ninguna').map(h => [h.id, 0])
  )
  const generacion = 3
  const resistencia = atributos.resistencia
  const hpMax = resistencia * 3
  const pmMax = getPMMaximo(generacion)

  return {
    id: crypto.randomUUID(),
    nombre: tipo === 'npc' ? 'NPC sin nombre' : 'Personaje nuevo',
    jugador: '',
    tipo,
    generacion,
    atributos,
    habilidades,
    hp: { maximo: hpMax, actual: hpMax },
    pm: { maximo: pmMax, actual: pmMax },
    notas: '',
  }
}

export function useFichas() {
  const [fichas, setFichas] = useLocalStorage('mutante_fichas', [])

  function crearFicha(tipo = 'jugador') {
    const nueva = crearFichaVacia(tipo)
    setFichas(prev => [...prev, nueva])
    return nueva.id
  }

  function eliminarFicha(id) {
    setFichas(prev => prev.filter(f => f.id !== id))
  }

  function actualizarFicha(id, cambios) {
    setFichas(prev => prev.map(f => f.id === id ? { ...f, ...cambios } : f))
  }

  function getFicha(id) {
    return fichas.find(f => f.id === id) ?? null
  }

  return { fichas, crearFicha, eliminarFicha, actualizarFicha, getFicha }
}
