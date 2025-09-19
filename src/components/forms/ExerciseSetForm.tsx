// ============================================================================
// FORMULARIO EXERCISE SET - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/components/forms/ExerciseSetForm.tsx
// Propósito: Formulario para crear/editar Exercise Sets
// Compatible con backend API y validaciones robustas

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
    Save,
    X,
    AlertCircle,
    Settings,
    BookOpen,
    Clock,
    RotateCcw,
    Eye,
    EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import {
    createExerciseSet,
    updateExerciseSet,
    validateExerciseSetForm,
    getDefaultExerciseConfig,
    transformFormDataToRequest,
    ExerciseSetFormData,
    EXERCISE_SET_CONSTANTS
} from '../../services/exerciseSetService';
import { ExerciseSetBase } from '../../types/shared';

// ============================================================================
// ESQUEMA DE VALIDACIÓN CON ZOD
// ============================================================================

const exerciseSetSchema = z.object({
    titulo: z
        .string()
        .min(EXERCISE_SET_CONSTANTS.MIN_TITLE_LENGTH, `Mínimo ${EXERCISE_SET_CONSTANTS.MIN_TITLE_LENGTH} caracteres`)
        .max(EXERCISE_SET_CONSTANTS.MAX_TITLE_LENGTH, `Máximo ${EXERCISE_SET_CONSTANTS.MAX_TITLE_LENGTH} caracteres`)
        .trim(),
    descripcion: z
        .string()
        .min(EXERCISE_SET_CONSTANTS.MIN_DESCRIPTION_LENGTH, `Mínimo ${EXERCISE_SET_CONSTANTS.MIN_DESCRIPTION_LENGTH} caracteres`)
        .max(EXERCISE_SET_CONSTANTS.MAX_DESCRIPTION_LENGTH, `Máximo ${EXERCISE_SET_CONSTANTS.MAX_DESCRIPTION_LENGTH} caracteres`)
        .trim(),
    instrucciones: z
        .string()
        .max(EXERCISE_SET_CONSTANTS.MAX_INSTRUCTIONS_LENGTH, `Máximo ${EXERCISE_SET_CONSTANTS.MAX_INSTRUCTIONS_LENGTH} caracteres`)
        .optional(),
    configuracion: z.object({
        intentos: z
            .number()
            .min(EXERCISE_SET_CONSTANTS.MIN_ATTEMPTS, `Mínimo ${EXERCISE_SET_CONSTANTS.MIN_ATTEMPTS} intento`)
            .max(EXERCISE_SET_CONSTANTS.MAX_ATTEMPTS, `Máximo ${EXERCISE_SET_CONSTANTS.MAX_ATTEMPTS} intentos`),
        tiempo: z
            .number()
            .min(1, 'Mínimo 1 minuto')
            .max(EXERCISE_SET_CONSTANTS.MAX_TIME_LIMIT, `Máximo ${EXERCISE_SET_CONSTANTS.MAX_TIME_LIMIT} minutos`)
            .optional(),
        mostrarRespuestas: z.boolean(),
        mostrarExplicaciones: z.boolean(),
        navegacionLibre: z.boolean(),
        autoguardado: z.boolean()
    }),
    cursoId: z.string().optional()
});

type ExerciseSetFormSchema = z.infer<typeof exerciseSetSchema>;

// ============================================================================
// PROPS DEL COMPONENTE
// ============================================================================

