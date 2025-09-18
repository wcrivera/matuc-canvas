import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock,
  Edit3,
  Trash2,
  Play,
  BarChart3,
  Calendar,
  Award
} from 'lucide-react';

// Mock data - en producción vendrá del backend
const mockExercises = [
  {
    esid: '1',
    titulo: 'Álgebra Lineal - Vectores',
    descripcion: 'Ejercicios sobre operaciones básicas con vectores y espacios vectoriales.',
    preguntas: 8,
    completados: 24,
    totalEstudiantes: 30,
    fechaCreacion: '2024-01-15',
    estado: 'publicado' as const,
  },
  {
    esid: '2',
    titulo: 'Cálculo Diferencial',
    descripcion: 'Límites, derivadas y aplicaciones del cálculo diferencial.',
    preguntas: 12,
    completados: 18,
    totalEstudiantes: 30,
    fechaCreacion: '2024-01-20',
    estado: 'publicado' as const,
  },
  {
    esid: '3',
    titulo: 'Probabilidades',
    descripcion: 'Conceptos básicos de probabilidad y distribuciones.',
    preguntas: 6,
    completados: 0,
    totalEstudiantes: 30,
    fechaCreacion: '2024-01-25',
    estado: 'borrador' as const,
  },
];

const stats = [
  {
    title: 'Ejercicios Creados',
    value: '12',
    change: '+2',
    changeType: 'increase' as const,
    icon: BookOpen,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Estudiantes Activos',
    value: '156',
    change: '+12',
    changeType: 'increase' as const,
    icon: Users,
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Promedio Completación',
    value: '87%',
    change: '+5%',
    changeType: 'increase' as const,
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Tiempo Promedio',
    value: '24min',
    change: '-3min',
    changeType: 'decrease' as const,
    icon: Clock,
    color: 'from-orange-500 to-orange-600',
  },
];

const InstructorDashboard: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent">
          Dashboard del Instructor
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Gestiona tus ejercicios, monitorea el progreso de los estudiantes y crea nuevas evaluaciones.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 shadow-elegant">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        vs mes anterior
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
        <Link to="/instructor/create">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-primary-500/25 transition-all duration-300"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Crear Nuevo Ejercicio</span>
          </motion.button>
        </Link>
        
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl font-semibold shadow-elegant hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
        >
          <BarChart3 className="h-5 w-5" />
          <span>Ver Estadísticas</span>
        </motion.button>
      </motion.div>

      {/* Exercises List */}
      <motion.div variants={itemVariants} className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Mis Ejercicios
        </h2>
        
        <div className="grid gap-6">
          {mockExercises.map((exercise, index) => (
            <motion.div
              key={exercise.esid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ y: -2 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 shadow-elegant">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {exercise.titulo}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        exercise.estado === 'publicado' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {exercise.estado === 'publicado' ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                      {exercise.descripcion}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{exercise.preguntas} preguntas</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{exercise.completados}/{exercise.totalEstudiantes} completado</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Creado {new Date(exercise.fechaCreacion).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span>{Math.round((exercise.completados / exercise.totalEstudiantes) * 100)}% completación</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-lg transition-colors duration-200"
                      title="Ver resultados"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </motion.button>
                    
                    <Link to={`/instructor/edit/${exercise.esid}`}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-lg transition-colors duration-200"
                        title="Editar ejercicio"
                      >
                        <Edit3 className="h-4 w-4" />
                      </motion.button>
                    </Link>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg transition-colors duration-200"
                      title="Eliminar ejercicio"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InstructorDashboard;