import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import InstructorDashboard from './pages/instructor/Dashboard';
import CreateExercise from './pages/instructor/CreateExercise';
import StudentDashboard from './pages/student/ExerciseList';
import TakeExercise from './pages/student/TakeExercise';
import NotFound from './pages/NotFound';

// Providers
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-300">
                    {/* Background Pattern */}
                    {/* <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div> */}

                    <Layout>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative z-10"
                        >
                            <Routes>
                                {/* Página principal */}
                                <Route path="/" element={<Home />} />

                                {/* Rutas del instructor */}
                                <Route path="/instructor" element={<InstructorDashboard />} />
                                <Route path="/instructor/create" element={<CreateExercise />} />
                                <Route path="/instructor/edit/:esid" element={<CreateExercise />} />

                                {/* Rutas del estudiante */}
                                <Route path="/student" element={<StudentDashboard />} />
                                <Route path="/student/exercise/:esid" element={<TakeExercise />} />

                                {/* 404 */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </motion.div>
                    </Layout>

                    {/* Toaster para notificaciones modernas */}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                                color: '#1f2937',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#ffffff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#ffffff',
                                },
                            },
                        }}
                    />
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;