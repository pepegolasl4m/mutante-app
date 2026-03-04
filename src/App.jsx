function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-5xl font-bold tracking-wide text-red-500">MUTANTE</h1>
      <p className="text-gray-400 text-lg">Gestor de partida — en construcción</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800 rounded-xl p-6 opacity-50 cursor-not-allowed">
          <div className="text-2xl mb-2">📋</div>
          <div className="font-semibold">Fichas</div>
          <div className="text-sm text-gray-400">Personajes y NPCs</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 opacity-50 cursor-not-allowed">
          <div className="text-2xl mb-2">🎲</div>
          <div className="font-semibold">Tiradas</div>
          <div className="text-sm text-gray-400">3d6 + atributo + habilidad</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 opacity-50 cursor-not-allowed">
          <div className="text-2xl mb-2">⚔️</div>
          <div className="font-semibold">Combate</div>
          <div className="text-sm text-gray-400">Iniciativa y HP</div>
        </div>
      </div>
    </div>
  )
}

export default App
