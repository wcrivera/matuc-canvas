import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRouter from './router';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <div className="min-h-screen">
                <AppRouter />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        },
                    }}
                />
            </div>
        </ThemeProvider>
    );
};

export default App;