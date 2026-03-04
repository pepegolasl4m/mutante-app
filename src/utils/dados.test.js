import { describe, it, expect, vi } from 'vitest'
import {
  lanzarDados,
  resolverTirada,
  resolverIniciativa,
  calcularHPMaximo,
  penalizadorPorDano,
} from './dados'

describe('lanzarDados', () => {
  it('devuelve un valor dentro del rango para 3d6', () => {
    for (let i = 0; i < 100; i++) {
      const result = lanzarDados(3, 6)
      expect(result).toBeGreaterThanOrEqual(3)
      expect(result).toBeLessThanOrEqual(18)
    }
  })

  it('devuelve un valor dentro del rango para 1d10', () => {
    for (let i = 0; i < 100; i++) {
      const result = lanzarDados(1, 10)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(10)
    }
  })
})

describe('resolverTirada', () => {
  it('devuelve la estructura correcta', () => {
    const result = resolverTirada(3, 2)
    expect(result).toHaveProperty('dados')
    expect(result).toHaveProperty('total')
    expect(result).toHaveProperty('exitos')
    expect(result).toHaveProperty('exito')
  })

  it('total = dados + atributo + habilidad', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // cada d6 = 4 → 3d6 = 12
    const result = resolverTirada(3, 2)
    expect(result.dados).toBe(12)
    expect(result.total).toBe(17) // 12 + 3 + 2
    vi.restoreAllMocks()
  })

  it('exito es true cuando total >= dificultad', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999) // cada d6 = 6 → 3d6 = 18
    const result = resolverTirada(5, 5, 15)
    expect(result.exito).toBe(true)
    vi.restoreAllMocks()
  })

  it('exito es false cuando total < dificultad', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // cada d6 = 1 → 3d6 = 3
    const result = resolverTirada(1, 0, 15)
    expect(result.exito).toBe(false)
    expect(result.exitos).toBe(0)
    vi.restoreAllMocks()
  })

  it('exitos = 0 cuando falla', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const result = resolverTirada(0, 0, 15)
    expect(result.exitos).toBe(0)
    vi.restoreAllMocks()
  })

  it('usa dificultad 15 por defecto', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999) // 3d6 = 18
    const result = resolverTirada(0, 0)
    expect(result.exito).toBe(true) // 18 >= 15
    vi.restoreAllMocks()
  })
})

describe('resolverIniciativa', () => {
  it('total = dado + destreza + instinto', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // 1d10 = 6
    const result = resolverIniciativa(3, 2)
    expect(result.dado).toBe(6)
    expect(result.total).toBe(11) // 6 + 3 + 2
    vi.restoreAllMocks()
  })

  it('dado siempre entre 1 y 10', () => {
    for (let i = 0; i < 100; i++) {
      const result = resolverIniciativa(0, 0)
      expect(result.dado).toBeGreaterThanOrEqual(1)
      expect(result.dado).toBeLessThanOrEqual(10)
    }
  })
})

describe('calcularHPMaximo', () => {
  it('HP máximo = Resistencia × 3', () => {
    expect(calcularHPMaximo(1)).toBe(3)
    expect(calcularHPMaximo(3)).toBe(9)
    expect(calcularHPMaximo(5)).toBe(15)
  })
})

describe('penalizadorPorDano', () => {
  it('sin penalizador al 100% de HP', () => {
    expect(penalizadorPorDano(10, 10)).toBe(0)
  })

  it('sin penalizador al 75% exacto', () => {
    expect(penalizadorPorDano(9, 12)).toBe(0) // 75%
  })

  it('-1 entre 50% y 74%', () => {
    expect(penalizadorPorDano(6, 12)).toBe(-1) // 50%
    expect(penalizadorPorDano(7, 12)).toBe(-1) // ~58%
  })

  it('-2 entre 25% y 49%', () => {
    expect(penalizadorPorDano(3, 12)).toBe(-2) // 25%
    expect(penalizadorPorDano(4, 12)).toBe(-2) // ~33%
  })

  it('-3 por debajo del 25%', () => {
    expect(penalizadorPorDano(2, 12)).toBe(-3) // ~16%
    expect(penalizadorPorDano(0, 12)).toBe(-3) // 0%
  })

  it('devuelve 0 si hpMaximo es 0', () => {
    expect(penalizadorPorDano(0, 0)).toBe(0)
  })
})
