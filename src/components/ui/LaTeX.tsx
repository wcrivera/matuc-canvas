// ============================================================================
// COMPONENTE LATEX - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/components/ui/LaTeX.tsx
// Propósito: Renderizado de expresiones matemáticas con LaTeX
// Compatible con react-latex-next y KaTeX - Version minimalista

import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

// ============================================================================
// PROPS DEL COMPONENTE
// ============================================================================

interface LaTeXProps {
    /** Contenido LaTeX a renderizar */
    readonly children: string;
    /** Si es contenido en línea o bloque */
    readonly inline?: boolean;
    /** Clase CSS adicional */
    readonly className?: string;
    /** Tamaño del texto LaTeX */
    readonly size?: 'small' | 'normal' | 'large';
    /** Color del texto */
    readonly color?: string;
    /** Si debe centrarse cuando es bloque */
    readonly centered?: boolean;
    /** Si mostrar errores de manera amigable */
    readonly strict?: boolean;
    /** Color de error personalizado */
    readonly errorColor?: string;
}

// ============================================================================
// MACROS PREDEFINIDAS
// ============================================================================

const MACROS = {
    // Conjuntos numéricos
    "\\RR": "\\mathbb{R}",
    "\\CC": "\\mathbb{C}",
    "\\NN": "\\mathbb{N}",
    "\\ZZ": "\\mathbb{Z}",
    "\\QQ": "\\mathbb{Q}",

    // Operadores mejorados
    "\\lim": "\\lim\\limits",
    "\\sum": "\\sum\\limits",
    "\\int": "\\int\\limits",

    // Utilidades comunes
    "\\abs": "\\left|#1\\right|",
    "\\norm": "\\left\\|#1\\right\\|",
    "\\set": "\\left\\{#1\\right\\}",
    "\\dd": "\\,\\mathrm{d}",
};

// ============================================================================
// HELPERS
// ============================================================================

const getSizeClass = (size: LaTeXProps['size']): string => {
    switch (size) {
        case 'small': return 'text-sm';
        case 'large': return 'text-lg';
        default: return 'text-base';
    }
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const LaTeXComponent: React.FC<LaTeXProps> = ({
    children,
    inline = false,
    className = '',
    size = 'normal',
    color,
    centered = false,
    strict = false,
    // errorColor = '#dc2626'
}) => {
    // Configuración de estilos según props
    const containerClasses = [
        getSizeClass(size),
        centered && !inline ? 'text-center' : '',
        className
    ].filter(Boolean).join(' ');

    const containerStyles = color ? { color } : {};

    return (
        <span className={containerClasses} style={containerStyles}>
            <Latex
                strict={strict}
                macros={MACROS}
            >
                {children}
            </Latex>
        </span>
    );
};

export default LaTeXComponent;