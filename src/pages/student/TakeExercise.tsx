import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Clock,
    BookOpen,
    Send
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data
const mockExercise = {
    esid: '1',
    titulo: 'Álgebra Lineal - Vectores',
    descripcion: 'Ejercicios sobre operaciones básicas con vectores.',
    instrucciones: 'Responde todas las preguntas. Puedes navegar entre ellas libremente.',
    questions: [
        {
            nqid: '1',
            titulo: 'Suma de Vectores',
            enunciado: '¿Cuál es la suma de los vectores (2,3) y (4,1)?',
            tipo: 'multiple' as const,
            config: {
                opciones: ['(6,4)', '(2,4)', '(6,3)', '(8,3)']
            },
            puntos: 10,
        },
        {
            nqid: '2',
            titulo: 'Producto Escalar',
            enunciado: 'Calcula el producto escalar de (3,4) · (2,1)',
            tipo: 'numerico' as const,
            config: {
                tolerancia: 0.1
            },
            puntos: 15,
        },
        {
            nqid: '3',
            titulo: 'Vector Unitario',
            enunciado: '¿Qué es un vector unitario?',
            tipo: 'texto_corto' as const,
            config: {
                caseSensitive: false
            },
            puntos: 10,
        },
    ],
};

const TakeExercise: React.FC = () => {
    const { esid } = useParams();
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (questionId: string, answer: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const goToQuestion = (index: number) => {
        setCurrentQuestion(index);
    };

    const nextQuestion = () => {
        if (currentQuestion < mockExercise.questions.length - 1) {
            setCurrentQuestion(current => current + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(current => current - 1);
        }
    };

    const submitExercise = async () => {
        setIsSubmitting(true);
        try {
            // Aquí iría la llamada al backend
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simular loading
            toast.success('Ejercicio enviado exitosamente');
            navigate('/student');
        } catch (error) {
            toast.error('Error al enviar el ejercicio');
        } finally {
            setIsSubmitting(false);
        }
    };

    const question = mockExercise.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / mockExercise.questions.length) * 100;
    const answeredQuestions = Object.keys(answers).length;

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30"
            >
                <div className="flex items-center space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/student')}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </motion.button>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {mockExercise.titulo}
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Pregunta {currentQuestion + 1} de {mockExercise.questions.length}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(timeElapsed)}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>{answeredQuestions}/{mockExercise.questions.length}</span>
                    </div>
                </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-full h-2 overflow-hidden"
            >
                <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </motion.div>

            {/* Question Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 justify-center"
            >
                {mockExercise.questions.map((_, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => goToQuestion(index)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${index === currentQuestion
                                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                                : answers[mockExercise.questions[index].nqid]
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 hover:bg-white/90 dark:hover:bg-gray-800/90'
                            }`}
                    >
                        {index + 1}
                    </motion.button>
                ))}
            </motion.div>

            {/* Question Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700/30 shadow-elegant"
                >
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                {question.titulo}
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                {question.enunciado}
                            </p>
                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {question.puntos} puntos
                            </div>
                        </div>

                        {/* Question Type Specific UI */}
                        <div className="space-y-4">
                            {question.tipo === 'multiple' && (
                                <div className="space-y-3">
                                    {question.config.opciones?.map((opcion, index) => (
                                        <motion.label
                                            key={index}
                                            whileHover={{ scale: 1.02 }}
                                            className="flex items-center space-x-3 p-4 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/30 cursor-pointer hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300"
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${question.nqid}`}
                                                value={index}
                                                checked={answers[question.nqid] === index}
                                                onChange={() => handleAnswer(question.nqid, index)}
                                                className="text-primary-500 focus:ring-primary-500"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">{opcion}</span>
                                        </motion.label>
                                    ))}
                                </div>
                            )}

                            {question.tipo === 'numerico' && (
                                <input
                                    type="number"
                                    step="0.1"
                                    value={answers[question.nqid] || ''}
                                    onChange={(e) => handleAnswer(question.nqid, parseFloat(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/30 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Ingresa tu respuesta numérica"
                                />
                            )}

                            {question.tipo === 'texto_corto' && (
                                <textarea
                                    value={answers[question.nqid] || ''}
                                    onChange={(e) => handleAnswer(question.nqid, e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/30 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Escribe tu respuesta..."
                                />
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Anterior</span>
                </motion.button>

                {currentQuestion === mockExercise.questions.length - 1 ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={submitExercise}
                        disabled={isSubmitting}
                        className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-300"
                    >
                        <Send className="h-4 w-4" />
                        <span>{isSubmitting ? 'Enviando...' : 'Enviar Ejercicio'}</span>
                    </motion.button>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextQuestion}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <span>Siguiente</span>
                        <ArrowRight className="h-4 w-4" />
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
};

export default TakeExercise;