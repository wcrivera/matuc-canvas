// ============================================================================
// EXERCISE CARD COMPONENT - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/components/exercise/ExerciseCard.tsx
// Propósito: Componente reutilizable para mostrar Exercise Sets
// Compatible con diferentes contextos (dashboard, listado, vista estudiante)

import React from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Users,
    Play,
    Pause,
    Edit,
    Eye,
    Trash2,
    BookOpen,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Archive,
    Copy,
    Share2
} from 'lucide-react';

import Button from '../ui/Button';
import Card from '../ui/Card';
import { ExerciseSetBase } from '../../types/shared';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface ExerciseCardProps {
    /** Exercise set a mostrar */
    readonly exerciseSet: ExerciseSetBase;
    /** Variante del card según el contexto */
    readonly variant?: 'default' | 'compact' | 'student' | 'preview';
    /** Si se muestran las acciones de instructor */
    readonly showActions?: boolean;
    /** Si se muestra información detallada */
    readonly showDetails?: boolean;
    /** Si está en estado de carga/operación */
    readonly loading?: boolean;
    /** Handlers de acciones */
    readonly onView?: (exerciseSet: ExerciseSetBase) => void;
    readonly onEdit?: (exerciseSet: ExerciseSetBase) => void;
    readonly onDelete?: (exerciseSet: ExerciseSetBase) => void;
    readonly onTogglePublish?: (exerciseSet: ExerciseSetBase) => void;
    readonly onDuplicate?: (exerciseSet: ExerciseSetBase) => void;
    readonly onShare?: (exerciseSet: ExerciseSetBase) => void;
    readonly onStart?: (exerciseSet: ExerciseSetBase) => void; // Para estudiantes
    /** Clase CSS adicional */
    readonly className?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

const getStatusConfig = (estado: string, publicado: boolean) => {
    if (estado === 'published' && publicado) {
        return {
            label: 'Publicado',
            className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
            icon: CheckCircle
        };
    }

    if (estado === 'draft') {
        return {
            label: 'Borrador',
            className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
            icon: Edit
        };
    }

    if (estado === 'archived') {
        return {
            label: 'Archivado',
            className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200',
            icon: Archive
        };
    }

    return {
        label: 'Sin publicar',
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
        icon: AlertCircle
    };
};

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (minutes?: number) => {
    if (!minutes) return 'Sin límite';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const ExerciseCard: React.FC<ExerciseCardProps> = ({
    exerciseSet,
    variant = 'default',
    showActions = true,
    showDetails = true,
    loading = false,
    onView,
    onEdit,
    onDelete,
    onTogglePublish,
    onDuplicate,
    onShare,
    onStart,
    className = ''
}) => {
    const statusConfig = getStatusConfig(exerciseSet.estado, exerciseSet.publicado);
    const StatusIcon = statusConfig.icon;

    // ============================================================================
    // RENDER COMPONENTS
    // ============================================================================

    const renderHeader = () => (
        <Card.Header>
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <h3 className={`font-semibold text-gray-900 dark:text-white truncate ${variant === 'compact' ? 'text-base' : 'text-lg'
                            }`}>
                            {exerciseSet.titulo}
                        </h3>
                    </div>

                    {variant !== 'compact' && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                            {exerciseSet.descripcion}
                        </p>
                    )}

                    {exerciseSet.instrucciones && variant === 'preview' && (
                        <p className="text-gray-500 dark:text-gray-500 text-xs line-clamp-1 italic">
                            "{exerciseSet.instrucciones}"
                        </p>
                    )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                    </span>
                </div>
            </div>
        </Card.Header>
    );

    const renderDetails = () => {
        if (!showDetails) return null;

        return (
            <Card.Content>
                <div className="space-y-3">
                    {/* Main Stats */}
                    <div className={`grid gap-4 text-sm ${variant === 'compact' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'
                        }`}>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{formatDate(exerciseSet.fechaCreacion)}</span>
                        </div>

                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{exerciseSet.preguntas.length} pregunta{exerciseSet.preguntas.length !== 1 ? 's' : ''}</span>
                        </div>

                        {variant !== 'compact' && (
                            <>
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span>{exerciseSet.configuracion.intentos} intento{exerciseSet.configuracion.intentos !== 1 ? 's' : ''}</span>
                                </div>

                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span>{formatTime(exerciseSet.configuracion.tiempo)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Configuration Badges */}
                    {variant === 'preview' && (
                        <div className="flex flex-wrap gap-1">
                            {exerciseSet.configuracion.mostrarRespuestas && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                    Respuestas visibles
                                </span>
                            )}
                            {exerciseSet.configuracion.navegacionLibre && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                                    Navegación libre
                                </span>
                            )}
                            {exerciseSet.configuracion.autoguardado && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                                    Autoguardado
                                </span>
                            )}
                        </div>
                    )}

                    {/* Updated Date */}
                    {variant !== 'compact' && exerciseSet.fechaActualizacion !== exerciseSet.fechaCreacion && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                            Actualizado: {formatDate(exerciseSet.fechaActualizacion)}
                        </div>
                    )}
                </div>
            </Card.Content>
        );
    };

    const renderStudentActions = () => (
        <Card.Footer>
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {exerciseSet.preguntas.length} preguntas • {exerciseSet.configuracion.intentos} intentos
                </div>

                <Button
                    onClick={() => onStart?.(exerciseSet)}
                    disabled={loading || exerciseSet.estado !== 'published'}
                    className="flex items-center"
                >
                    <Play className="h-4 w-4 mr-2" />
                    {exerciseSet.estado === 'published' ? 'Comenzar' : 'No disponible'}
                </Button>
            </div>
        </Card.Footer>
    );

    const renderInstructorActions = () => (
        <Card.Footer>
            <div className="flex items-center justify-between">
                {/* Primary Actions */}
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView?.(exerciseSet)}
                        disabled={loading}
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(exerciseSet)}
                        disabled={loading}
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                    </Button>

                    {variant !== 'compact' && onDuplicate && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDuplicate(exerciseSet)}
                            disabled={loading}
                        >
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicar
                        </Button>
                    )}
                </div>

                {/* Secondary Actions */}
                <div className="flex items-center space-x-2">
                    {onShare && variant !== 'compact' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onShare(exerciseSet)}
                            disabled={loading}
                        >
                            <Share2 className="h-4 w-4 mr-1" />
                            Compartir
                        </Button>
                    )}

                    {onTogglePublish && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onTogglePublish(exerciseSet)}
                            disabled={loading}
                            className={exerciseSet.publicado ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                        >
                            {exerciseSet.publicado ? (
                                <>
                                    <Pause className="h-4 w-4 mr-1" />
                                    Despublicar
                                </>
                            ) : (
                                <>
                                    <Play className="h-4 w-4 mr-1" />
                                    Publicar
                                </>
                            )}
                        </Button>
                    )}

                    {onDelete && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(exerciseSet)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {variant === 'compact' ? '' : 'Eliminar'}
                        </Button>
                    )}
                </div>
            </div>
        </Card.Footer>
    );

    // ============================================================================
    // RENDER PRINCIPAL
    // ============================================================================

    const cardVariantClasses = {
        default: 'hover:shadow-lg transition-shadow',
        compact: 'hover:shadow-md transition-shadow',
        student: 'hover:shadow-lg transition-shadow border-l-4 border-l-blue-500',
        preview: 'hover:shadow-xl transition-all duration-300 hover:scale-[1.02]'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={className}
        >
            <Card
                className={`${cardVariantClasses[variant]} ${loading ? 'opacity-50' : ''}`}
                variant={variant === 'preview' ? 'elevated' : 'default'}
            >
                {renderHeader()}
                {renderDetails()}

                {showActions && (
                    variant === 'student' ? renderStudentActions() : renderInstructorActions()
                )}

                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center rounded-xl">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Procesando...</span>
                        </div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};

export default ExerciseCard;