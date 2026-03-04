import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FichaPersonaje from './FichaPersonaje'

function fichaBase(overrides = {}) {
  return {
    id: 'test-id',
    nombre: 'Prueba',
    jugador: 'Ana',
    tipo: 'jugador',
    generacion: 3,
    atributos: {
      fuerza: 2, destreza: 2, resistencia: 2,
      carisma: 2, empatia: 2, inteligencia: 2, instinto: 2,
    },
    habilidades: {
      atletismo: 0, pelea: 0, armas_cc: 0, armas_fuego: 0, sigilo: 0,
      conduccion: 0, esquiva: 0, supervivencia: 0, persuasion: 0,
      intimidacion: 0, engano: 0, empatia_hab: 0, liderazgo: 0,
      medicina: 0, tecnologia: 0, ciencias: 0, investigacion: 0,
      ocultismo: 0, percepcion: 0, callejeo: 0, paraciencia: 0,
    },
    hp: { maximo: 6, actual: 6 },
    pm: { maximo: 15, actual: 15 },
    notas: '',
    ...overrides,
  }
}

describe('FichaPersonaje — Info', () => {
  it('muestra el nombre en el header', () => {
    render(<FichaPersonaje ficha={fichaBase()} onActualizar={vi.fn()} onVolver={vi.fn()} />)
    expect(screen.getByText('Prueba')).toBeInTheDocument()
  })

  it('botón volver llama a onVolver', () => {
    const onVolver = vi.fn()
    render(<FichaPersonaje ficha={fichaBase()} onActualizar={vi.fn()} onVolver={onVolver} />)
    fireEvent.click(screen.getByLabelText('Volver a la lista'))
    expect(onVolver).toHaveBeenCalledOnce()
  })

  it('cambiar nombre llama onActualizar con { nombre }', () => {
    const onActualizar = vi.fn()
    render(<FichaPersonaje ficha={fichaBase()} onActualizar={onActualizar} onVolver={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('Nombre…'), { target: { value: 'Nuevo' } })
    expect(onActualizar).toHaveBeenCalledWith({ nombre: 'Nuevo' })
  })

  it('cambiar tipo a NPC llama onActualizar con { tipo: "npc" }', () => {
    const onActualizar = vi.fn()
    render(<FichaPersonaje ficha={fichaBase()} onActualizar={onActualizar} onVolver={vi.fn()} />)
    fireEvent.click(screen.getByText('NPC'))
    expect(onActualizar).toHaveBeenCalledWith({ tipo: 'npc' })
  })

  it('cambiar generación llama onActualizar con la nueva generacion y pm', () => {
    const onActualizar = vi.fn()
    render(<FichaPersonaje ficha={fichaBase()} onActualizar={onActualizar} onVolver={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('Seleccionar generación'), { target: { value: '5' } })
    expect(onActualizar).toHaveBeenCalledWith(
      expect.objectContaining({ generacion: 5, pm: { maximo: 30, actual: 15 } })
    )
  })
})

describe('FichaPersonaje — Atributos', () => {
  function renderAtributos() {
    const onActualizar = vi.fn()
    render(<FichaPersonaje ficha={fichaBase()} onActualizar={onActualizar} onVolver={vi.fn()} />)
    fireEvent.click(screen.getByText('Atributos'))
    return onActualizar
  }

  it('muestra los 7 atributos', () => {
    renderAtributos()
    expect(screen.getByLabelText('Aumentar Fuerza')).toBeInTheDocument()
    expect(screen.getByLabelText('Aumentar Instinto')).toBeInTheDocument()
  })

  it('aumentar Fuerza llama onActualizar con el nuevo valor', () => {
    const onActualizar = renderAtributos()
    fireEvent.click(screen.getByLabelText('Aumentar Fuerza'))
    expect(onActualizar).toHaveBeenCalledWith(
      expect.objectContaining({ atributos: expect.objectContaining({ fuerza: 3 }) })
    )
  })

  it('aumentar Resistencia recalcula HP máximo', () => {
    const onActualizar = renderAtributos()
    fireEvent.click(screen.getByLabelText('Aumentar Resistencia'))
    expect(onActualizar).toHaveBeenCalledWith(
      expect.objectContaining({
        atributos: expect.objectContaining({ resistencia: 3 }),
        hp: { maximo: 9, actual: 6 },
      })
    )
  })

  it('el atributo no sube por encima de 5', () => {
    const ficha = fichaBase({ atributos: { ...fichaBase().atributos, fuerza: 5 } })
    const onActualizar = vi.fn()
    render(<FichaPersonaje ficha={ficha} onActualizar={onActualizar} onVolver={vi.fn()} />)
    fireEvent.click(screen.getByText('Atributos'))
    fireEvent.click(screen.getByLabelText('Aumentar Fuerza'))
    expect(onActualizar).toHaveBeenCalledWith(
      expect.objectContaining({ atributos: expect.objectContaining({ fuerza: 5 }) })
    )
  })
})

describe('FichaPersonaje — Estado', () => {
  function renderEstado(overrides = {}) {
    const onActualizar = vi.fn()
    render(<FichaPersonaje ficha={fichaBase(overrides)} onActualizar={onActualizar} onVolver={vi.fn()} />)
    fireEvent.click(screen.getByText('Estado'))
    return onActualizar
  }

  it('muestra HP actual y máximo', () => {
    renderEstado()
    expect(screen.getByText('6 / 6')).toBeInTheDocument()
  })

  it('reducir HP llama onActualizar con actual - 1', () => {
    const onActualizar = renderEstado()
    fireEvent.click(screen.getByLabelText('Reducir HP'))
    expect(onActualizar).toHaveBeenCalledWith({ hp: { maximo: 6, actual: 5 } })
  })

  it('HP no baja de 0', () => {
    const onActualizar = renderEstado({ hp: { maximo: 6, actual: 0 } })
    fireEvent.click(screen.getByLabelText('Reducir HP'))
    expect(onActualizar).toHaveBeenCalledWith({ hp: { maximo: 6, actual: 0 } })
  })

  it('muestra PM actual y máximo', () => {
    renderEstado()
    expect(screen.getByText('15 / 15')).toBeInTheDocument()
  })

  it('reducir PM llama onActualizar con actual - 1', () => {
    const onActualizar = renderEstado()
    fireEvent.click(screen.getByLabelText('Reducir PM'))
    expect(onActualizar).toHaveBeenCalledWith({ pm: { maximo: 15, actual: 14 } })
  })
})
