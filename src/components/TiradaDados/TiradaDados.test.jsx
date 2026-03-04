import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import TiradaDados from './TiradaDados'

describe('TiradaDados', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza el título', () => {
    render(<TiradaDados />)
    expect(screen.getByText(/calculadora de tiradas/i)).toBeInTheDocument()
  })

  it('muestra el selector de atributo con Fuerza por defecto', () => {
    render(<TiradaDados />)
    const select = screen.getByLabelText('Seleccionar atributo')
    expect(select.value).toBe('fuerza')
  })

  it('muestra el selector de habilidad con — Ninguna — por defecto', () => {
    render(<TiradaDados />)
    const select = screen.getByLabelText('Seleccionar habilidad')
    expect(select.value).toBe('ninguna')
  })

  it('muestra la dificultad 15 por defecto', () => {
    render(<TiradaDados />)
    expect(screen.getByLabelText('Aumentar Dif.')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('muestra el botón de lanzar', () => {
    render(<TiradaDados />)
    expect(screen.getByRole('button', { name: /lanzar dados/i })).toBeInTheDocument()
  })

  it('no muestra resultado antes de lanzar', () => {
    render(<TiradaDados />)
    expect(screen.queryByRole('region', { name: /resultado/i })).not.toBeInTheDocument()
  })

  it('muestra resultado después de lanzar', async () => {
    vi.useFakeTimers()
    render(<TiradaDados />)

    fireEvent.click(screen.getByRole('button', { name: /lanzar dados/i }))
    await act(async () => { vi.runAllTimers() })

    expect(screen.getByRole('region', { name: /resultado/i })).toBeInTheDocument()
  })

  it('muestra ÉXITO cuando la tirada supera la dificultad', async () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.999) // 3d6 = 18
    render(<TiradaDados />)

    fireEvent.click(screen.getByRole('button', { name: /lanzar dados/i }))
    await act(async () => { vi.runAllTimers() })

    expect(screen.getByText(/ÉXITO/)).toBeInTheDocument()
  })

  it('muestra FALLO cuando la tirada no supera la dificultad', async () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0) // 3d6 = 3, atributo 3 + hab 0 = 6 < 15
    render(<TiradaDados />)

    fireEvent.click(screen.getByRole('button', { name: /lanzar dados/i }))
    await act(async () => { vi.runAllTimers() })

    expect(screen.getByText(/FALLO/)).toBeInTheDocument()
  })

  it('el botón Aumentar atributo incrementa el valor', () => {
    render(<TiradaDados />)
    const btnAumentar = screen.getByLabelText('Aumentar FUE')
    fireEvent.click(btnAumentar)
    expect(screen.getByText('4')).toBeInTheDocument() // valor inicial 3 → 4
  })

  it('el botón Reducir atributo decrementa el valor', () => {
    render(<TiradaDados />)
    const btnReducir = screen.getByLabelText('Reducir FUE')
    fireEvent.click(btnReducir)
    expect(screen.getByText('2')).toBeInTheDocument() // valor inicial 3 → 2
  })

  it('el valor de atributo no baja de 1', () => {
    render(<TiradaDados />)
    const btnReducir = screen.getByLabelText('Reducir FUE')
    // Clicar muchas veces
    for (let i = 0; i < 10; i++) fireEvent.click(btnReducir)
    // El mínimo es 1, no 0
    const valores = screen.getAllByText('1')
    expect(valores.length).toBeGreaterThanOrEqual(1)
  })

  it('cambiar el atributo actualiza el selector', () => {
    render(<TiradaDados />)
    const select = screen.getByLabelText('Seleccionar atributo')
    fireEvent.change(select, { target: { value: 'instinto' } })
    expect(select.value).toBe('instinto')
  })
})
