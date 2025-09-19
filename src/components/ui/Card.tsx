/**
 * Componente Card reutilizable
 */

import React from 'react';
import { clsx } from 'clsx';

type CardVariant = 'default' | 'elevated' | 'outline' | 'glass';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    readonly variant?: CardVariant;
    readonly padding?: boolean;
    readonly children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    readonly children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    readonly children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    readonly children: React.ReactNode;
}

const Card: React.FC<CardProps> & {
    Header: React.FC<CardHeaderProps>;
    Content: React.FC<CardContentProps>;
    Footer: React.FC<CardFooterProps>;
} = ({
    variant = 'default',
    padding = true,
    className,
    children,
    ...props
}) => {
        const baseClasses = 'rounded-xl transition-all duration-200';

        const variantClasses: Record<CardVariant, string> = {
            default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
            elevated: 'bg-white dark:bg-gray-800 shadow-elegant hover:shadow-elegant-lg',
            outline: 'bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
            glass: 'glass-effect shadow-glass dark:shadow-glass-dark',
        };

        const paddingClass = padding ? 'p-6' : '';

        const cardClasses = clsx(
            baseClasses,
            variantClasses[variant],
            paddingClass,
            className
        );

        return (
            <div className={cardClasses} {...props}>
                {children}
            </div>
        );
    };

const CardHeader: React.FC<CardHeaderProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={clsx('mb-4', className)}
            {...props}
        >
            {children}
        </div>
    );
};

const CardContent: React.FC<CardContentProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={clsx('space-y-4', className)}
            {...props}
        >
            {children}
        </div>
    );
};

const CardFooter: React.FC<CardFooterProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={clsx('mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between', className)}
            {...props}
        >
            {children}
        </div>
    );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;