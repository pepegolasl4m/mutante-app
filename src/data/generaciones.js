// PM máximo según generación del mutante (p. 12)
export const GENERACIONES = [
  { id: 1, nombre: '1ª Generación', pmMaximo: 5 },
  { id: 2, nombre: '2ª Generación', pmMaximo: 10 },
  { id: 3, nombre: '3ª Generación', pmMaximo: 15 },
  { id: 4, nombre: '4ª Generación', pmMaximo: 20 },
  { id: 5, nombre: '5ª Generación', pmMaximo: 30 },
]

export function getPMMaximo(generacion) {
  return GENERACIONES.find(g => g.id === generacion)?.pmMaximo ?? 10
}
