// ============================================================================
// VIEW EXERCISE - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/pages/instructor/ViewExercise.tsx
// Propósito: Vista minimalista de Exercise Set con LaTeX

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Edit, Plus, Play, Pause, Eye, EyeOff,
    BookOpen, Clock, TrendingUp, FileText, RefreshCw, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LaTeX from '../../components/ui/LaTeX';
import { getExerciseSetById, togglePublishExerciseSet } from '../../services/exerciseSetService';
import { ExerciseSetBase } from '../../types/shared';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const ViewExercise: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Estados
    const [exerciseSet, setExerciseSet] = useState<ExerciseSetBase | null>(null);
    const [loading, setLoading] = useState(true);
    const [showLatexSource, setShowLatexSource] = useState(false);
    const [operating, setOperating] = useState(false);

    // ============================================================================
    // EFECTOS Y DATOS
    // ============================================================================

    useEffect(() => {
        if (id) loadExerciseSet(id);
    }, [id]);

    const loadExerciseSet = async (exerciseId: string) => {
        try {
            setLoading(true);
            const response = await getExerciseSetById(exerciseId);
            if (response) {
                setExerciseSet(response);
            } else {
                throw new Error('Exercise set no encontrado');
            }
        } catch (err: any) {
            toast.error('Error al cargar exercise set');
            navigate('/instructor/dashboard');
        } finally {
            setLoading(false);
        }
    };

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const handleGoBack = () => navigate('/instructor/dashboard');
    const handleEdit = () => navigate(`/instructor/exercise/${exerciseSet?.id}/edit`);
    const handleAddQuestions = () => navigate(`/instructor/exercise/${exerciseSet?.id}/questions`);

    const handleTogglePublish = async () => {
        if (!exerciseSet) return;

        const newState = !exerciseSet.publicado;
        if (!window.confirm(`¿${newState ? 'Publicar' : 'Despublicar'} "${exerciseSet.titulo}"?`)) return;

        try {
            setOperating(true);
            await togglePublishExerciseSet(exerciseSet.id, newState);
            setExerciseSet(prev => prev ? { ...prev, publicado: newState, estado: newState ? 'published' : 'draft' } : null);
            toast.success(`Exercise ${newState ? 'publicado' : 'despublicado'}`);
        } catch {
            toast.error('Error al actualizar exercise');
        } finally {
            setOperating(false);
        }
    };

    // ============================================================================
    // RENDER HELPERS
    // ============================================================================

    const renderLatex = (content: string) => showLatexSource ? (
        <code className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{content}</code>
    ) : (
        <LaTeX>{content}</LaTeX>
    );

    const getStatusBadge = (estado: string, publicado: boolean) => {
        const isPublished = estado === 'published' && publicado;
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                {isPublished ? 'Publicado' : 'Borrador'}
            </span>
        );
    };

    // ============================================================================
    // RENDER PRINCIPAL
    // ============================================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Cargando exercise...</p>
                </div>
            </div>
        );
    }

    if (!exerciseSet) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center py-12">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-4">Exercise no encontrado</h2>
                    <Button onClick={handleGoBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <div className="mb-6">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Dashboard
                    </button>
                </div>

                {/* Header */}
                <Card className="mb-6">
                    <Card.Content>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <BookOpen className="h-6 w-6 text-blue-500" />
                                    <h1 className="text-2xl font-bold">
                                        {renderLatex(exerciseSet.titulo)}
                                    </h1>
                                    {getStatusBadge(exerciseSet.estado, exerciseSet.publicado)}
                                </div>

                                {exerciseSet.descripcion && (
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {renderLatex(exerciseSet.descripcion)}
                                    </p>
                                )}

                                {exerciseSet.instrucciones && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200">
                                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                                            Instrucciones
                                        </h4>
                                        <div className="text-blue-700 dark:text-blue-300">
                                            {renderLatex(exerciseSet.instrucciones)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowLatexSource(!showLatexSource)}
                                title={showLatexSource ? "Ocultar código" : "Mostrar código"}
                            >
                                {showLatexSource ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </Card.Content>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <Card.Content>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Preguntas</p>
                                    <p className="text-lg font-semibold">{exerciseSet.preguntas.length}</p>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Card.Content>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Clock className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tiempo</p>
                                    <p className="text-lg font-semibold">
                                        {exerciseSet.configuracion.tiempo ? `${exerciseSet.configuracion.tiempo}m` : 'Sin límite'}
                                    </p>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Card.Content>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Intentos</p>
                                    <p className="text-lg font-semibold">{exerciseSet.configuracion.intentos}</p>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>
                </div>

                {/* Actions */}
                <Card className="mb-6">
                    <Card.Content>
                        <div className="flex items-center gap-2">
                            <Button onClick={handleEdit}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                            <Button variant="outline" onClick={handleAddQuestions}>
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Preguntas
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleTogglePublish}
                                disabled={operating}
                                className={exerciseSet.publicado ? 'text-orange-600' : 'text-green-600'}
                            >
                                {exerciseSet.publicado ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                {exerciseSet.publicado ? 'Despublicar' : 'Publicar'}
                            </Button>
                        </div>
                    </Card.Content>
                </Card>

                {/* Questions */}
                <Card>
                    <Card.Header>
                        <h3 className="text-lg font-semibold">
                            Preguntas ({exerciseSet.preguntas.length})
                        </h3>
                    </Card.Header>
                    <Card.Content>
                        {exerciseSet.preguntas.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">No hay preguntas aún</p>
                                <Button onClick={handleAddQuestions}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Primera Pregunta
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {exerciseSet.preguntas.map((pregunta, index) => (
                                    <div key={pregunta.id || index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </span>
                                            <h4 className="font-medium">Pregunta {index + 1}</h4>
                                        </div>

                                        {pregunta.enunciado && (
                                            <div className="mb-3">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Enunciado:</p>
                                                <div className="p-3 bg-white dark:bg-gray-700 rounded border">
                                                    {renderLatex(pregunta.enunciado)}
                                                </div>
                                            </div>
                                        )}

                                        {pregunta.respuestaCorrecta && (
                                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200">
                                                <p className="text-sm font-medium text-green-800 mb-2">Respuesta:</p>
                                                {renderLatex(pregunta.respuestaCorrecta)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card.Content>
                </Card>

            </div>
        </div>
    );
};

export default ViewExercise;