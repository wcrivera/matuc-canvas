// ============================================================================
// EXERCISE LIST ESTUDIANTE - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/pages/student/ExerciseList.tsx
// Propósito: Lista de ejercicios para estudiantes SIN datos de muestra
// Compatible con API real y estados limpios

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Play,
    CheckCircle,
    Clock,
    Trophy,
    BookOpen,
    Target,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { getExerciseSets } from '../../services/exerciseSetService';
import { ExerciseSetBase } from '../../types/shared';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// ============================================================================
// INTERFACES
// ============================================================================

interface ExerciseStats {
    totalExercises: number;
    completedCount: number;
    averageScore: number;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const ExerciseList: React.FC = () => {
    // Estados
    const [exercises, setExercises] = useState<ExerciseSetBase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<ExerciseStats>({
        totalExercises: 0,
        completedCount: 0,
        averageScore: 0
    });

    // ============================================================================
    // EFECTOS Y CARGA DE DATOS
    // ============================================================================

    useEffect(() => {
        loadExercises();
    }, []);

    useEffect(() => {
        if (exercises.length > 0) {
            calculateStats();
        }
    }, [exercises]);

    const loadExercises = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getExerciseSets({ page: 1, limit: 50 });

            if (response.items) {
                // Filtrar solo ejercicios publicados para estudiantes
                const publishedExercises = response.items.filter(ex =>
                    ex.publicado && ex.estado === 'published'
                );
                setExercises(publishedExercises);
            } else {
                setExercises([]);
            }

        } catch (err: any) {
            console.error('Error loading exercises:', err);
            setError('Error al cargar los ejercicios');
            toast.error('No se pudieron cargar los ejercicios');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        // TODO: Cuando tengamos intentos de estudiantes reales
        // const completedCount = exercises.filter(ex => ex.completado).length;
        // const averageScore = exercises
        //     .filter(ex => ex.puntaje)
        //     .reduce((sum, ex) => sum + ex.puntaje!, 0) / exercises.filter(ex => ex.puntaje).length || 0;

        // TEMPORAL: Stats básicas mientras no tengamos intentos
        const newStats: ExerciseStats = {
            totalExercises: exercises.length,
            completedCount: 0, // Sin intentos aún
            averageScore: 0    // Sin puntajes aún
        };

        setStats(newStats);
    };

    // ============================================================================
    // RENDER HELPERS
    // ============================================================================

    const renderStats = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <Card.Content>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.totalExercises}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Ejercicios disponibles
                            </p>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            <Card>
                <Card.Content>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.completedCount}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Completados
                            </p>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            <Card>
                <Card.Content>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Trophy className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.averageScore > 0 ? `${Math.round(stats.averageScore)}%` : '--'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Promedio
                            </p>
                        </div>
                    </div>
                </Card.Content>
            </Card>
        </div>
    );

    const renderEmptyState = () => (
        <Card className="text-center py-16">
            <Card.Content>
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No hay ejercicios disponibles
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Tu instructor aún no ha publicado ejercicios. Vuelve más tarde.
                </p>
                <Button onClick={loadExercises} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar
                </Button>
            </Card.Content>
        </Card>
    );

    const renderErrorState = () => (
        <Card className="text-center py-16 border-red-200 bg-red-50 dark:bg-red-900/20">
            <Card.Content>
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                    Error al cargar ejercicios
                </h3>
                <p className="text-red-600 dark:text-red-300 mb-6">
                    {error || 'Hubo un problema al conectar con el servidor.'}
                </p>
                <Button onClick={loadExercises} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                </Button>
            </Card.Content>
        </Card>
    );

    const renderExerciseCard = (exercise: ExerciseSetBase, index: number) => {
        // TODO: Cuando tengamos intentos de estudiantes
        // const isCompleted = exercise.completado;
        // const score = exercise.puntaje;

        const isCompleted = false; // TEMPORAL
        const score = null;        // TEMPORAL

        return (
            <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
            >
                <Card className={`hover:shadow-lg transition-shadow ${isCompleted ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : ''
                    }`}>
                    <Card.Header>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {exercise.titulo}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {exercise.descripcion}
                                </p>
                            </div>

                            {isCompleted && (
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    {score && (
                                        <span className="text-sm font-medium text-green-600">
                                            {score}%
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card.Header>

                    <Card.Content>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                    <BookOpen className="h-4 w-4 mr-1" />
                                    {exercise.preguntas.length} preguntas
                                </span>
                                <span className="flex items-center">
                                    <Target className="h-4 w-4 mr-1" />
                                    {exercise.configuracion.intentos} intentos
                                </span>
                                {exercise.configuracion.tiempo && (
                                    <span className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {exercise.configuracion.tiempo} min
                                    </span>
                                )}
                            </div>
                        </div>

                        {exercise.instrucciones && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 border border-blue-200 dark:border-blue-800">
                                <p className="text-blue-800 dark:text-blue-200 text-sm">
                                    <strong>Instrucciones:</strong> {exercise.instrucciones}
                                </p>
                            </div>
                        )}
                    </Card.Content>

                    <Card.Footer>
                        <div className="flex items-center justify-between w-full">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Creado: {new Date(exercise.fechaCreacion).toLocaleDateString('es-ES')}
                            </div>

                            <Link to={`/student/exercise/${exercise.id}`}>
                                <Button
                                    className={`${isCompleted
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    <Play className="h-4 w-4 mr-2" />
                                    {isCompleted ? 'Ver Resultado' : 'Comenzar'}
                                </Button>
                            </Link>
                        </div>
                    </Card.Footer>
                </Card>
            </motion.div>
        );
    };

    // ============================================================================
    // RENDER PRINCIPAL
    // ============================================================================

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Mis Ejercicios
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Completa los ejercicios asignados y mejora tu conocimiento.
                    </p>
                </motion.div>

                {/* Stats */}
                {!error && renderStats()}

                {/* Content */}
                {loading ? (
                    <div className="text-center py-12">
                        <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Cargando ejercicios...</p>
                    </div>
                ) : error ? (
                    renderErrorState()
                ) : exercises.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <div className="space-y-6">
                        {exercises.map(renderExerciseCard)}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ExerciseList;