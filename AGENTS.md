# DevRoast

## Visão Geral
Plataforma para publicar e avaliar código com feedback automático (roast). Desenvolvido durante a NLW da Rocketseat.

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Radix UI (acessibilidade)
- Shiki (highlight)

## Padrões de Componentes

### Estrutura de Arquivo
```
src/components/ui/
├── nome-componente.tsx
└── index.ts (export)
```

### Composição (preferido)
Componentes usam padrão de composição com subcomponentes:
```tsx
<CardRoot>
  <CardTitle />
  <CardDescription />
</CardRoot>
```

### Tailwind
- Usar variáveis do theme em vez de cores hardcoded
- Preferir classes utilitárias do Tailwind: `text-xs`, `gap-2`, etc.
- Usar arbitrários apenas quando necessário: `w-[100px]`

### Responsividade
- Mobile-first: `className="text-sm md:text-base"`

### Types
- Props estendem `HTMLAttributes` do React
- Usar `forwardRef` para componentes que precisam de ref
