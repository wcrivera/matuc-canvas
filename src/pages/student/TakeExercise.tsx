// ============================================================================
// TAKE EXERCISE ESTUDIANTE - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/pages/student/TakeExercise.tsx
// Propósito: Resolver ejercicio específico SIN datos de muestra
// Compatible con API real y estados limpios

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Clock,
    Send,
    RefreshCw,
    AlertCircle,
    Play,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { getExerciseSetById } from '../../services/exerciseSetService';
import { ExerciseSetBase } from '../../types/shared';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LaTeX from '../../components/ui/LaTeX';

// ============================================================================
// INTERFACES
// ============================================================================

interface AttemptState {
    currentQuestion: number;
    responses: Record<string, any>;
    timeStarted: Date;
    timeElapsed: number; // en segundos
    isSubmitted: boolean;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const TakeExercise: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Estados principales
    const [exercise, setExercise] = useState<ExerciseSetBase | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados del intento
    const [attempt, setAttempt] = useState<AttemptState>({
        currentQuestion: 0,
        responses: {},
        timeStarted: new Date(),
        timeElapsed: 0,
        isSubmitted: false
    });

    // Estados de UI
    const [isTimerActive, setIsTimerActive] = useState(false);

    // ============================================================================
    // EFECTOS Y CARGA DE DATOS
    // ============================================================================

    useEffect(() => {
        if (id) {
            loadExercise(id);
        }
    }, [id]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isTimerActive && exercise?.configuracion.tiempo) {
            interval = setInterval(() => {
                setAttempt(prev => ({
                    ...prev,
                    timeElapsed: prev.timeElapsed + 1
                }));
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive, exercise]);

    const loadExercise = async (exerciseId: string) => {
        try {
            setLoading(true);
            setError(null);

            const exerciseData = await getExerciseSetById(exerciseId);

            if (exerciseData) {
                setExercise(exerciseData);

                // Verificar si el ejercicio está publicado
                if (!exerciseData.publicado || exerciseData.estado !== 'published') {
                    setError('Este ejercicio no está disponible');
                    return;
                }

                // Verificar si tiene preguntas
                if (exerciseData.preguntas.length === 0) {
                    setError('Este ejercicio no tiene preguntas aún');
                    return;
                }

                // Inicializar intento
                setAttempt(prev => ({
                    ...prev,
                    timeStarted: new Date()
                }));

            } else {
                setError('Ejercicio no encontrado');
            }

        } catch (err: any) {
            console.error('Error loading exercise:', err);
            setError('Error al cargar el ejercicio');
            toast.error('No se pudo cargar el ejercicio');
        } finally {
            setLoading(false);
        }
    };

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const handleGoBack = () => {
        if (window.confirm('¿Estás seguro de que quieres salir? Se perderá tu progreso.')) {
            navigate('/student/exercises');
        }
    };

    const handleStartExercise = () => {
        setIsTimerActive(true);
        setAttempt(prev => ({
            ...prev,
            timeStarted: new Date(),
            timeElapsed: 0
        }));
        toast.success('¡Ejercicio iniciado! Buena suerte.');
    };

    const handleNextQuestion = () => {
        if (exercise && attempt.currentQuestion < exercise.preguntas.length - 1) {
            setAttempt(prev => ({
                ...prev,
                currentQuestion: prev.currentQuestion + 1
            }));
        }
    };

    const handlePrevQuestion = () => {
        if (attempt.currentQuestion > 0) {
            setAttempt(prev => ({
                ...prev,
                currentQuestion: prev.currentQuestion - 1
            }));
        }
    };

    const handleSubmitExercise = async () => {
        if (!window.confirm('¿Estás seguro de que quieres enviar tu ejercicio? No podrás modificar las respuestas.')) {
            return;
        }

        try {
            setIsTimerActive(false);

            // TODO: Cuando tengamos API de intentos
            // await submitAttempt({
            //     exerciseSetId: exercise!.id,
            //     responses: attempt.responses,
            //     timeElapsed: attempt.timeElapsed
            // });

            setAttempt(prev => ({
                ...prev,
                isSubmitted: true
            }));

            toast.success('¡Ejercicio enviado exitosamente!');

            // Redirigir a resultados después de un delay
            setTimeout(() => {
                navigate(`/student/exercise/${exercise!.id}/results`);
            }, 2000);

        } catch (error) {
            toast.error('Error al enviar el ejercicio');
            setIsTimerActive(true); // Reactivar timer si falla
        }
    };

    // ============================================================================
    // RENDER HELPERS
    // ============================================================================

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getTimeRemaining = (): number => {
        if (!exercise?.configuracion.tiempo) return 0;
        const timeLimit = exercise.configuracion.tiempo * 60; // convertir a segundos
        return Math.max(0, timeLimit - attempt.timeElapsed);
    };

    const isTimeUp = (): boolean => {
        return exercise?.configuracion.tiempo ? getTimeRemaining() <= 0 : false;
    };

    const renderExerciseHeader = () => {
        if (!exercise) return null;

        return (
            <Card className="mb-6">
                <Card.Header>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                <LaTeX>{exercise.titulo}</LaTeX>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                <LaTeX>{exercise.descripcion}</LaTeX>
                            </p>
                        </div>

                        {exercise.configuracion.tiempo && isTimerActive && (
                            <div className={`text-right ${isTimeUp() ? 'text-red-600' : 'text-gray-600'}`}>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span className="font-mono text-lg">
                                        {formatTime(getTimeRemaining())}
                                    </span>
                                </div>
                                <p className="text-xs">tiempo restante</p>
                            </div>
                        )}
                    </div>

                    {exercise.instrucciones && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                                Instrucciones:
                            </h3>
                            <div className="text-blue-700 dark:text-blue-300">
                                <LaTeX>{exercise.instrucciones}</LaTeX>
                            </div>
                        </div>
                    )}
                </Card.Header>
            </Card>
        );
    };

