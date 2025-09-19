/**
 * Tipos base comunes para toda la aplicación
 */

// Estados básicos de la aplicación
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export type Status = 'draft' | 'published' | 'archived';

// Identificadores únicos
export type ID = string;

// Usuario básico (del sistema existente)
export interface BaseUser {
    readonly id: ID;
    readonly email: string;
    readonly nombre: string;
    readonly apellido: string;
    readonly rol: UserRole;
}

// Roles de usuario
export type UserRole = 'instructor' | 'student' | 'admin';

// Respuesta API estándar
export interface ApiResponse<T = unknown> {
    readonly ok: boolean;
    readonly data?: T;
    readonly message?: string;
    readonly error?: string;
}

// Paginación
export interface PaginationParams {
    readonly page: number;
    readonly limit: number;
}

export interface PaginatedResponse<T> {
    readonly items: readonly T[];
    readonly total: number;
    readonly page: number;
    readonly limit: number;
    readonly totalPages: number;
}

// Timestamps
export interface Timestamps {
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

// Error handling
export interface AppError {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
}

// Validación
export interface ValidationError {
    readonly field: string;
    readonly message: string;
}

export type ValidationErrors = readonly ValidationError[];