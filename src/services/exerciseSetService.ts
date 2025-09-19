// ============================================================================
// SERVICIOS EXERCISE SET - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/services/exerciseSetService.ts
// Propósito: Servicios CRUD para Exercise Sets usando API backend
// Compatible con tipos compartidos y controladores backend

import {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
    apiPatch,
    getErrorMessage
} from './api';
import {
    ExerciseSetBase,
    CreateExerciseSetRequest,
    PaginatedResponse,
    PaginationParams
} from '../types/shared';

/**
 * Servicio para obtener todos los exercise sets con paginación
 */
export const getExerciseSets = async (
    params?: Partial<PaginationParams>
): Promise<PaginatedResponse<ExerciseSetBase>> => {
    try {
        const queryParams = new URLSearchParams();

        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        const url = `/exercise-sets${queryParams.toString() ? `?${queryParams}` : ''}`;
        const response = await apiGet<PaginatedResponse<ExerciseSetBase>>(url);

        if (response.ok && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Error al obtener exercise sets');
    } catch (error) {
        console.error('❌ Error in getExerciseSets:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Servicio para obtener un exercise set específico por ID
 */
export const getExerciseSetById = async (id: string): Promise<ExerciseSetBase> => {
    try {
        if (!id || id.trim().length === 0) {
            throw new Error('ID de exercise set es requerido');
        }

        const response = await apiGet<ExerciseSetBase>(`/exercise-sets/${id}`);

        if (response.ok && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Exercise set no encontrado');
    } catch (error) {
        console.error('❌ Error in getExerciseSetById:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Servicio para crear un nuevo exercise set
 */
export const createExerciseSet = async (
    exerciseData: CreateExerciseSetRequest
): Promise<ExerciseSetBase> => {
    try {
        // Validación básica en frontend
        if (!exerciseData.titulo || exerciseData.titulo.trim().length === 0) {
            throw new Error('El título es obligatorio');
        }

        if (!exerciseData.descripcion || exerciseData.descripcion.trim().length === 0) {
            throw new Error('La descripción es obligatoria');
        }

        if (!exerciseData.configuracion) {
            throw new Error('La configuración es obligatoria');
        }

        const response = await apiPost<ExerciseSetBase>('/exercise-sets', exerciseData);

        if (response.ok && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Error al crear exercise set');
    } catch (error) {
        console.error('❌ Error in createExerciseSet:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Servicio para actualizar un exercise set existente
 */
export const updateExerciseSet = async (
    id: string,
    exerciseData: Partial<CreateExerciseSetRequest>
): Promise<ExerciseSetBase> => {
    try {
        if (!id || id.trim().length === 0) {
            throw new Error('ID de exercise set es requerido');
        }

        const response = await apiPut<ExerciseSetBase>(`/exercise-sets/${id}`, exerciseData);

        if (response.ok && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Error al actualizar exercise set');
    } catch (error) {
        console.error('❌ Error in updateExerciseSet:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Servicio para eliminar un exercise set (soft delete)
 */
export const deleteExerciseSet = async (id: string): Promise<void> => {
    try {
        if (!id || id.trim().length === 0) {
            throw new Error('ID de exercise set es requerido');
        }

        const response = await apiDelete(`/exercise-sets/${id}`);

        if (!response.ok) {
            throw new Error(response.message || 'Error al eliminar exercise set');
        }
    } catch (error) {
        console.error('❌ Error in deleteExerciseSet:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Servicio para publicar/despublicar un exercise set
 */
export const togglePublishExerciseSet = async (
    id: string,
    publicado: boolean
): Promise<void> => {
    try {
        if (!id || id.trim().length === 0) {
            throw new Error('ID de exercise set es requerido');
        }

        const response = await apiPatch(`/exercise-sets/${id}/publish`, { publicado });

        if (!response.ok) {
            throw new Error(response.message || 'Error al cambiar estado de publicación');
        }
    } catch (error) {
        console.error('❌ Error in togglePublishExerciseSet:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Servicio para obtener exercise sets con filtros específicos
 */
export const getExerciseSetsByFilters = async (filters: {
    estado?: 'draft' | 'published' | 'archived';
    autorId?: string;
    cursoId?: string;
    search?: string;
    page?: number;
    limit?: number;
}): Promise<PaginatedResponse<ExerciseSetBase>> => {
    try {
        const queryParams = new URLSearchParams();

        // Agregar filtros como query parameters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });

        const url = `/exercise-sets${queryParams.toString() ? `?${queryParams}` : ''}`;
        const response = await apiGet<PaginatedResponse<ExerciseSetBase>>(url);

        if (response.ok && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Error al obtener exercise sets filtrados');
    } catch (error) {
        console.error('❌ Error in getExerciseSetsByFilters:', error);
        throw new Error(getErrorMessage(error));
    }
};

/**
 * Hook personalizado para manejar el estado de loading de exercise sets
 */
export interface ExerciseSetOperationResult<T = void> {
    data?: T;
    loading: boolean;
    error?: string;
}

/**
 * Tipos auxiliares para el frontend
 */
export interface ExerciseSetFormData {
    titulo: string;
    descripcion: string;
    instrucciones?: string;
    configuracion: {
        intentos: number;
        tiempo?: number;
        mostrarRespuestas: boolean;
        mostrarExplicaciones: boolean;
        navegacionLibre: boolean;
        autoguardado: boolean;
    };
    cursoId?: string;
}

/**
 * Función helper para transformar datos del formulario a CreateExerciseSetRequest
 */
export const transformFormDataToRequest = (
    formData: ExerciseSetFormData
): CreateExerciseSetRequest => {
    return {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        instrucciones: formData.instrucciones?.trim(),
        configuracion: {
            intentos: formData.configuracion.intentos,
            tiempo: formData.configuracion.tiempo,
            mostrarRespuestas: formData.configuracion.mostrarRespuestas,
            mostrarExplicaciones: formData.configuracion.mostrarExplicaciones,
            navegacionLibre: formData.configuracion.navegacionLibre,
            autoguardado: formData.configuracion.autoguardado
        },
        cursoId: formData.cursoId
    };
};

/**
 * Función helper para obtener la configuración por defecto
 */
export const getDefaultExerciseConfig = () => ({
    intentos: 3,
    tiempo: 60,
    mostrarRespuestas: true,
    mostrarExplicaciones: true,
    navegacionLibre: true,
    autoguardado: true
});

/**
 * Función helper para validar datos del formulario
 */
export const validateExerciseSetForm = (formData: ExerciseSetFormData): string[] => {
    const errors: string[] = [];

    if (!formData.titulo || formData.titulo.trim().length === 0) {
        errors.push('El título es obligatorio');
    } else if (formData.titulo.trim().length < 3) {
        errors.push('El título debe tener al menos 3 caracteres');
    } else if (formData.titulo.trim().length > 200) {
        errors.push('El título no puede exceder 200 caracteres');
    }

    if (!formData.descripcion || formData.descripcion.trim().length === 0) {
        errors.push('La descripción es obligatoria');
    } else if (formData.descripcion.trim().length < 10) {
        errors.push('La descripción debe tener al menos 10 caracteres');
    } else if (formData.descripcion.trim().length > 1000) {
        errors.push('La descripción no puede exceder 1000 caracteres');
    }

    if (formData.instrucciones && formData.instrucciones.trim().length > 2000) {
        errors.push('Las instrucciones no pueden exceder 2000 caracteres');
    }

    if (formData.configuracion.intentos < 1) {
        errors.push('Debe permitir al menos 1 intento');
    } else if (formData.configuracion.intentos > 10) {
        errors.push('No se pueden permitir más de 10 intentos');
    }

    if (formData.configuracion.tiempo && formData.configuracion.tiempo < 1) {
        errors.push('El tiempo límite debe ser mayor a 0 minutos');
    } else if (formData.configuracion.tiempo && formData.configuracion.tiempo > 300) {
        errors.push('El tiempo límite no puede exceder 300 minutos (5 horas)');
    }

    return errors;
};

/**
 * Constantes útiles para el frontend
 */
export const EXERCISE_SET_CONSTANTS = {
    MAX_TITLE_LENGTH: 200,
    MIN_TITLE_LENGTH: 3,
    MAX_DESCRIPTION_LENGTH: 1000,
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_INSTRUCTIONS_LENGTH: 2000,
    MIN_ATTEMPTS: 1,
    MAX_ATTEMPTS: 10,
    MAX_TIME_LIMIT: 300, // 5 horas en minutos
    DEFAULT_PAGE_SIZE: 10,
    ESTADOS: {
        DRAFT: 'draft' as const,
        PUBLISHED: 'published' as const,
        ARCHIVED: 'archived' as const
    }
} as const;