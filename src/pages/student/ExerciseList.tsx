import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Play,
    CheckCircle,
    Clock,
    Trophy,
    BookOpen,
    Target
} from 'lucide-react';

// Mock data
const mockExercises = [
    {
        esid: '1',
        titulo: 'Álgebra Lineal - Vectores',
        descripcion: 'Ejercicios sobre operaciones básicas con vectores.',
        totalPreguntas: 8,
        completado: false,
        puntaje: null,
        fechaVencimiento: '2024-02-15',
    },
    {
        esid: '2',
        titulo: 'Cálculo Diferencial',
        descripcion: 'Límites, derivadas y aplicaciones del cálculo.',
        totalPreguntas: 12,
        completado: true,
        puntaje: 87,
        fechaVencimiento: '2024-02-20',
    },
    {
        esid: '3',
        titulo: 'Probabilidades Básicas',
        descripcion: 'Conceptos fundamentales de probabilidad.',
        totalPreguntas: 6,
        completado: false,
        puntaje: null,
        fechaVencimiento: '2024-02-25',
    },
];

const ExerciseList: React.FC = () => {
    const completedCount = mockExercises.filter(ex => ex.completado).length;
    const averageScore = mockExercises
        .filter(ex => ex.puntaje)
        .reduce((sum, ex) => sum + ex.puntaje!, 0) / mockExercises.filter(ex => ex.puntaje).length || 0;

    return (
        <div className="space-y-8">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent">
                    Mis Ejercicios
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Completa los ejercicios asignados y mejora tu conocimiento.
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 shadow-elegant"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Completados</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {completedCount}/{mockExercises.length}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                            <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 shadow-elegant"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Promedio</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {averageScore ? `${Math.round(averageScore)}%` : '--'}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600">
                            <Trophy className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 shadow-elegant"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {mockExercises.length - completedCount}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Exercises List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Lista de Ejercicios
                </h2>

                <div className="space-y-4">
                    {mockExercises.map((exercise, index) => {
                        const Icon = exercise.completado ? CheckCircle : Play;
                        const statusColor = exercise.completado
                            ? 'from-green-500 to-green-600'
                            : 'from-primary-500 to-accent-500';

                        return (
                            <motion.div
                                key={exercise.esid}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ y: -2 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 shadow-elegant">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    {exercise.titulo}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${exercise.completado
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>
                                                    {exercise.completado ? 'Completado' : 'Pendiente'}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                {exercise.descripcion}
                                            </p>

                                            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center space-x-2">
                                                    <BookOpen className="h-4 w-4" />
                                                    <span>{exercise.totalPreguntas} preguntas</span>
                                                </div>

                                                {exercise.completado && exercise.puntaje && (
                                                    <div className="flex items-center space-x-2">
                                                        <Trophy className="h-4 w-4" />
                                                        <span>{exercise.puntaje}% obtenido</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Vence {new Date(exercise.fechaVencimiento).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="ml-6">
                                            <Link to={`/student/exercise/${exercise.esid}`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 bg-gradient-to-r ${statusColor}`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                    <span>
                                                        {exercise.completado ? 'Ver Resultado' : 'Comenzar'}
                                                    </span>
                                                </motion.button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default ExerciseList;