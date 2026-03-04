// Habilidades agrupadas por el atributo que las complementa habitualmente.
// El narrador puede cambiar el atributo según la situación (reglas p.4).
export const HABILIDADES = [
  // — Físicas (Fuerza / Destreza / Resistencia) —
  { id: 'atletismo',      nombre: 'Atletismo',        atributo: 'destreza' },
  { id: 'pelea',          nombre: 'Pelea',            atributo: 'fuerza' },
  { id: 'armas_cc',       nombre: 'Armas C/C',        atributo: 'fuerza' },
  { id: 'armas_fuego',    nombre: 'Armas de fuego',   atributo: 'destreza' },
  { id: 'sigilo',         nombre: 'Sigilo',           atributo: 'destreza' },
  { id: 'conduccion',     nombre: 'Conducción',       atributo: 'destreza' },
  { id: 'esquiva',        nombre: 'Esquiva',          atributo: 'destreza' },
  { id: 'supervivencia',  nombre: 'Supervivencia',    atributo: 'resistencia' },
  // — Sociales (Carisma / Empatía) —
  { id: 'persuasion',     nombre: 'Persuasión',       atributo: 'carisma' },
  { id: 'intimidacion',   nombre: 'Intimidación',     atributo: 'carisma' },
  { id: 'engano',         nombre: 'Engaño',           atributo: 'carisma' },
  { id: 'empatia_hab',    nombre: 'Empatía',          atributo: 'empatia' },
  { id: 'liderazgo',      nombre: 'Liderazgo',        atributo: 'carisma' },
  // — Mentales (Inteligencia / Instinto) —
  { id: 'medicina',       nombre: 'Medicina',         atributo: 'inteligencia' },
  { id: 'tecnologia',     nombre: 'Tecnología',       atributo: 'inteligencia' },
  { id: 'ciencias',       nombre: 'Ciencias',         atributo: 'inteligencia' },
  { id: 'investigacion',  nombre: 'Investigación',    atributo: 'inteligencia' },
  { id: 'ocultismo',      nombre: 'Ocultismo',        atributo: 'inteligencia' },
  { id: 'percepcion',     nombre: 'Percepción',       atributo: 'instinto' },
  { id: 'callejeo',       nombre: 'Callejeo',         atributo: 'instinto' },
  { id: 'paraciencia',    nombre: 'Paraciencia',      atributo: 'instinto' },
  // — Sin habilidad (tirada pura de atributo) —
  { id: 'ninguna',        nombre: '— Ninguna —',      atributo: null },
]
