/**
 * Tipos para ejercicios con preguntas anidadas
 */

import type { ID, Status, Timestamps, BaseUser } from './common';

// Configuración del ejercicio
export interface ExerciseSettings {
  readonly timeLimit: number; // minutos, 0 = sin límite
  readonly attemptsAllowed: number; // 0 = ilimitados
  readonly showCorrectAnswers: boolean;
  readonly randomizeQuestions: boolean;
  readonly allowPartialSubmission: boolean;
}

// Configuración LTI 1.1
export interface LTIConfig {
  readonly resourceLinkId: string;
  readonly contextId: string; // Canvas course ID
  readonly consumerKey: string; // LTI 1.1 consumer key
  readonly isGraded: boolean;
  readonly maxScore: number;
  readonly outcomeServiceUrl?: string; // Para enviar calificaciones
}

// Set de ejercicios (contenedor principal)
export interface ExerciseSet extends Timestamps {
  readonly id: ID;
  readonly title: string;
  readonly description: string;
  readonly instructorId: ID;
  readonly courseId: string;
  readonly questionIds: readonly ID[]; // Referencias a preguntas anidadas
  readonly settings: ExerciseSettings;
  readonly ltiConfig: LTIConfig;
  readonly status: Status;
}

// Datos para crear un nuevo ejercicio
export interface CreateExerciseSetData {
  readonly title: string;
  readonly description: string;
  readonly courseId: string;
  readonly settings: ExerciseSettings;
  readonly ltiConfig: Omit<LTIConfig, 'passbackUrl'>;
}

// Datos para actualizar un ejercicio
export interface UpdateExerciseSetData {
  readonly title?: string;
  readonly description?: string;
  readonly settings?: Partial<ExerciseSettings>;
  readonly status?: Status;
}

// Ejercicio con preguntas incluidas (para edición)
export interface ExerciseSetWithQuestions extends ExerciseSet {
  readonly questions: readonly NestedQuestion[];
  readonly instructor: Pick<BaseUser, 'id' | 'nombre' | 'apellido'>;
}

// Resumen de ejercicio (para listas)
export interface ExerciseSetSummary {
  readonly id: ID;
  readonly title: string;
  readonly description: string;
  readonly questionCount: number;
  readonly status: Status;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Forward declaration para evitar dependencias circulares
interface NestedQuestion {
  readonly id: ID;
  readonly title: string;
  readonly type: string;
}