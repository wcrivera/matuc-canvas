import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-8 max-w-md mx-auto"
            >
                {/* 404 Number */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    <div className="text-8xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent">
                        404
                    </div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-full opacity-20"
                    />
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Página no encontrada
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        La página que buscas no existe o ha sido movida.
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link to="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Home className="h-4 w-4" />
                            <span>Ir al Inicio</span>
                        </motion.button>
                    </Link>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.history.back()}
                        className="flex items-center space-x-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Volver</span>
                    </motion.button>
                </motion.div>

                {/* Floating Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400 rounded-full opacity-30"
                    />
                    <motion.div
                        animate={{ y: [10, -10, 10] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute top-1/3 right-1/4 w-3 h-3 bg-accent-400 rounded-full opacity-20"
                    />
                    <motion.div
                        animate={{ y: [-5, 15, -5] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full opacity-25"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;