    const renderProgress = () => {
        if (!exercise) return null;

        const progress = ((attempt.currentQuestion + 1) / exercise.preguntas.length) * 100;

        return (
            <Card className="mb-6">
                <Card.Content>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Pregunta {attempt.currentQuestion + 1} de {exercise.preguntas.length}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {Math.round(progress)}% completado
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </Card.Content>
            </Card>
        );
    };

    const renderQuestion = () => {
        if (!exercise || exercise.preguntas.length === 0) return null;

        const currentQuestion = exercise.preguntas[attempt.currentQuestion];

        return (
            <Card className="mb-6">
                <Card.Header>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Pregunta {attempt.currentQuestion + 1}
                    </h2>
                </Card.Header>
                <Card.Content>
                    <div className="mb-6">
                        <LaTeX size="large">{currentQuestion.enunciado}</LaTeX>
                    </div>

                    {/* TODO: Renderizar diferentes tipos de pregunta */}
                    <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-400">
                            Tipo de pregunta: {currentQuestion.tipo}
                        </p>

                        {/* Placeholder para input de respuesta */}
                        <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                Componente de respuesta para {currentQuestion.tipo}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                                (Se implementará según el tipo de pregunta)
                            </p>
                        </div>
                    </div>
                </Card.Content>
            </Card>
        );
    };

    const renderNavigation = () => {
        if (!exercise || !isTimerActive) return null;

        const isLastQuestion = attempt.currentQuestion === exercise.preguntas.length - 1;

        return (
            <Card>
                <Card.Content>
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePrevQuestion}
                            disabled={attempt.currentQuestion === 0}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Anterior
                        </Button>

                        <div className="flex items-center space-x-2">
                            {isLastQuestion ? (
                                <Button
                                    onClick={handleSubmitExercise}
                                    disabled={attempt.isSubmitted || isTimeUp()}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Enviar Ejercicio
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNextQuestion}
                                    disabled={attempt.currentQuestion === exercise.preguntas.length - 1}
                                >
                                    Siguiente
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Content>
            </Card>
        );
    };

    const renderStartScreen = () => {
        if (!exercise) return null;

        return (
            <Card className="text-center py-12">
                <Card.Content>
                    <Play className="h-16 w-16 text-blue-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        ¿Listo para comenzar?
                    </h2>
                    <div className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                        <p>{exercise.preguntas.length} preguntas</p>
                        <p>{exercise.configuracion.intentos} intentos disponibles</p>
                        {exercise.configuracion.tiempo && (
                            <p>Tiempo límite: {exercise.configuracion.tiempo} minutos</p>
                        )}
                    </div>
                    <Button onClick={handleStartExercise} size="lg">
                        <Play className="h-5 w-5 mr-2" />
                        Comenzar Ejercicio
                    </Button>
                </Card.Content>
            </Card>
        );
    };

    // ============================================================================
    // RENDER PRINCIPAL
    // ============================================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4 text-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Cargando ejercicio...</p>
                </div>
            </div>
        );
    }

    if (error || !exercise) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4 text-center py-12">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {error || 'Ejercicio no encontrado'}
                    </h2>
                    <Button onClick={handleGoBack} className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a la Lista
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <div className="mb-6">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Volver a Ejercicios
                    </button>
                </div>

                {/* Header */}
                {renderExerciseHeader()}

                {/* Content */}
                {!isTimerActive ? (
                    renderStartScreen()
                ) : attempt.isSubmitted ? (
                    <Card className="text-center py-12">
                        <Card.Content>
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                ¡Ejercicio Enviado!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Serás redirigido a los resultados...
                            </p>
                        </Card.Content>
                    </Card>
                ) : (
                    <>
                        {renderProgress()}
                        {renderQuestion()}
                        {renderNavigation()}
                    </>
                )}

            </div>
        </div>
    );
};

export default TakeExercise;