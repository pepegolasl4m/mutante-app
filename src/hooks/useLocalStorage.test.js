import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('devuelve el valor inicial cuando no hay nada guardado', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 42))
    expect(result.current[0]).toBe(42)
  })

  it('persiste el valor en localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 0))
    act(() => result.current[1](99))
    expect(localStorage.getItem('test_key')).toBe('99')
  })

  it('carga el valor guardado al inicializar', () => {
    localStorage.setItem('test_key', JSON.stringify('hola'))
    const { result } = renderHook(() => useLocalStorage('test_key', 'default'))
    expect(result.current[0]).toBe('hola')
  })

  it('acepta una función como actualizador', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 10))
    act(() => result.current[1](prev => prev + 5))
    expect(result.current[0]).toBe(15)
  })
})
