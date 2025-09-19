// ============================================================================
// CONFIGURACIÓN API - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/services/api.ts
// Propósito: Configuración central de Axios para comunicación con backend
// Compatible con tipos compartidos y estructura existente

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types/shared';

/**
 * Configuración base de la API
 */
const API_CONFIG = {
    baseURL: '/api', // Usa el proxy de Vite configurado
    timeout: 10000,  // 10 segundos timeout
    headers: {
        'Content-Type': 'application/json',
    },
} as const;

/**
 * Instancia principal de Axios
 */
export const api: AxiosInstance = axios.create(API_CONFIG);

/**
 * Interceptor de Request - Agregar headers comunes
 */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Agregar timestamp para debugging en desarrollo
        const isDev = process.env.NODE_ENV === 'development';
        if (isDev) {
            console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                data: config.data,
                params: config.params,
                timestamp: new Date().toISOString()
            });
        }

        // Aquí podríamos agregar tokens de autenticación cuando sea necesario
        // const token = localStorage.getItem('authToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;
    },
    (error: AxiosError) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

/**
 * Interceptor de Response - Manejo centralizado de respuestas
 */
api.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        // Log en desarrollo
        const isDev = process.env.NODE_ENV === 'development';
        if (isDev) {
            console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data,
                timestamp: new Date().toISOString()
            });
        }

        // Validar estructura de respuesta API
        if (response.data && typeof response.data === 'object' && 'ok' in response.data) {
            // Respuesta válida con formato ApiResponse
            return response;
        } else {
            // Respuesta sin formato ApiResponse, envolver
            const wrappedResponse: ApiResponse = {
                ok: true,
                data: response.data,
                message: 'Respuesta recibida correctamente'
            };
            response.data = wrappedResponse;
            return response;
        }
    },
    (error: AxiosError<ApiResponse>) => {
        // Log de errores
        console.error('❌ API Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method,
            data: error.response?.data,
            timestamp: new Date().toISOString()
        });

        // Manejo específico por código de error
        if (error.response) {
            // Error de respuesta del servidor
            const { status, data } = error.response;

            switch (status) {
                case 400:
                    console.warn('⚠️ Bad Request:', data?.message || 'Solicitud inválida');
                    break;
                case 401:
                    console.warn('🔒 Unauthorized:', data?.message || 'No autorizado');
                    // Aquí podríamos redirigir al login
                    break;
                case 403:
                    console.warn('🚫 Forbidden:', data?.message || 'Prohibido');
                    break;
                case 404:
                    console.warn('🔍 Not Found:', data?.message || 'Recurso no encontrado');
                    break;
                case 422:
                    console.warn('📝 Validation Error:', data?.message || 'Error de validación');
                    break;
                case 500:
                    console.error('💥 Server Error:', data?.message || 'Error interno del servidor');
                    break;
                default:
                    console.error(`🔴 HTTP ${status}:`, data?.message || 'Error desconocido');
            }
        } else if (error.request) {
            // Error de red (sin respuesta)
            console.error('🌐 Network Error:', 'No se pudo conectar con el servidor');
        } else {
            // Error de configuración
            console.error('⚙️ Config Error:', error.message);
        }

        return Promise.reject(error);
    }
);

/**
 * Función helper para GET requests
 */
export const apiGet = async <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await api.get<ApiResponse<T>>(url, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Función helper para POST requests
 */
export const apiPost = async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await api.post<ApiResponse<T>>(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Función helper para PUT requests
 */
export const apiPut = async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await api.put<ApiResponse<T>>(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Función helper para DELETE requests
 */
export const apiDelete = async <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await api.delete<ApiResponse<T>>(url, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Función helper para PATCH requests
 */
export const apiPatch = async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await api.patch<ApiResponse<T>>(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Función para verificar conectividad con el backend
 */
export const checkApiHealth = async (): Promise<boolean> => {
    try {
        const response = await apiGet('/health');
        return response.ok;
    } catch (error) {
        console.error('❌ API Health Check Failed:', error);
        return false;
    }
};

/**
 * Función para obtener información del servidor
 */
export const getApiInfo = async (): Promise<ApiResponse> => {
    try {
        return await apiGet('/info');
    } catch (error) {
        console.error('❌ Failed to get API info:', error);
        throw error;
    }
};

/**
 * Tipos para manejo de errores
 */
export interface ApiErrorResponse {
    ok: false;
    message: string;
    error: string;
    details?: Record<string, unknown>;
}

/**
 * Helper para verificar si un error es de API
 */
export const isApiError = (error: unknown): error is AxiosError<ApiErrorResponse> => {
    return axios.isAxiosError(error) && !!error.response?.data;
};

/**
 * Helper para extraer mensaje de error de manera segura
 */
export const getErrorMessage = (error: unknown): string => {
    if (isApiError(error)) {
        return error.response?.data?.message || 'Error de API desconocido';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Error desconocido';
};

/**
 * Configuración para desarrollo
 */
const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
    console.log('🔧 API Configuration:', {
        baseURL: API_CONFIG.baseURL,
        timeout: API_CONFIG.timeout,
        environment: process.env.NODE_ENV
    });
}

export default api;