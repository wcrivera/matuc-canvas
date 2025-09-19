/**
 * Cliente API base para comunicación con backend
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types/common';

class ApiClient {
    private readonly instance: AxiosInstance;

    constructor() {
        const apiUrl = typeof window !== 'undefined'
            ? (window as any).VITE_API_URL
            : 'http://localhost:3000/api';

        this.instance = axios.create({
            baseURL: apiUrl || 'http://localhost:3000/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor - agregar token de autenticación
        this.instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('authToken');
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - manejo de errores global
        this.instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expirado o inválido
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.instance.get(url, config);
            return response.data;
        } catch (error) {
            return this.handleError<T>(error);
        }
    }

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.instance.post(url, data, config);
            return response.data;
        } catch (error) {
            return this.handleError<T>(error);
        }
    }

    async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.instance.put(url, data, config);
            return response.data;
        } catch (error) {
            return this.handleError<T>(error);
        }
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.instance.delete(url, config);
            return response.data;
        } catch (error) {
            return this.handleError<T>(error);
        }
    }

    private handleError<T = never>(error: unknown): ApiResponse<T> {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message;
            const statusCode = error.response?.status || 500;

            return {
                ok: false,
                error: message,
                message: `Error ${statusCode}: ${message}`,
            } as ApiResponse<T>;
        }

        return {
            ok: false,
            error: 'Error desconocido',
            message: 'Ocurrió un error inesperado',
        } as ApiResponse<T>;
    }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();

// Helper types para endpoints específicos
export type GetEndpoint<T> = (config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
export type PostEndpoint<T, D = unknown> = (data: D, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
export type PutEndpoint<T, D = unknown> = (data: D, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
export type DeleteEndpoint<T> = (config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;