interface ExerciseSetFormProps {
    /** Exercise set a editar (opcional para modo creación) */
    readonly exerciseSet?: ExerciseSetBase;
    /** Función llamada al guardar exitosamente */
    readonly onSave?: (exerciseSet: ExerciseSetBase) => void;
    /** Función llamada al cancelar */
    readonly onCancel?: () => void;
    /** Modo del formulario */
    readonly mode?: 'create' | 'edit';
    /** ID del curso actual (opcional) */
    readonly cursoId?: string;
    /** Clase CSS adicional */
    readonly className?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const ExerciseSetForm: React.FC<ExerciseSetFormProps> = ({
    exerciseSet,
    onSave,
    onCancel,
    mode = 'create',
    cursoId,
    className = ''
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Configuración del formulario con React Hook Form + Zod
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        reset,
        watch,
        setValue
    } = useForm<ExerciseSetFormSchema>({
        resolver: zodResolver(exerciseSetSchema),
        defaultValues: {
            titulo: exerciseSet?.titulo || '',
            descripcion: exerciseSet?.descripcion || '',
            instrucciones: exerciseSet?.instrucciones || '',
            configuracion: exerciseSet?.configuracion || getDefaultExerciseConfig(),
            cursoId: exerciseSet?.cursoId || cursoId || ''
        },
        mode: 'onChange'
    });

    // Observar cambios en tiempo real para mostrar información
    const watchedTitulo = watch('titulo');
    const watchedDescripcion = watch('descripcion');

    // Reset form when exerciseSet changes
    useEffect(() => {
        if (exerciseSet) {
            reset({
                titulo: exerciseSet.titulo,
                descripcion: exerciseSet.descripcion,
                instrucciones: exerciseSet.instrucciones || '',
                configuracion: exerciseSet.configuracion,
                cursoId: exerciseSet.cursoId || cursoId || ''
            });
        }
    }, [exerciseSet, reset, cursoId]);

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const onSubmit = async (data: ExerciseSetFormSchema) => {
        try {
            setIsLoading(true);

            // Validación adicional del servicio
            const formData: ExerciseSetFormData = data;
            const validationErrors = validateExerciseSetForm(formData);

            if (validationErrors.length > 0) {
                toast.error(validationErrors[0]);
                return;
            }

            // Transformar datos y enviar al backend
            const requestData = transformFormDataToRequest(formData);

            let savedExerciseSet: ExerciseSetBase;

            if (mode === 'edit' && exerciseSet) {
                savedExerciseSet = await updateExerciseSet(exerciseSet.id, requestData);
                toast.success('Exercise set actualizado correctamente');
            } else {
                savedExerciseSet = await createExerciseSet(requestData);
                toast.success('Exercise set creado correctamente');
            }

            onSave?.(savedExerciseSet);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            toast.error(errorMessage);
            console.error('Error al guardar exercise set:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (isDirty) {
            if (window.confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.')) {
                onCancel?.();
            }
        } else {
            onCancel?.();
        }
    };

    const handleReset = () => {
        if (window.confirm('¿Estás seguro de que quieres restablecer el formulario?')) {
            reset();
            toast('Formulario restablecido');
        }
    };

    const loadDefaultConfig = () => {
        setValue('configuracion', getDefaultExerciseConfig());
        toast('Configuración restablecida a valores por defecto');
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`max-w-4xl mx-auto ${className}`}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Header */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <Card.Header>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {mode === 'edit' ? 'Editar Exercise Set' : 'Crear Exercise Set'}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {mode === 'edit'
                                        ? 'Modifica la información del exercise set'
                                        : 'Crea un nuevo exercise set con preguntas anidadas'
                                    }
                                </p>
                            </div>
                        </div>
                    </Card.Header>
                </Card>

                {/* Información Básica */}
                <Card>
                    <Card.Header>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Información Básica
                        </h3>
                    </Card.Header>
                    <Card.Content>
                        <div className="grid grid-cols-1 gap-6">

                            {/* Título */}
                            <div>
                                <Input
                                    label="Título del Exercise Set"
                                    placeholder="Ej: Ejercicios de Cálculo Diferencial"
                                    error={errors.titulo?.message}
                                    {...register('titulo')}
                                />
                                <div className="mt-1 text-sm text-gray-500">
                                    {watchedTitulo.length}/{EXERCISE_SET_CONSTANTS.MAX_TITLE_LENGTH} caracteres
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    {...register('descripcion')}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Describe el contenido y objetivos del exercise set..."
                                />
                                {errors.descripcion && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.descripcion.message}
                                    </p>
                                )}
                                <div className="mt-1 text-sm text-gray-500">
                                    {watchedDescripcion.length}/{EXERCISE_SET_CONSTANTS.MAX_DESCRIPTION_LENGTH} caracteres
                                </div>
                            </div>

                            {/* Instrucciones */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Instrucciones para Estudiantes (Opcional)
                                </label>
                                <textarea
                                    {...register('instrucciones')}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Instrucciones específicas para resolver este exercise set..."
                                />
                                {errors.instrucciones && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.instrucciones.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                {/* Configuración */}
                <Card>
                    <Card.Header>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Settings className="h-5 w-5 text-gray-600" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Configuración
                                </h3>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                            >
                                {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                {showAdvanced ? 'Ocultar' : 'Mostrar'} Avanzado
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Content>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Intentos */}
                            <div>
                                <Input
                                    type="number"
                                    label="Intentos Permitidos"
                                    min={EXERCISE_SET_CONSTANTS.MIN_ATTEMPTS}
                                    max={EXERCISE_SET_CONSTANTS.MAX_ATTEMPTS}
                                    error={errors.configuracion?.intentos?.message}
                                    {...register('configuracion.intentos', { valueAsNumber: true })}
                                />
                            </div>

                            {/* Tiempo límite */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Clock className="h-4 w-4 inline mr-1" />
                                    Tiempo Límite (minutos, opcional)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={EXERCISE_SET_CONSTANTS.MAX_TIME_LIMIT}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Sin límite"
                                    {...register('configuracion.tiempo', { valueAsNumber: true })}
                                />
                                {errors.configuracion?.tiempo && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.configuracion.tiempo.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Opciones avanzadas */}
                        {showAdvanced && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                            >
                                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                                    Opciones Avanzadas
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                            {...register('configuracion.mostrarRespuestas')}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Mostrar respuestas correctas
                                        </span>
                                    </label>

                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                            {...register('configuracion.mostrarExplicaciones')}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Mostrar explicaciones
                                        </span>
                                    </label>

                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                            {...register('configuracion.navegacionLibre')}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Navegación libre entre preguntas
                                        </span>
                                    </label>

                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                            {...register('configuracion.autoguardado')}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Autoguardado de progreso
                                        </span>
                                    </label>
                                </div>

                                <div className="mt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={loadDefaultConfig}
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Configuración por Defecto
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </Card.Content>
                </Card>

                {/* Botones de acción */}
                <Card>
                    <Card.Content>
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancelar
                                </Button>

                                {isDirty && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleReset}
                                        disabled={isLoading}
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Restablecer
                                    </Button>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={!isValid || isLoading}
                                loading={isLoading}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {mode === 'edit' ? 'Actualizar' : 'Crear'} Exercise Set
                            </Button>
                        </div>
                    </Card.Content>
                </Card>

                {/* Estado del formulario (solo en desarrollo) */}
                {process.env.NODE_ENV === 'development' && (
                    <Card className="bg-gray-50 dark:bg-gray-800">
                        <Card.Content>
                            <details>
                                <summary className="text-sm font-medium text-gray-600 cursor-pointer">
                                    Debug: Estado del formulario
                                </summary>
                                <pre className="mt-2 text-xs text-gray-500 overflow-auto">
                                    {JSON.stringify({
                                        isValid,
                                        isDirty,
                                        errors: Object.keys(errors),
                                        values: watch()
                                    }, null, 2)}
                                </pre>
                            </details>
                        </Card.Content>
                    </Card>
                )}
            </form>
        </motion.div>
    );
};

export default ExerciseSetForm;