// ============================================================================
// SERVICIOS QUESTIONS - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/services/questionService.ts
// Propósito: Servicios CRUD para preguntas anidadas usando API backend
// Compatible con tipos compartidos y controladores backend

import {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
    apiPatch,
    getErrorMessage
} from '../../services/api';
import {
    QuestionBase,
    CreateQuestionRequest,
    PaginatedResponse,
    PaginationParams,
    QuestionType
} from '../../types/shared';

/**
 * Servicio para obtener todas las preguntas de un exercise set
 */
export const getQuestionsByExerciseSet = async (
    exerciseSetId: string,
    params?: Partial<PaginationParams>
): Promise<PaginatedResponse<QuestionBase>> => {
    try {
        if (!exerciseSetId || exerciseSetId.trim().length === 0) {
            throw new Error('ID de exercise set es requerido');
        }

        const queryParams = new URLSearchParams();

        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        const url = `/exercise-sets/${exerciseSetId}/questions${queryParams.toString() ? `?${queryParams}` : ''}`;
        const response = await apiGet<PaginatedResponse<QuestionBase>>(url);

        if (response.ok && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Error al obtener preguntas');
    } catch (error) {
        console.error('❌ Error in getQuestionsByExerciseSet:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Servicio para obtener una pregunta específica por ID
 */
export const getQuestionById = async (id: string): Promise<QuestionBase> => {
    try {
        if (!id || id.trim().length === 0) {
            throw new Error('ID de pregunta es requerido');
        }

        const response = await apiGet<QuestionBase>(`/questions/${id}`);

        if (response.ok && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Pregunta no encontrada');
    } catch (error) {
        console.error('❌ Error in getQuestionById:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Servicio para crear una nueva pregunta en un exercise set
 */
export const createQuestion = async (
    exerciseSetId: string,
    questionData: CreateQuestionRequest
): Promise<QuestionBase> => {
    try {
        if (!exerciseSetId || exerciseSetId.trim().length === 0) {
            throw new Error('ID de exercise set es requerido');
        }

        // Validación básica en frontend
        const validationErrors = validateQuestionForm({
            titulo: questionData.titulo,
            enunciado: questionData.enunciado,
            tipo: questionData.tipo,
            respuestaCorrecta: questionData.respuestaCorrecta,
            feedback: questionData.feedback,
            puntos: questionData.puntos,
            orden: questionData.orden,
            config: questionData.config,
            dificultad: questionData.dificultad,
            tiempoEstimado: questionData.tiempoEstimado,
            tags: questionData.tags
        });

        if (validationErrors.length > 0) {
            throw new Error(validationErrors[0]);
        }

        const response = await apiPost<QuestionBase>(`/exercise-sets/${exerciseSetId}/questions`, questionData);

        if (response.ok && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Error al crear pregunta');
    } catch (error) {
        console.error('❌ Error in createQuestion:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Servicio para actualizar una pregunta existente
 */
export const updateQuestion = async (
    id: string,
    questionData: Partial<CreateQuestionRequest>
): Promise<QuestionBase> => {
    try {
        if (!id || id.trim().length === 0) {
            throw new Error('ID de pregunta es requerido');
        }

        const response = await apiPut<QuestionBase>(`/questions/${id}`, questionData);

        if (response.ok && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Error al actualizar pregunta');
    } catch (error) {
        console.error('❌ Error in updateQuestion:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Servicio para eliminar una pregunta (soft delete)
 */
export const deleteQuestion = async (id: string): Promise<void> => {
    try {
        if (!id || id.trim().length === 0) {
            throw new Error('ID de pregunta es requerido');
        }

        const response = await apiDelete(`/questions/${id}`);

        if (!response.ok) {
            throw new Error(response.message || 'Error al eliminar pregunta');
        }
    } catch (error) {
        console.error('❌ Error in deleteQuestion:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Servicio para reordenar preguntas en un exercise set
 */
export const reorderQuestions = async (
    exerciseSetId: string,
    questionIds: string[]
): Promise<void> => {
    try {
        if (!exerciseSetId || exerciseSetId.trim().length === 0) {
            throw new Error('ID de exercise set es requerido');
        }

        if (!questionIds || questionIds.length === 0) {
            throw new Error('Lista de IDs de preguntas es requerida');
        }

        const response = await apiPatch(`/exercise-sets/${exerciseSetId}/questions/reorder`, { questionIds });

        if (!response.ok) {
            throw new Error(response.message || 'Error al reordenar preguntas');
        }
    } catch (error) {
        console.error('❌ Error in reorderQuestions:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Tipos auxiliares para el frontend
 */
export interface QuestionFormData {
    titulo: string;
    enunciado: string;
    tipo: QuestionType;
    orden: number;
    config: {
        opciones?: string[];
        correctas?: number[];
        tolerancia?: number;
        caseSensitive?: boolean;
        respuestasAceptadas?: string[];
    };
    respuestaCorrecta: any;
    feedback: {
        correcto: string;
        incorrecto: string;
        explicacion?: string;
        pista?: string;
    };
    puntos: number;
    dificultad: 'facil' | 'medio' | 'dificil';
    tiempoEstimado: number;
    tags: string[];
}

/**
 * Función helper para transformar datos del formulario a CreateQuestionRequest
 */
export const transformQuestionFormToRequest = (
    formData: QuestionFormData
): CreateQuestionRequest => {
    return {
        exerciseSetId: '', // Se setea externamente
        titulo: formData.titulo.trim(),
        enunciado: formData.enunciado.trim(),
        tipo: formData.tipo,
        orden: formData.orden,
        config: formData.config,
        respuestaCorrecta: formData.respuestaCorrecta,
        feedback: {
            correcto: formData.feedback.correcto.trim(),
            incorrecto: formData.feedback.incorrecto.trim(),
            explicacion: formData.feedback.explicacion?.trim(),
            pista: formData.feedback.pista?.trim()
        },
        puntos: formData.puntos,
        dificultad: formData.dificultad,
        tiempoEstimado: formData.tiempoEstimado,
        tags: formData.tags.map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
};

/**
 * Función helper para obtener configuración por defecto según tipo de pregunta
 */
export const getDefaultQuestionConfig = (tipo: QuestionType) => {
    switch (tipo) {
        case 'multiple':
            return {
                opciones: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
                correctas: [0]
            };
        case 'verdadero_falso':
            return {
                opciones: ['Verdadero', 'Falso'],
                correctas: [0]
            };
        case 'numerico':
        case 'numero': // Compatibilidad con tipos existentes
            return {
                tolerancia: 0.01,
                respuestasAceptadas: []
            };
        case 'texto_corto':
            return {
                caseSensitive: false,
                respuestasAceptadas: []
            };
        case 'matematica':
        case 'formula':
        case 'ecuacion':
        case 'antiderivada':
            return {
                caseSensitive: false,
                respuestasAceptadas: []
            };
        case 'conjunto':
        case 'punto':
            return {
                respuestasAceptadas: []
            };
        default:
            return {};
    }
};

/**
 * Función helper para obtener respuesta correcta por defecto según tipo
 */
export const getDefaultCorrectAnswer = (tipo: QuestionType) => {
    switch (tipo) {
        case 'multiple':
        case 'verdadero_falso':
            return 0; // Índice de la primera opción
        case 'numerico':
        case 'numero':
            return 0;
        case 'texto_corto':
        case 'matematica':
        case 'formula':
        case 'ecuacion':
        case 'antiderivada':
        case 'conjunto':
        case 'punto':
            return '';
        default:
            return '';
    }
};

/**
 * Función helper para validar datos del formulario de pregunta
 */
export const validateQuestionForm = (formData: QuestionFormData): string[] => {
    const errors: string[] = [];

    // Validación título
    if (!formData.titulo || formData.titulo.trim().length === 0) {
        errors.push('El título es obligatorio');
    } else if (formData.titulo.trim().length < 3) {
        errors.push('El título debe tener al menos 3 caracteres');
    } else if (formData.titulo.trim().length > 200) {
        errors.push('El título no puede exceder 200 caracteres');
    }

    // Validación enunciado
    if (!formData.enunciado || formData.enunciado.trim().length === 0) {
        errors.push('El enunciado es obligatorio');
    } else if (formData.enunciado.trim().length < 5) {
        errors.push('El enunciado debe tener al menos 5 caracteres');
    } else if (formData.enunciado.trim().length > 2000) {
        errors.push('El enunciado no puede exceder 2000 caracteres');
    }

    // Validación tipo
    if (!formData.tipo) {
        errors.push('El tipo de pregunta es obligatorio');
    }

    // Validación respuesta correcta
    if (formData.respuestaCorrecta === undefined || formData.respuestaCorrecta === null) {
        errors.push('La respuesta correcta es obligatoria');
    }

    // Validación feedback
    if (!formData.feedback.correcto || formData.feedback.correcto.trim().length === 0) {
        errors.push('El feedback para respuesta correcta es obligatorio');
    }

    if (!formData.feedback.incorrecto || formData.feedback.incorrecto.trim().length === 0) {
        errors.push('El feedback para respuesta incorrecta es obligatorio');
    }

    // Validación puntos
    if (formData.puntos < 1) {
        errors.push('Los puntos deben ser mayor a 0');
    } else if (formData.puntos > 100) {
        errors.push('Los puntos no pueden exceder 100');
    }

    // Validación tiempo estimado
    if (formData.tiempoEstimado < 1) {
        errors.push('El tiempo estimado debe ser mayor a 0 minutos');
    } else if (formData.tiempoEstimado > 60) {
        errors.push('El tiempo estimado no puede exceder 60 minutos');
    }

    // Validación específica por tipo
    switch (formData.tipo) {
        case 'multiple':
        case 'verdadero_falso':
            if (!formData.config.opciones || formData.config.opciones.length < 2) {
                errors.push('Debe haber al menos 2 opciones');
            }
            if (!formData.config.correctas || formData.config.correctas.length === 0) {
                errors.push('Debe seleccionar al menos una opción correcta');
            }
            break;

        case 'numerico':
        case 'numero':
            if (typeof formData.respuestaCorrecta !== 'number') {
                errors.push('La respuesta correcta debe ser un número');
            }
            if (formData.config.tolerancia && formData.config.tolerancia < 0) {
                errors.push('La tolerancia no puede ser negativa');
            }
            break;

        case 'texto_corto':
        case 'matematica':
        case 'formula':
        case 'ecuacion':
        case 'antiderivada':
        case 'conjunto':
        case 'punto':
            if (typeof formData.respuestaCorrecta !== 'string' || formData.respuestaCorrecta.trim().length === 0) {
                errors.push('La respuesta correcta no puede estar vacía');
            }
            break;
    }

    return errors;
};

/**
 * Constantes útiles para preguntas
 */
export const QUESTION_CONSTANTS = {
    MAX_TITLE_LENGTH: 200,
    MIN_TITLE_LENGTH: 3,
    MAX_ENUNCIADO_LENGTH: 2000,
    MIN_ENUNCIADO_LENGTH: 5,
    MAX_FEEDBACK_LENGTH: 500,
    MIN_POINTS: 1,
    MAX_POINTS: 100,
    MIN_TIME_ESTIMATE: 1,
    MAX_TIME_ESTIMATE: 60,
    DEFAULT_PAGE_SIZE: 20,
    TIPOS: {
        MULTIPLE: 'multiple' as const,
        VERDADERO_FALSO: 'verdadero_falso' as const,
        TEXTO_CORTO: 'texto_corto' as const,
        NUMERICO: 'numerico' as const,
        MATEMATICA: 'matematica' as const
    },
    DIFICULTADES: {
        FACIL: 'facil' as const,
        MEDIO: 'medio' as const,
        DIFICIL: 'dificil' as const
    }
} as const;

/**
 * Función helper para obtener etiqueta legible del tipo de pregunta
 */
export const getQuestionTypeLabel = (tipo: QuestionType): string => {
    const labels = {
        multiple: 'Opción Múltiple',
        verdadero_falso: 'Verdadero/Falso',
        texto_corto: 'Texto Corto',
        numerico: 'Numérico',
        numero: 'Número',
        matematica: 'Matemática',
        formula: 'Fórmula',
        ecuacion: 'Ecuación',
        antiderivada: 'Antiderivada',
        conjunto: 'Conjunto',
        punto: 'Punto'
    };
    return labels[tipo as keyof typeof labels] || tipo;
};

/**
 * Función helper para obtener etiqueta legible de la dificultad
 */
export const getDifficultyLabel = (dificultad: 'facil' | 'medio' | 'dificil'): string => {
    const labels = {
        facil: 'Fácil',
        medio: 'Medio',
        dificil: 'Difícil'
    };
    return labels[dificultad] || dificultad;
};

/**
 * Función helper para obtener icono de tipo de pregunta
 */
export const getQuestionTypeIcon = (tipo: QuestionType): string => {
    const icons = {
        multiple: '⭕',
        verdadero_falso: '✅',
        texto_corto: '📝',
        numerico: '🔢',
        numero: '🔢',
        matematica: '🧮',
        formula: '🧮',
        ecuacion: '🧮',
        antiderivada: '∫',
        conjunto: '🔗',
        punto: '📍'
    };
    return icons[tipo as keyof typeof icons] || '❓';
};