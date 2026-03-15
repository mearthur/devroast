# Padrões de Criação de Componentes UI

## Regras Gerais

1. **Usar variáveis do theme do global.css**
   - Nunca usar cores hardcoded (ex: `#10B981`)
   - Usar variáveis do theme (ex: `bg-accent-green`, `text-text-secondary`)
   - Verificar variables em `src/app/globals.css`

2. **Não usar cn() com cva**
   - O class-variance-authority (cva) já faz o merge das classes automaticamente
   - Passar className diretamente: `className={buttonVariants({ variant, size, className })}`
   - Não usar `cn()` para envolver variants

3. **Limitar variantes a 3 (seguindo Pencil)**
   - Seguir as 3 variantes definidas no design do Pencil
   - Manter consistência entre código e design

4. **Usar forwardRef para componentes queAceitam ref**
   - Seguir padrão React para componentes que precisam de ref

## Exemplo de Componente

```tsx
import { cva } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-mono text-[13px] font-medium...",
  {
    variants: {
      variant: {
        default: "bg-accent-green text-bg-page hover:brightness-110",
        outline: "border border-border-primary text-text-primary hover:bg-border-primary",
        link: "border border-border-primary text-text-secondary hover:bg-border-primary hover:text-text-primary",
      },
      size: {
        default: "px-6 py-[10px]",
        sm: "px-4 py-2",
        lg: "px-8 py-3 text-sm",
        icon: "p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonVariant = "default" | "outline" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
```

## Variáveis Disponíveis do Theme

### Cores
- `bg-page`, `bg-surface`, `bg-elevated`, `bg-input`
- `text-primary`, `text-secondary`, `text-tertiary`, `text-muted`
- `border-primary`, `border-secondary`, `border-focus`
- `accent-green`, `accent-red`, `accent-amber`, `accent-orange`, `accent-blue`, `accent-cyan`
- `green-primary`, `red-accent`, `amber-accent`, `orange-accent`, `blue-accent`

### Fonts
- `font-mono` → JetBrains Mono (texto monospaced)
- Texto tradicional → system-ui, sans-serif (padrão do sistema)

### Spacing
- `spacing-xs` (4), `spacing-sm` (8), `spacing-md` (16), `spacing-lg` (24), `spacing-xl` (40)

### Radius
- `radius-none` (0), `radius-m` (16), `radius-pill` (999)