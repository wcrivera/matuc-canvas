import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Plus, 
  Trash2, 
  ArrowLeft,
  BookOpen,
  Settings,
  Eye,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  titulo: string;
  enunciado: string;
  tipo: 'multiple' | 'verdadero_falso' | 'texto_corto' | 'numerico';
  orden: number;
  config: {
    opciones?: string[];
    tolerancia?: number;
    caseSensitive?: boolean;
  };
  respuestaCorrecta: any;
  feedback: {
    correcto: string;
    incorrecto: string;
  };
  puntos: number;
}

const CreateExercise: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'questions' | 'settings'>('info');
  
  // Form state
  const [exerciseData, setExerciseData] = useState({
    titulo: '',
    descripcion: '',
    instrucciones: '',
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const questionTypes = [
    { value: 'multiple', label: 'Opción Múltiple', icon: '⭕' },
    { value: 'verdadero_falso', label: 'Verdadero/Falso', icon: '✅' },
    { value: 'texto_corto', label: 'Texto Corto', icon: '📝' },
    { value: 'numerico', label: 'Numérico', icon: '🔢' },
  ];

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      titulo: '',
      enunciado: '',
      tipo: 'multiple',
      orden: questions.length + 1,
      config: {},
      respuestaCorrecta: '',
      feedback: { correcto: '', incorrecto: '' },
      puntos: 1,
    };
    setEditingQuestion(newQuestion);
  };

  const saveQuestion = (question: Question) => {
    if (questions.find(q => q.id === question.id)) {
      setQuestions(questions.map(q => q.id === question.id ? question : q));
    } else {
      setQuestions([...questions, question]);
    }
    setEditingQuestion(null);
    toast.success('Pregunta guardada');
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.success('Pregunta eliminada');
  };

  const saveExercise = async () => {
    if (!exerciseData.titulo || !exerciseData.descripcion || questions.length === 0) {
      toast.error('Completa todos los campos requeridos');
      return;
    }

    try {
      // Aquí iría la llamada al backend
      toast.success('Ejercicio guardado exitosamente');
      navigate('/instructor');
    } catch (error) {
      toast.error('Error al guardar el ejercicio');
    }
  };

  const tabs = [
    { id: 'info', label: 'Información', icon: BookOpen },
    { id: 'questions', label: 'Preguntas', icon: Plus },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/instructor')}
            className="p-2 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Crear Nuevo Ejercicio
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Diseña ejercicios interactivos con preguntas anidadas
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveExercise}
          className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-4 w-4" />
          <span>Guardar Ejercicio</span>
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 p-1"
      >
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 p-8"
        >
          
          {/* Información Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Información del Ejercicio
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Título del Ejercicio *
                  </label>
                  <input
                    type="text"
                    value={exerciseData.titulo}
                    onChange={(e) => setExerciseData({...exerciseData, titulo: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/30 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="Ej: Álgebra Lineal - Vectores"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Puntos Totales
                  </label>
                  <input
                    type="number"
                    value={questions.reduce((sum, q) => sum + q.puntos, 0)}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-600 border border-white/20 dark:border-gray-600/30 text-gray-500"
                    placeholder="Calculado automáticamente"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descripción *
                </label>
                <textarea
                  value={exerciseData.descripcion}
                  onChange={(e) => setExerciseData({...exerciseData, descripcion: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/30 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  placeholder="Describe qué aprenderán los estudiantes con este ejercicio..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Instrucciones
                </label>
                <textarea
                  value={exerciseData.instrucciones}
                  onChange={(e) => setExerciseData({...exerciseData, instrucciones: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/30 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  placeholder="Instrucciones adicionales para los estudiantes..."
                />
              </div>
            </div>
          )}

          {/* Preguntas Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Preguntas ({questions.length})
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addQuestion}
                  className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg transition-colors duration-300"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Pregunta</span>
                </motion.button>
              </div>

              {/* Lista de Preguntas */}
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-4 border border-white/20 dark:border-gray-600/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {question.titulo || `Pregunta ${index + 1}`}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {question.enunciado || 'Sin enunciado'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Tipo: {questionTypes.find(t => t.value === question.tipo)?.label}</span>
                          <span>Puntos: {question.puntos}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setEditingQuestion(question)}
                          className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteQuestion(question.id)}
                          className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {questions.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay preguntas aún. ¡Agrega la primera!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Configuración Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Configuración del Ejercicio
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Intentos y Tiempo
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Intentos Permitidos
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/30 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300">
                      <option value="1">1 intento</option>
                      <option value="2">2 intentos</option>
                      <option value="3">3 intentos</option>
                      <option value="unlimited">Ilimitados</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tiempo Límite (minutos)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/30 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="Sin límite"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Opciones de Visualización
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Mostrar respuestas correctas al final
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Permitir navegación entre preguntas
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Guardado automático
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Question Editor Modal */}
      <AnimatePresence>
        {editingQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingQuestion(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {editingQuestion.titulo ? 'Editar Pregunta' : 'Nueva Pregunta'}
              </h3>
              
              {/* Form básico para pregunta */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título de la Pregunta
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.titulo}
                    onChange={(e) => setEditingQuestion({...editingQuestion, titulo: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: Cálculo de vectores"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enunciado
                  </label>
                  <textarea
                    value={editingQuestion.enunciado}
                    onChange={(e) => setEditingQuestion({...editingQuestion, enunciado: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe la pregunta que deben responder..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de Pregunta
                    </label>
                    <select
                      value={editingQuestion.tipo}
                      onChange={(e) => setEditingQuestion({...editingQuestion, tipo: e.target.value as any})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {questionTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Puntos
                    </label>
                    <input
                      type="number"
                      value={editingQuestion.puntos}
                      onChange={(e) => setEditingQuestion({...editingQuestion, puntos: parseInt(e.target.value) || 1})}
                      min="1"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingQuestion(null)}
                    className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
                  >
                    Cancelar
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => saveQuestion(editingQuestion)}
                    className="flex items-center space-x-2 px-6 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors duration-300"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Guardar Pregunta</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateExercise;