import { describe, it, expect } from 'vitest'
import { GENERACIONES, getPMMaximo } from './generaciones'

describe('GENERACIONES', () => {
  it('tiene 5 generaciones', () => {
    expect(GENERACIONES).toHaveLength(5)
  })

  it('los PM pools son 5/10/15/20/30', () => {
    const pools = GENERACIONES.map(g => g.pmMaximo)
    expect(pools).toEqual([5, 10, 15, 20, 30])
  })
})

describe('getPMMaximo', () => {
  it.each([
    [1, 5],
    [2, 10],
    [3, 15],
    [4, 20],
    [5, 30],
  ])('generación %i → %i PM', (gen, pm) => {
    expect(getPMMaximo(gen)).toBe(pm)
  })

  it('devuelve 10 para generación desconocida', () => {
    expect(getPMMaximo(99)).toBe(10)
  })
})
