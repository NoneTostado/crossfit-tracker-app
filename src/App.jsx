import React, { useState, useEffect } from 'react';
import { Home, Target, TrendingUp, Zap, Award } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [workouts, setWorkouts] = useState([]);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('crossfit-workouts');
    if (saved) {
      setWorkouts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('crossfit-workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now(),
      date: new Date().toLocaleDateString('es-MX')
    };
    setWorkouts([newWorkout, ...workouts]);
    setTimerSeconds(0);
    setTimerActive(false);
  };

  const DashboardSection = () => {
    const todaysWorkouts = workouts.filter(w => 
      w.date === new Date().toLocaleDateString('es-MX')
    );
    const streak = 7;
    const weeklyConsistency = 85;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Hola Atleta!</h2>
          <p className="text-blue-100">
            {new Date().toLocaleDateString('es-MX', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur">
              <div className="text-sm">Racha</div>
              <div className="text-2xl font-bold">{streak} dias</div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur">
              <div className="text-sm">Consistencia</div>
              <div className="text-2xl font-bold">{weeklyConsistency}%</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Entrenamientos de Hoy
          </h3>
          {todaysWorkouts.length > 0 ? (
            <div className="space-y-3">
              {todaysWorkouts.map(w => (
                <div key={w.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="font-semibold">{w.type}</div>
                  <div className="text-sm text-gray-600">Tiempo: {w.time}</div>
                  <div className="text-sm text-gray-600">RPE: {w.rpe}/10</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay entrenamientos registrados hoy</p>
              <button
                onClick={() => setActiveSection('workout')}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Registrar Entrenamiento
              </button>
            </div>
          )}
        </div>

        {workouts.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Ultimos Entrenamientos
            </h3>
            <div className="space-y-3">
              {workouts.slice(0, 5).map(w => (
                <div key={w.id} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div>
                    <div className="font-semibold">{w.type}</div>
                    <div className="text-sm text-gray-500">{w.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{w.time}</div>
                    <div className="text-xs text-gray-500">RPE: {w.rpe}/10</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const WorkoutSection = () => {
    const [workoutData, setWorkoutData] = useState({
      type: '',
      time: '',
      rpe: 5,
      notes: '',
      rx: true
    });

    const handleSave = () => {
      if (!workoutData.type || !workoutData.time) {
        alert('Por favor completa el tipo de WOD y el tiempo');
        return;
      }
      saveWorkout(workoutData);
      setActiveSection('dashboard');
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Registrar Entrenamiento</h2>

        {!timerActive && timerSeconds === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de WOD
              </label>
              <input
                type="text"
                placeholder="Ej: AMRAP 12, Fran, 5x5 Back Squat"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                value={workoutData.type}
                onChange={(e) => setWorkoutData({...workoutData, type: e.target.value})}
              />
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white text-center">
              <div className="text-6xl font-bold mb-4">{formatTime(timerSeconds)}</div>
              <button
                onClick={() => setTimerActive(true)}
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50"
              >
                Iniciar Timer
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">{formatTime(timerSeconds)}</div>
                <div className="text-orange-100 mb-6">Entrenamiento en progreso</div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-orange-50"
                  >
                    {timerActive ? 'Pausar' : 'Reanudar'}
                  </button>
                  <button
                    onClick={() => {
                      setWorkoutData({...workoutData, time: formatTime(timerSeconds)});
                      setTimerActive(false);
                    }}
                    className="bg-white/20 text-white px-8 py-3 rounded-lg font-bold backdrop-blur hover:bg-white/30"
                  >
                    Finalizar
                  </button>
                </div>
              </div>
            </div>

            {!timerActive && timerSeconds > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
                <h3 className="font-bold text-lg">Detalles del Entrenamiento</h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tiempo Final
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-bold text-2xl text-center"
                    value={workoutData.time}
                    onChange={(e) => setWorkoutData({...workoutData, time: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rx o Scaled?
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setWorkoutData({...workoutData, rx: true})}
                      className={`flex-1 py-3 rounded-lg font-semibold ${
                        workoutData.rx
                          ? 'bg-green-100 border-2 border-green-500 text-green-700'
                          : 'bg-gray-100 border-2 border-gray-300 text-gray-700'
                      }`}
                    >
                      Rx
                    </button>
                    <button
                      onClick={() => setWorkoutData({...workoutData, rx: false})}
                      className={`flex-1 py-3 rounded-lg font-semibold ${
                        !workoutData.rx
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                          : 'bg-gray-100 border-2 border-gray-300 text-gray-700'
                      }`}
                    >
                      Scaled
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    RPE (Esfuerzo Percibido) - {workoutData.rpe}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={workoutData.rpe}
                    onChange={(e) => setWorkoutData({...workoutData, rpe: e.target.value})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Facil</span>
                    <span>Moderado</span>
                    <span>Maximo</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notas del Entrenamiento
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                    rows="3"
                    placeholder="Como te sentiste? Alguna observacion?"
                    value={workoutData.notes}
                    onChange={(e) => setWorkoutData({...workoutData, notes: e.target.value})}
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 text-white rounded-lg py-4 font-bold text-lg hover:bg-blue-700"
                >
                  Guardar Entrenamiento
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const ProgressSection = () => {
    const totalWorkouts = workouts.length;
    const avgRPE = workouts.length > 0
      ? (workouts.reduce((sum, w) => sum + parseInt(w.rpe), 0) / workouts.length).toFixed(1)
      : 0;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Progreso</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{totalWorkouts}</div>
            <div className="text-gray-600">Entrenamientos</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{avgRPE}</div>
            <div className="text-gray-600">RPE Promedio</div>
          </div>
        </div>

        {workouts.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4">Historial Completo</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {workouts.map(w => (
                <div key={w.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{w.type}</div>
                      <div className="text-sm text-gray-500">{w.date}</div>
                      {w.notes && (
                        <div className="text-sm text-gray-600 mt-1">{w.notes}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{w.time}</div>
                      <div className="text-xs text-gray-500">RPE: {w.rpe}/10</div>
                      <div className="text-xs">
                        {w.rx ? 'Rx' : 'Scaled'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {workouts.length === 0 && (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-4">
              No hay entrenamientos registrados aun
            </p>
            <button
              onClick={() => setActiveSection('workout')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Registrar Primer Entrenamiento
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'dashboard': return <DashboardSection />;
      case 'workout': return <WorkoutSection />;
      case 'progress': return <ProgressSection />;
      default: return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen shadow-2xl">
        <div className="bg-white border-b sticky top-0 z-50">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800">CrossFit Tracker</h1>
            <p className="text-sm text-gray-500">Tu entrenamiento, digitalizado</p>
          </div>
        </div>

        <div className="p-4 pb-24">
          {renderSection()}
        </div>

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t shadow-lg">
          <div className="grid grid-cols-3 gap-2 p-2">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`flex flex-col items-center gap-1 py-3 rounded-lg transition-colors ${
                activeSection === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-semibold">Inicio</span>
            </button>

            <button
              onClick={() => setActiveSection('workout')}
              className={`flex flex-col items-center gap-1 py-3 rounded-lg transition-colors ${
                activeSection === 'workout' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
            >
              <Target className="w-6 h-6" />
              <span className="text-xs font-semibold">Entrenar</span>
            </button>

            <button
              onClick={() => setActiveSection('progress')}
              className={`flex flex-col items-center gap-1 py-3 rounded-lg transition-colors ${
                activeSection === 'progress' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-semibold">Progreso</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;