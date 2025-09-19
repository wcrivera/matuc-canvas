/**
 * Componente Input reutilizable
 */

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { AlertCircle } from 'lucide-react';

type InputVariant = 'default' | 'filled';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    readonly variant?: InputVariant;
    readonly size?: InputSize;
    readonly error?: string;
    readonly label?: string;
    readonly hint?: string;
    readonly fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    variant = 'default',
    size = 'md',
    error,
    label,
    hint,
    fullWidth = false,
    className,
    id,
    ...props
}, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = 'transition-colors duration-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses: Record<InputVariant, string> = {
        default: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500',
        filled: 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:ring-blue-500',
    };

    const sizeClasses: Record<InputSize, string> = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
    };

    const errorClasses = error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : '';

    const widthClass = fullWidth ? 'w-full' : '';

    const inputClasses = clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        errorClasses,
        widthClass,
        className
    );

    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    ref={ref}
                    id={inputId}
                    className={inputClasses}
                    {...props}
                />

                {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                )}
            </div>

            {(hint || error) && (
                <div className="mt-1">
                    {error ? (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                            {error}
                        </p>
                    ) : hint ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {hint}
                        </p>
                    ) : null}
                </div>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;