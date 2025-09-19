// ============================================================================
// ROUTER PRINCIPAL - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/router.tsx
// Propósito: Configuración de rutas con React Router
// Compatible con nuevo componente ViewExercise

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Páginas Instructor
import Dashboard from './pages/instructor/Dashboard';
import CreateExercise from './pages/instructor/CreateExercise';
import ViewExercise from './pages/instructor/ViewExercise';

// Páginas Estudiante  
import ExerciseList from './pages/student/ExerciseList';
import TakeExercise from './pages/student/TakeExercise';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'instructor',
                children: [
                    {
                        path: 'dashboard',
                        element: <Dashboard />
                    },
                    {
                        path: 'create-exercise',
                        element: <CreateExercise />
                    },
                    {
                        path: 'exercise/:id',
                        element: <ViewExercise />
                    }
                ]
            },
            {
                path: 'student',
                children: [
                    {
                        path: 'exercises',
                        element: <ExerciseList />
                    },
                    {
                        path: 'exercise/:id',
                        element: <TakeExercise />
                    }
                ]
            }
        ]
    }
]);

const AppRouter: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;