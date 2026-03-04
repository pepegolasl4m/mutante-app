import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('muestra el título MUTANTE', () => {
    render(<App />)
    expect(screen.getByText('MUTANTE')).toBeInTheDocument()
  })

  it('muestra los tres módulos principales', () => {
    render(<App />)
    expect(screen.getByText('Fichas')).toBeInTheDocument()
    expect(screen.getByText('Tiradas')).toBeInTheDocument()
    expect(screen.getByText('Combate')).toBeInTheDocument()
  })

  it('muestra el subtítulo de estado', () => {
    render(<App />)
    expect(screen.getByText(/en construcción/i)).toBeInTheDocument()
  })
})
