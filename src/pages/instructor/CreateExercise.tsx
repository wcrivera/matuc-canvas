// ============================================================================
// PÁGINA CREAR EXERCISE - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/pages/instructor/CreateExercise.tsx
// Propósito: Página para crear nuevos Exercise Sets
// Compatible con backend API y navegación del router

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Plus,
  Settings,
  Users,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

import ExerciseSetForm from '../../components/forms/ExerciseSetForm';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { ExerciseSetBase } from '../../types/shared';
import { checkApiHealth } from '../../services/api';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const CreateExercise: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState<'form' | 'success'>('form');
  const [createdExercise, setCreatedExercise] = useState<ExerciseSetBase | null>(null);

  // Obtener cursoId de query params si viene desde una página específica
  const searchParams = new URLSearchParams(location.search);
  const cursoId = searchParams.get('cursoId') || undefined;

  // Verificar salud de la API al cargar
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthy = await checkApiHealth();
        setIsApiHealthy(healthy);
        if (!healthy) {
          toast.error('No se puede conectar con el servidor. Verifica que esté funcionando.');
        }
      } catch (error) {
        setIsApiHealthy(false);
        console.error('Error checking API health:', error);
      }
    };

    checkHealth();
  }, []);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleGoBack = () => {
    navigate('/instructor/dashboard');
  };

  const handleExerciseCreated = (exerciseSet: ExerciseSetBase) => {
    setCreatedExercise(exerciseSet);
    setCurrentStep('success');
    toast.success('¡Exercise Set creado exitosamente!');
  };

  const handleCancel = () => {
    navigate('/instructor/dashboard');
  };

  const handleGoToDashboard = () => {
    navigate('/instructor/dashboard');
  };

  const handleAddQuestions = () => {
    if (createdExercise) {
      // Navegar a agregar preguntas (implementaremos esto después)
      navigate(`/instructor/exercise/${createdExercise.id}/questions`);
    }
  };

  const handleEditExercise = () => {
    if (createdExercise) {
      navigate(`/instructor/exercise/${createdExercise.id}/edit`);
    }
  };

  // ============================================================================
  // COMPONENTES DE RENDER
  // ============================================================================

  const renderBreadcrumb = () => (
    <div className="mb-6">
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <button
          onClick={handleGoBack}
          className="flex items-center hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Dashboard
        </button>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">
          Crear Exercise Set
        </span>
      </nav>
    </div>
  );

  const renderHealthWarning = () => {
    if (isApiHealthy === false) {
      return (
        <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
          <Card.Content>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Problema de conectividad
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  No se puede conectar con el servidor backend. Verifica que esté funcionando en el puerto 3000.
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      );
    }
    return null;
  };

  const renderSuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <Card className="max-w-2xl mx-auto">
        <Card.Content>
          <div className="py-8">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ¡Exercise Set Creado!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Tu exercise set <strong>"{createdExercise?.titulo}"</strong> ha sido creado exitosamente.
            </p>

            {/* Exercise Info */}
            {createdExercise && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-8 text-left">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Información del Exercise Set:
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>ID:</strong> {createdExercise.id}</p>
                  <p><strong>Estado:</strong> {createdExercise.estado}</p>
                  <p><strong>Intentos permitidos:</strong> {createdExercise.configuracion.intentos}</p>
                  <p><strong>Creado:</strong> {new Date(createdExercise.fechaCreacion).toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                ¿Qué quieres hacer ahora?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={handleAddQuestions}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Plus className="h-6 w-6 mb-2" />
                  <span className="font-medium">Agregar Preguntas</span>
                  <span className="text-xs opacity-80">Crear preguntas anidadas</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleEditExercise}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Settings className="h-6 w-6 mb-2" />
                  <span className="font-medium">Editar Exercise</span>
                  <span className="text-xs opacity-80">Modificar configuración</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleGoToDashboard}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Users className="h-6 w-6 mb-2" />
                  <span className="font-medium">Ver Dashboard</span>
                  <span className="text-xs opacity-80">Ir a la lista de exercises</span>
                </Button>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        {renderBreadcrumb()}

        {/* Health Warning */}
        {renderHealthWarning()}

        {/* Main Content */}
        {currentStep === 'form' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Crear Exercise Set
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Crea un nuevo exercise set con preguntas anidadas para tus estudiantes.
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Card.Content>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                      ¿Cómo crear un Exercise Set?
                    </h3>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Completa la información básica (título, descripción)</li>
                      <li>• Configura los parámetros del exercise (intentos, tiempo, etc.)</li>
                      <li>• Una vez creado, podrás agregar preguntas anidadas</li>
                      <li>• Publica cuando esté listo para tus estudiantes</li>
                    </ul>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Exercise Set Form */}
            <ExerciseSetForm
              mode="create"
              onSave={handleExerciseCreated}
              onCancel={handleCancel}
              cursoId={cursoId}
            />
          </motion.div>
        ) : (
          renderSuccessStep()
        )}

        {/* API Status (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-8 bg-gray-50 dark:bg-gray-800">
            <Card.Content>
              <details>
                <summary className="text-sm font-medium text-gray-600 cursor-pointer">
                  Debug: Estado de la API
                </summary>
                <div className="mt-2 text-xs text-gray-500">
                  <p>API Health: {isApiHealthy === null ? 'Checking...' : isApiHealthy ? 'Healthy' : 'Unhealthy'}</p>
                  <p>Current Step: {currentStep}</p>
                  <p>Curso ID: {cursoId || 'No especificado'}</p>
                  {createdExercise && (
                    <p>Created Exercise ID: {createdExercise.id}</p>
                  )}
                </div>
              </details>
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateExercise;