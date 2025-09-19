// ============================================================================
// COMPONENTE LATEX - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/components/ui/LaTeX.tsx
// Propósito: Renderizado de expresiones matemáticas con LaTeX
// Compatible con react-latex-next y KaTeX

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
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const LaTeXComponent: React.FC<LaTeXProps> = ({
    children,
    inline = false,
    className = '',
    size = 'normal',
    color,
    centered = false
}) => {
    // Configuración de estilos según props
    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return 'text-sm';
            case 'large':
                return 'text-lg';
            default:
                return 'text-base';
        }
    };

    const baseClasses = `
    ${getSizeClass()}
    ${centered && !inline ? 'text-center' : ''}
    ${className}
  `.trim();

    const inlineStyles = color ? { color } : {};

    // Procesar el contenido para manejar diferentes formatos de LaTeX
    const processLatexContent = (content: string): string => {
        // Convertir $...$ a delimitadores inline
        let processed = content.replace(/\$([^$]+)\$/g, '$$$1$$');

        // Convertir $$...$$ a delimitadores display si no es inline
        if (!inline) {
            processed = processed.replace(/\$\$([^$]+)\$\$/g, '$$$$$$1$$$$$$');
        }

        return processed;
    };

    const processedContent = processLatexContent(children);

    return (
        <span
            className={baseClasses}
            style={inlineStyles}
        >
            <Latex
                strict={false}
                macros={{
                    "\\RR": "\\mathbb{R}",
                    "\\CC": "\\mathbb{C}",
                    "\\NN": "\\mathbb{N}",
                    "\\ZZ": "\\mathbb{Z}",
                    "\\QQ": "\\mathbb{Q}",
                    "\\lim": "\\lim\\limits",
                    "\\sum": "\\sum\\limits",
                    "\\int": "\\int\\limits"
                }}
            >
                {processedContent}
            </Latex>
        </span>
    );
};

export default LaTeXComponent;