import { useState } from 'react'
import './App.css'

const programs = [
  {
    id: 1,
    name: 'Omuz Egzersizleri',
    exercises: [
      { id: 1, name: 'Omuz Kaldırma', sets: 3, reps: 10, image: 'shoulder-lift.jpg' },
      { id: 2, name: 'Omuz Dairesi', sets: 3, reps: 15, image: 'shoulder-circle.jpg' },
    ],
  },
  {
    id: 2,
    name: 'Sırt Egzersizleri',
    exercises: [
      { id: 3, name: 'Sırt Germe', sets: 3, reps: 20, image: 'back-stretch.jpg' },
      { id: 4, name: 'Kedi-Köpek Pozisyonu', sets: 3, reps: 10, image: 'cat-cow.jpg' },
    ],
  },
]

function App() {
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [currentSet, setCurrentSet] = useState(1)
  const [currentRep, setCurrentRep] = useState(0)

  const selectProgram = (program) => {
    setSelectedProgram(program)
    setSelectedExercise(null)
  }

  const selectExercise = (exercise) => {
    setSelectedExercise(exercise)
    setCurrentSet(1)
    setCurrentRep(0)
  }

  const nextRep = () => {
    if (currentRep < selectedExercise.reps) {
      setCurrentRep(currentRep + 1)
    } else if (currentSet < selectedExercise.sets) {
      setCurrentSet(currentSet + 1)
      setCurrentRep(1)
    }
  }

  const resetExercise = () => {
    setCurrentSet(1)
    setCurrentRep(0)
  }

  if (selectedExercise) {
    return (
      <div className="exercise-view">
        <div className="animation-area">
          <img src={`/${selectedExercise.image}`} alt={selectedExercise.name} />
        </div>
        <div className="controls">
          <p className="text-lg font-semibold">Set: {currentSet} / {selectedExercise.sets}</p>
          <p className="text-lg font-semibold">Tekrar: {currentRep} / {selectedExercise.reps}</p>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${(currentRep / selectedExercise.reps) * 100}%` }}></div>
          </div>
          <div className="space-x-2 mt-4">
            <button onClick={nextRep} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Tekrar Tamamla</button>
            <button onClick={resetExercise} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Sıfırla</button>
            <button onClick={() => setSelectedExercise(null)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Geri</button>
          </div>
        </div>
      </div>
    )
  }

  if (selectedProgram) {
    return (
      <div className="program-view">
        <h1>{selectedProgram.name}</h1>
        <div className="exercise-list">
          {selectedProgram.exercises.map(ex => (
            <div key={ex.id} className="exercise-card" onClick={() => selectExercise(ex)}>
              <h2>{ex.name}</h2>
              <p>{ex.sets} set, {ex.reps} tekrar</p>
            </div>
          ))}
        </div>
        <button onClick={() => setSelectedProgram(null)}>Geri</button>
      </div>
    )
  }

  return (
    <div className="home">
      <h1>Egzersiz Programları</h1>
      <div className="program-list">
        {programs.map(prog => (
          <div key={prog.id} className="program-card" onClick={() => selectProgram(prog)}>
            <h2>{prog.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
