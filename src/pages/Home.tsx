import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  Zap, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 py-16"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent">
            Exercise Composer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Crea ejercicios interactivos con preguntas anidadas. 
            Integración perfecta con Canvas LTI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/instructor">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <GraduationCap className="h-5 w-5" />
              <span>Soy Instructor</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>

          <Link to="/student">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl font-semibold shadow-elegant hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
            >
              <Users className="h-5 w-5" />
              <span>Soy Estudiante</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="grid md:grid-cols-3 gap-8"
      >
        <motion.div
          whileHover={{ y: -8 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700/30 shadow-elegant">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Ejercicios Interactivos
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Crea ejercicios con múltiples tipos de preguntas anidadas de forma simple e intuitiva.
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -8 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700/30 shadow-elegant">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Integración LTI
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Conecta perfectamente con Canvas y otros LMS usando estándares LTI 1.3.
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -8 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700/30 shadow-elegant">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Gestión Simple
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Administra ejercicios, estudiantes y resultados desde una interfaz limpia y moderna.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl p-12 border border-white/20 dark:border-gray-700/30"
      >
        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
          ¿Listo para comenzar?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
          Únete a los instructores que ya están usando MATUC LTI para crear ejercicios increíbles.
        </p>
        <Link to="/instructor/create">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Crear Mi Primer Ejercicio
          </motion.button>
        </Link>
      </motion.section>
    </div>
  );
};

export default Home;