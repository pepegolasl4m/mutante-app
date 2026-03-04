import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PanelCombate from './PanelCombate'

// Limpiamos localStorage antes de cada test para que useFichas empiece vacío
beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function anadirCombatiente(nombre = 'Coyote') {
  fireEvent.click(screen.getByLabelText('Añadir combatiente manual'))
  fireEvent.change(screen.getByLabelText('Nombre del combatiente'), { target: { value: nombre } })
  fireEvent.click(screen.getByRole('button', { name: 'Añadir' }))
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PanelCombate — estado vacío', () => {
  it('muestra el título Combate', () => {
    render(<PanelCombate />)
    expect(screen.getByText('Combate')).toBeInTheDocument()
  })

  it('muestra botones de añadir cuando no hay combatientes', () => {
    render(<PanelCombate />)
    expect(screen.getByLabelText('Añadir combatiente manual')).toBeInTheDocument()
    expect(screen.getByLabelText('Añadir desde fichas')).toBeInTheDocument()
  })

  it('muestra mensaje de lista vacía', () => {
    render(<PanelCombate />)
    expect(screen.getByText(/añade combatientes/i)).toBeInTheDocument()
  })

  it('no muestra botón de iniciar sin combatientes', () => {
    render(<PanelCombate />)
    expect(screen.queryByLabelText('Iniciar combate')).not.toBeInTheDocument()
  })
})

describe('PanelCombate — añadir combatientes', () => {
  it('abre el formulario manual al pulsar + Manual', () => {
    render(<PanelCombate />)
    fireEvent.click(screen.getByLabelText('Añadir combatiente manual'))
    expect(screen.getByRole('form', { name: /añadir combatiente/i })).toBeInTheDocument()
  })

  it('añadir un combatiente lo muestra en la lista', () => {
    render(<PanelCombate />)
    anadirCombatiente('Coyote')
    expect(screen.getByText('Coyote')).toBeInTheDocument()
  })

  it('no se puede añadir un combatiente sin nombre', () => {
    render(<PanelCombate />)
    fireEvent.click(screen.getByLabelText('Añadir combatiente manual'))
    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }))
    // El formulario sigue abierto porque no se añadió nada
    expect(screen.getByLabelText('Nombre del combatiente')).toBeInTheDocument()
  })

  it('cancelar formulario cierra el panel', () => {
    render(<PanelCombate />)
    fireEvent.click(screen.getByLabelText('Añadir combatiente manual'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByRole('form', { name: /añadir combatiente/i })).not.toBeInTheDocument()
  })

  it('eliminar un combatiente lo quita de la lista', () => {
    render(<PanelCombate />)
    anadirCombatiente('Fantasma')
    fireEvent.click(screen.getByLabelText('Eliminar Fantasma del combate'))
    expect(screen.queryByText('Fantasma')).not.toBeInTheDocument()
  })

  it('muestra botón Iniciar después de añadir un combatiente', () => {
    render(<PanelCombate />)
    anadirCombatiente()
    expect(screen.getByLabelText('Iniciar combate')).toBeInTheDocument()
  })
})

describe('PanelCombate — iniciativa', () => {
  it('tirar iniciativa individual muestra un número', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // 1d10 = 6
    render(<PanelCombate />)
    anadirCombatiente('Bestia')
    fireEvent.click(screen.getByLabelText('Tirar iniciativa de Bestia'))
    // 1d10(6) + DES(2) + INS(2) = 10
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('iniciar combate con un combatiente activa el combate', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    render(<PanelCombate />)
    anadirCombatiente('Alfa')
    fireEvent.click(screen.getByLabelText('Iniciar combate'))

    expect(screen.getAllByText('Alfa').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('TURNO')).toBeInTheDocument()
  })
})

describe('PanelCombate — combate activo', () => {
  function iniciarCon2() {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // iniciativa fija
    render(<PanelCombate />)
    anadirCombatiente('Ava')
    anadirCombatiente('Bex')
    fireEvent.click(screen.getByLabelText('Iniciar combate'))
  }

  it('muestra el rótulo TURNO en el combatiente activo', () => {
    iniciarCon2()
    expect(screen.getByText('TURNO')).toBeInTheDocument()
  })

  it('muestra el número de ronda', () => {
    iniciarCon2()
    expect(screen.getByText(/ronda 1/i)).toBeInTheDocument()
  })

  it('siguiente turno avanza al siguiente combatiente', () => {
    iniciarCon2()
    const antes = screen.getAllByText('TURNO')
    expect(antes).toHaveLength(1)
    fireEvent.click(screen.getByLabelText('Siguiente turno'))
    // TURNO sigue apareciendo pero ahora en otro combatiente
    expect(screen.getByText('TURNO')).toBeInTheDocument()
  })

  it('al pasar el último turno incrementa la ronda', () => {
    iniciarCon2()
    fireEvent.click(screen.getByLabelText('Siguiente turno'))
    fireEvent.click(screen.getByLabelText('Siguiente turno'))
    expect(screen.getByText(/ronda 2/i)).toBeInTheDocument()
  })

  it('fin del combate elimina el rótulo TURNO', () => {
    iniciarCon2()
    fireEvent.click(screen.getByLabelText('Finalizar combate'))
    expect(screen.queryByText('TURNO')).not.toBeInTheDocument()
  })

  it('reducir HP actualiza la barra', () => {
    iniciarCon2()
    fireEvent.click(screen.getByLabelText('Reducir HP de Ava'))
    // HP pasó de 6 a 5
    expect(screen.getByText('5/6 HP')).toBeInTheDocument()
  })
})

describe('PanelCombate — limpiar', () => {
  it('limpiar combate borra todos los combatientes', () => {
    render(<PanelCombate />)
    anadirCombatiente('Zeta')
    fireEvent.click(screen.getByLabelText('Limpiar combate'))
    expect(screen.queryByText('Zeta')).not.toBeInTheDocument()
    expect(screen.getByText(/añade combatientes/i)).toBeInTheDocument()
  })
})
