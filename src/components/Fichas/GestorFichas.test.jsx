import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GestorFichas from './GestorFichas'

describe('GestorFichas', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra el título Fichas', () => {
    render(<GestorFichas />)
    expect(screen.getByText('Fichas')).toBeInTheDocument()
  })

  it('muestra los botones de crear Jugador y NPC', () => {
    render(<GestorFichas />)
    expect(screen.getByLabelText('Crear ficha de jugador')).toBeInTheDocument()
    expect(screen.getByLabelText('Crear ficha de NPC')).toBeInTheDocument()
  })

  it('muestra mensaje vacío cuando no hay fichas', () => {
    render(<GestorFichas />)
    expect(screen.getByText(/aún no hay fichas/i)).toBeInTheDocument()
  })

  it('crear una ficha de jugador abre el editor', () => {
    render(<GestorFichas />)
    fireEvent.click(screen.getByLabelText('Crear ficha de jugador'))
    expect(screen.getByLabelText('Volver a la lista')).toBeInTheDocument()
    expect(screen.getByText('Personaje nuevo')).toBeInTheDocument()
  })

  it('crear una ficha de NPC abre el editor con nombre NPC', () => {
    render(<GestorFichas />)
    fireEvent.click(screen.getByLabelText('Crear ficha de NPC'))
    expect(screen.getByText('NPC sin nombre')).toBeInTheDocument()
  })

  it('volver desde el editor muestra la lista', () => {
    render(<GestorFichas />)
    fireEvent.click(screen.getByLabelText('Crear ficha de jugador'))
    fireEvent.click(screen.getByLabelText('Volver a la lista'))
    expect(screen.getByText('Fichas')).toBeInTheDocument()
  })

  it('la ficha aparece en la lista después de volver', () => {
    render(<GestorFichas />)
    fireEvent.click(screen.getByLabelText('Crear ficha de jugador'))
    fireEvent.click(screen.getByLabelText('Volver a la lista'))
    expect(screen.getByText('Personaje nuevo')).toBeInTheDocument()
  })

  it('eliminar una ficha requiere confirmación', () => {
    render(<GestorFichas />)
    fireEvent.click(screen.getByLabelText('Crear ficha de jugador'))
    fireEvent.click(screen.getByLabelText('Volver a la lista'))

    const btnEliminar = screen.getByLabelText('Eliminar ficha de Personaje nuevo')
    fireEvent.click(btnEliminar)
    expect(screen.getByText('¿Seguro?')).toBeInTheDocument()
  })

  it('confirmar eliminación borra la ficha', () => {
    render(<GestorFichas />)
    fireEvent.click(screen.getByLabelText('Crear ficha de jugador'))
    fireEvent.click(screen.getByLabelText('Volver a la lista'))

    const btnEliminar = screen.getByLabelText('Eliminar ficha de Personaje nuevo')
    fireEvent.click(btnEliminar)
    fireEvent.click(screen.getByText('¿Seguro?'))
    expect(screen.getByText(/aún no hay fichas/i)).toBeInTheDocument()
  })
})
