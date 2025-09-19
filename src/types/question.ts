/**
 * Tipos para preguntas anidadas dentro de ejercicios
 */

import type { ID, Timestamps } from './common';

// Tipos de pregunta disponibles
export type QuestionType =
    | 'multiple_choice'
    | 'true_false'
    | 'short_answer'
    | 'numerical'
    | 'essay';

// Opción para preguntas de opción múltiple
export interface QuestionOption {
    readonly id: ID;
    readonly text: string;
    readonly isCorrect: boolean;
    readonly feedback?: string;
}

// Configuración de validación para preguntas numéricas
export interface NumericalValidation {
    readonly correctAnswer: number;
    readonly tolerance: number; // margen de error permitido
    readonly unit?: string; // unidad de medida
}

// Configuración base de pregunta
export interface QuestionConfig {
    readonly points: number;
    readonly required: boolean;
    readonly showFeedback: boolean;
}

// Pregunta anidada base
export interface NestedQuestion extends Timestamps {
    readonly id: ID;
    readonly exerciseSetId: ID;
    readonly title: string;
    readonly content: string; // HTML/Markdown con LaTeX
    readonly type: QuestionType;
    readonly order: number; // posición en el ejercicio
    readonly config: QuestionConfig;
}

// Pregunta de opción múltiple
export interface MultipleChoiceQuestion extends NestedQuestion {
    readonly type: 'multiple_choice';
    readonly options: readonly QuestionOption[];
    readonly allowMultipleSelection: boolean;
}

// Pregunta verdadero/falso
export interface TrueFalseQuestion extends NestedQuestion {
    readonly type: 'true_false';
    readonly correctAnswer: boolean;
    readonly feedback: {
        readonly correct: string;
        readonly incorrect: string;
    };
}

// Pregunta de respuesta corta
export interface ShortAnswerQuestion extends NestedQuestion {
    readonly type: 'short_answer';
    readonly correctAnswers: readonly string[]; // múltiples respuestas aceptables
    readonly caseSensitive: boolean;
}

// Pregunta numérica
export interface NumericalQuestion extends NestedQuestion {
    readonly type: 'numerical';
    readonly validation: NumericalValidation;
}

// Pregunta de ensayo
export interface EssayQuestion extends NestedQuestion {
    readonly type: 'essay';
    readonly maxWords: number;
    readonly rubric?: string;
}

// Unión de todos los tipos de pregunta
export type AnyQuestion =
    | MultipleChoiceQuestion
    | TrueFalseQuestion
    | ShortAnswerQuestion
    | NumericalQuestion
    | EssayQuestion;

// Datos para crear nueva pregunta
export interface CreateQuestionData {
    readonly exerciseSetId: ID;
    readonly title: string;
    readonly content: string;
    readonly type: QuestionType;
    readonly order: number;
    readonly config: QuestionConfig;
    readonly typeSpecificData: QuestionTypeSpecificData;
}

// Datos específicos por tipo de pregunta
export type QuestionTypeSpecificData =
    | { type: 'multiple_choice'; options: Omit<QuestionOption, 'id'>[]; allowMultipleSelection: boolean }
    | { type: 'true_false'; correctAnswer: boolean; feedback: { correct: string; incorrect: string } }
    | { type: 'short_answer'; correctAnswers: string[]; caseSensitive: boolean }
    | { type: 'numerical'; validation: NumericalValidation }
    | { type: 'essay'; maxWords: number; rubric?: string };

// Datos para actualizar pregunta
export interface UpdateQuestionData {
    readonly title?: string;
    readonly content?: string;
    readonly order?: number;
    readonly config?: Partial<QuestionConfig>;
}