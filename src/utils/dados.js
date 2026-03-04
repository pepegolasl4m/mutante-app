/**
 * Lanza n dados de s caras y devuelve la suma.
 */
export function lanzarDados(n, s) {
  let total = 0
  for (let i = 0; i < n; i++) {
    total += Math.floor(Math.random() * s) + 1
  }
  return total
}

/**
 * Resuelve una tirada estándar de Mutante RPG.
 * Fórmula: 3d6 + atributo + habilidad
 * Dificultad base: 15
 *
 * @param {number} atributo - Valor del atributo (1-5)
 * @param {number} habilidad - Valor de la habilidad (0-5)
 * @param {number} dificultad - Número a igualar o superar (por defecto 15)
 * @returns {{ dados: number, total: number, exitos: number, exito: boolean }}
 */
export function resolverTirada(atributo, habilidad, dificultad = 15) {
  const dados = lanzarDados(3, 6)
  const total = dados + atributo + habilidad
  const exito = total >= dificultad
  const exitos = exito ? Math.floor((total - dificultad) / 3) + 1 : 0
  return { dados, total, exitos, exito }
}

/**
 * Resuelve una tirada de iniciativa: 1d10 + Destreza + Instinto
 *
 * @param {number} destreza
 * @param {number} instinto
 * @returns {{ dado: number, total: number }}
 */
export function resolverIniciativa(destreza, instinto) {
  const dado = lanzarDados(1, 10)
  const total = dado + destreza + instinto
  return { dado, total }
}

/**
 * Calcula los HP máximos de un personaje.
 * Fórmula: Resistencia × 3
 *
 * @param {number} resistencia
 * @returns {number}
 */
export function calcularHPMaximo(resistencia) {
  return resistencia * 3
}

/**
 * Devuelve el penalizador a tiradas según el porcentaje de HP restante.
 *
 * @param {number} hpActual
 * @param {number} hpMaximo
 * @returns {number} Penalizador (0, -1, -2 o -3)
 */
export function penalizadorPorDano(hpActual, hpMaximo) {
  if (hpMaximo <= 0) return 0
  const porcentaje = hpActual / hpMaximo
  if (porcentaje >= 0.75) return 0
  if (porcentaje >= 0.5) return -1
  if (porcentaje >= 0.25) return -2
  return -3
}
