import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('muestra el título MUTANTE', () => {
    render(<App />)
    expect(screen.getByText('MUTANTE')).toBeInTheDocument()
  })

  it('muestra los tres tabs de navegación', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /tiradas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /fichas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /combate/i })).toBeInTheDocument()
  })

  it('muestra la calculadora de tiradas por defecto', () => {
    render(<App />)
    expect(screen.getByText(/calculadora de tiradas/i)).toBeInTheDocument()
  })

  it('navega a Fichas al hacer clic en el tab', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /fichas/i }))
    expect(screen.getByLabelText('Crear ficha de jugador')).toBeInTheDocument()
  })

  it('navega a Combate al hacer clic en el tab', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /combate/i }))
    expect(screen.getByLabelText('Añadir combatiente manual')).toBeInTheDocument()
  })

  it('el tab activo tiene aria-current="page"', () => {
    render(<App />)
    const tabTiradas = screen.getByRole('button', { name: /tiradas/i })
    expect(tabTiradas).toHaveAttribute('aria-current', 'page')
  })
})
