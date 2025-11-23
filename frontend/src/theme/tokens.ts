// src/theme/tokens.ts
// Centralized design tokens for the ESN frontend
// Colors are defined using HSL for easy theming
export const colors = {
    primary: "hsl(220, 90%, 56%)", // blue
    secondary: "hsl(340, 80%, 60%)", // pink
    accent: "hsl(45, 90%, 55%)", // orange
    background: "hsl(0, 0%, 98%)",
    surface: "hsl(0, 0%, 100%)",
    textPrimary: "hsl(220, 15%, 20%)",
    textSecondary: "hsl(220, 10%, 40%)",
    success: "hsl(120, 70%, 45%)",
    warning: "hsl(45, 85%, 55%)",
    error: "hsl(0, 80%, 45%)",
};

export const spacing = {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "40px",
};

export const typography = {
    fontFamily: "'Inter', sans-serif",
    fontSizeBase: "16px",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    lineHeightBase: "1.5",
};

// Export a CSS variables string for easy injection into global styles
export const cssVariables = `
  :root {
    --color-primary: ${colors.primary};
    --color-secondary: ${colors.secondary};
    --color-accent: ${colors.accent};
    --color-background: ${colors.background};
    --color-surface: ${colors.surface};
    --color-text-primary: ${colors.textPrimary};
    --color-text-secondary: ${colors.textSecondary};
    --color-success: ${colors.success};
    --color-warning: ${colors.warning};
    --color-error: ${colors.error};
    --spacing-xs: ${spacing.xs};
    --spacing-sm: ${spacing.sm};
    --spacing-md: ${spacing.md};
    --spacing-lg: ${spacing.lg};
    --spacing-xl: ${spacing.xl};
    --font-family: ${typography.fontFamily};
    --font-size-base: ${typography.fontSizeBase};
    --font-weight-regular: ${typography.fontWeightRegular};
    --font-weight-medium: ${typography.fontWeightMedium};
    --font-weight-bold: ${typography.fontWeightBold};
    --line-height-base: ${typography.lineHeightBase};
  }
`;
