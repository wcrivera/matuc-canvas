// ============================================================================
// TIPOS COMPARTIDOS - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: /shared-types/index.ts
// Propósito: Tipos base compartidos entre frontend y backend
// Compatibilidad: Mantiene estructura existente de ambos proyectos

/**
 * Identificadores únicos - Compatible con ambos proyectos
 */
export type ID = string;
export type MongoObjectId = string; // Para referencias MongoDB

/**
 * Estados básicos de la aplicación
 */
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';
export type ExerciseStatus = 'draft' | 'published' | 'archived';
export type AttemptStatus = 'in_progress' | 'completed' | 'submitted' | 'graded';

/**
 * Tipos de pregunta - Compatible con frontend existente
 */
export type QuestionType =
    | 'multiple'
    | 'verdadero_falso'
    | 'texto_corto'
    | 'numerico'
    | 'matematica'
    | 'numero'      // Compatibilidad con frontend existente
    | 'conjunto'    // Compatibilidad con frontend existente
    | 'punto'       // Compatibilidad con frontend existente
    | 'formula'     // Compatibilidad con frontend existente
    | 'ecuacion'    // Compatibilidad con frontend existente
    | 'antiderivada'; // Compatibilidad con frontend existente

/**
 * Roles de usuario - Compatible con sistema existente
 */
export type UserRole = 'instructor' | 'student' | 'admin';

/**
 * Respuesta API estándar - Compatible con frontend existente
 */
export interface ApiResponse<T = unknown> {
    readonly ok: boolean;
    readonly data?: T;
    readonly message?: string;
    readonly error?: string;
    readonly timestamp?: string; // Para backend
}

/**
 * Usuario base - Compatible con estructura existente
 */
export interface BaseUser {
    readonly id: ID;
    readonly email: string;
    readonly nombre: string;
    readonly apellido: string;
    readonly rol: UserRole;
}

/**
 * Configuración de ejercicio - Simplificada y compatible
 */
export interface ExerciseConfig {
    readonly intentos: number;
    readonly tiempo?: number; // en minutos
    readonly mostrarRespuestas: boolean;
    readonly mostrarExplicaciones: boolean;
    readonly navegacionLibre: boolean;
    readonly autoguardado: boolean;
}

/**
 * Feedback de pregunta - Compatible con frontend existente
 */
export interface QuestionFeedback {
    readonly correcto: string;
    readonly incorrecto: string;
    readonly explicacion?: string;
    readonly pista?: string;
}

/**
 * Configuración de pregunta por tipo
 */
export interface QuestionConfigBase {
    readonly opciones?: string[];           // Para múltiple opción
    readonly correctas?: number[];          // Índices correctos
    readonly tolerancia?: number;           // Para numérico
    readonly caseSensitive?: boolean;       // Para texto
    readonly respuestasAceptadas?: string[]; // Alternativas válidas
}

/**
 * Pregunta base - Mapeo entre frontend y backend
 * Frontend usa: id, titulo, enunciado, tipo
 * Backend usa: nqid, titulo, enunciado, tipo
 */
export interface QuestionBase {
    readonly id: ID;
    readonly titulo: string;
    readonly enunciado: string;
    readonly tipo: QuestionType;
    readonly orden: number;
    readonly config: QuestionConfigBase;
    readonly respuestaCorrecta: any; // Flexible para diferentes tipos
    readonly feedback: QuestionFeedback;
    readonly puntos: number;
    readonly dificultad: 'facil' | 'medio' | 'dificil';
    readonly tiempoEstimado: number; // en minutos
    readonly tags: string[];
    readonly activo: boolean;
}

/**
 * Set de ejercicios base - Mapeo entre frontend y backend
 * Frontend usa: id, titulo, descripcion
 * Backend usa: esid, titulo, descripcion
 */
export interface ExerciseSetBase {
    readonly id: ID;
    readonly titulo: string;
    readonly descripcion: string;
    readonly instrucciones?: string | undefined;
    readonly preguntas: QuestionBase[];
    readonly configuracion: ExerciseConfig;
    readonly estado: ExerciseStatus;
    readonly activo: boolean;
    readonly publicado: boolean;
    readonly fechaCreacion: Date;
    readonly fechaActualizacion: Date;
    readonly autorId: ID;
    readonly cursoId?: ID; // Opcional para compatibilidad
}

/**
 * Intento de estudiante
 */
export interface StudentAttemptBase {
    readonly id: ID;
    readonly exerciseSetId: ID;
    readonly studentId: ID;
    readonly estado: AttemptStatus;
    readonly fechaInicio: Date;
    readonly fechaFinalizacion?: Date;
    readonly puntajeObtenido?: number;
    readonly puntajeMaximo: number;
    readonly tiempoTranscurrido: number; // en segundos
    readonly intentoNumero: number;
}

/**
 * Respuesta a pregunta individual
 */
export interface QuestionResponseBase {
    readonly id: ID;
    readonly questionId: ID;
    readonly attemptId: ID;
    readonly respuestaEstudiante: any; // Flexible para diferentes tipos
    readonly esCorrecta: boolean;
    readonly puntajeObtenido: number;
    readonly puntajeMaximo: number;
    readonly tiempoRespuesta: number; // en segundos
    readonly feedbackMostrado: string;
}

/**
 * Request para crear ejercicio - Compatible con formularios frontend
 */
export interface CreateExerciseSetRequest {
    readonly titulo: string;
    readonly descripcion: string;
    readonly instrucciones?: string | undefined;
    readonly configuracion: ExerciseConfig;
    readonly cursoId?: ID;
}

/**
 * Request para crear pregunta - Compatible con formularios frontend
 */
export interface CreateQuestionRequest {
    readonly exerciseSetId: ID;
    readonly titulo: string;
    readonly enunciado: string;
    readonly tipo: QuestionType;
    readonly orden: number;
    readonly config: QuestionConfigBase;
    readonly respuestaCorrecta: any;
    readonly feedback: QuestionFeedback;
    readonly puntos: number;
    readonly dificultad: 'facil' | 'medio' | 'dificil';
    readonly tiempoEstimado: number;
    readonly tags: string[];
}

/**
 * Request para enviar respuesta
 */
export interface SubmitAnswerRequest {
    readonly questionId: ID;
    readonly attemptId: ID;
    readonly respuestaEstudiante: any;
    readonly tiempoRespuesta?: number;
}

/**
 * Resultado de validación
 */
export interface ValidationResult {
    readonly esCorrecta: boolean;
    readonly puntajeObtenido: number;
    readonly puntajeMaximo: number;
    readonly feedback: string;
    readonly explicacion?: string;
    readonly pista?: string;
}

/**
 * Paginación - Para listas de ejercicios
 */
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

/**
 * Timestamps base
 */
export interface Timestamps {
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

/**
 * Error handling
 */
export interface AppError {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
}

export interface ValidationError {
    readonly field: string;
    readonly message: string;
}

export type ValidationErrors = ValidationError[];