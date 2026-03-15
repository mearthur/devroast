# Especificação: Editor de Código com Syntax Highlighting

## 1. Visão Geral

Este documento detalha a especificação para implementação de um editor de código com syntax highlighting para o projeto DevRoast. O editor deve permitir que usuários cole snippets de código e visualizem com cores de syntax highlighting em tempo real, com detecção automática de linguagem e opção de seleção manual.

## 2. Análise do Ray-so (Referência Principal)

### 2.1 Arquitetura

O [ray-so](https://github.com/raycast/ray-so) é a referência principal para esta implementação. O editor utiliza:

**Stack Tecnológico:**
- **Syntax Highlighting**: Shiki (v1.0+) - mesmo motor do VS Code
- **Estado**: Jotai (átomos para gerenciamento de estado)
- **Framework**: Next.js
- **Estilização**: CSS Modules + Tailwind

**Abordagem Técnica:**
O ray-so implementa uma técnica de "editor sobreposto" (overlay):
1. Um `<textarea>` transparente fica sobre o código destacado
2. O `<pre>` com código destacado (gerado pelo Shiki) fica atrás
3. Ambos compartilham scroll e posicionamento idênticos
4. O textarea tem `caretColor` visível mas texto transparente

### 2.2 Componentes Principais (ray-so)

```
Editor.tsx
├── textarea (entrada do usuário - transparente)
└── HighlightedCode.tsx (código destacado - Shiki)
    └── useEffect → shiki.codeToHtml()
```

### 2.3 Detalhes de Implementação do Ray-so

**Highlighter Setup:**
```typescript
// store/index.ts
import type { Highlighter } from 'shiki';
export const highlighterAtom = atom<Highlighter | null>(null);
```

**Inicialização do Shiki:**
- Usam `createHighlighter` para criar instância síncrona
- Carregam linguagens sob demanda (lazy loading)
- Themes: github-dark, github-light, nord, etc.

**Editor.tsx - Funcionalidades:**
- Tab handling (indent/dedent)
- Enter com indentação automática
- closing brackets 自动
- Line numbers opcionais
- Keyboard shortcuts (F para focar)

**HighlightedCode.tsx:**
- Rendering async do código destacado
- Suporte a linhas destacadas (highlighted lines)
- Loading states para linguagens
- Transformes do Shiki para customização

## 3. Opções Analisadas

### 3.1 Shiki (ESCOLHIDA)

**Prós:**
- ✅ Já está instalado no projeto (shiki v4.0.2)
- ✅ Mesma qualidade de highlighting do VS Code
- ✅ Suporta 100+ linguagens
- ✅ Temas prontos (github-dark, nord, etc.)
- ✅ Bundle size razoável com lazy loading
- ✅ Ray-so usa esta biblioteca (validação)
- ✅ Funciona em browser (WASM)

**Contras:**
- ⚠️ Rendering async pode causar delay
- ⚠️ Requer tratamento para sobreposição textarea

### 3.2 Monaco Editor

**Prós:**
- ✅ Editor completo (same as VS Code)
- ✅ Suporte nativo a edição
- ✅ Syntax highlighting built-in

**Contras:**
- ❌ Instalação falhou (npm error)
- ❌ Bundle muito grande (~3MB)
- ❌ Complexidade desnecessária para o caso de uso

### 3.3 Highlight.js

**Prós:**
- ✅ Leve e rápido
- ✅ Auto-detecção de linguagem
- ✅ Muitos temas disponíveis

**Contras:**
- ❌ Qualidade de highlighting inferior ao Shiki
- ❌ Não usa TextMate grammars (menos preciso)
- ❌ Ray-so não usa esta biblioteca

### 3.4 Detecção de Linguagem

**Opções:**

| Biblioteca | Tamanho | Linguagens | Precisão | Notas |
|------------|---------|------------|----------|-------|
| **flourite** | ~200KB | 25+ | 78% | TipoScript, sem dependências |
| **guesslang-js** | ~600KB | 20+ | 80% | ML-based, browser only |
| **shamanjs** | ~617KB | 15+ | 78% | Modelo pré-treinado incluso |
| **highlight.js auto** | Bundled | 190+ | Média | Built-in, simples |

**Recomendação:** Usar detecção do próprio Shiki (quando possível) ou flourite como fallback. Alternativamente, começar com JavaScript como default e deixar usuário selecionar.

## 4. Especificação de Implementação

### 4.1 Componentes a Criar

```
src/components/ui/
├── code-editor.tsx        # Componente principal (existente - adaptar)
├── code-highlighter.tsx  # Novo: Componente de highlighting
└── language-selector.tsx # Novo: Selector de linguagem
```

### 4.2 Props do CodeEditor

```typescript
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;                    // Linguagem selecionada
  onLanguageChange?: (lang: string) => void;
  autoDetectLanguage?: boolean;         // Detecção automática
  showLineNumbers?: boolean;
  theme?: string;                      // Tema do highlighting
  placeholder?: string;
  minHeight?: string | number;
  maxHeight?: string | number;
}
```

### 4.3 Estado do Componente

```typescript
// Estado interno necessário
interface CodeEditorState {
  code: string;
  language: string;           // Linguagem atual
  isAutoDetected: boolean;  // Se foi detectada automaticamente
  highlightedHtml: string;  // Código destacado
  isLoading: boolean;       // Loading state
  error: string | null;     // Erro de parsing
}
```

### 4.4 Fluxo de Detecção de Linguagem

```
1. Usuário cola código no textarea
   ↓
2. onChange dispara
   ↓
3. Se autoDetectLanguage === true:
   a. Pegar primeiras 500 linhas do código
   b. Passar para detector (flourite/shaman)
   c. Atualizar linguagem se diferente da atual
   ↓
4. Shiki gera highlighting com linguagem detectada
   ↓
5. Atualizar display (overlay)
```

### 4.5 Lista de Linguagens Suportadas

Prioridade alta (sempre carregadas):
- javascript
- typescript
- python
- go
- rust
- java
- csharp
- cpp
- sql
- html
- css

Carregadas sob demanda:
- php
- ruby
- swift
- kotlin
- scala
- r
- perl
- haskell
- elixir
- erlang
- lua
- dart

### 4.6 Temas Disponíveis

Usar temas compatíveis com Shiki:
- `github-dark` (default)
- `github-light`
- `nord`
- `vitesse-dark`
- `dracula`
- `one-dark-pro`

### 4.7 Interface do Usuário

**Estrutura Visual:**
```
┌─────────────────────────────────────────────────┐
│  [● ● ●]  [Linguagem ▼]  [Theme ▼]  [Linenos] │  ← Toolbar (opcional)
├─────────────────────────────────────────────────┤
│  1 │ function calculateTotal(items) {         │
│  2 │   var total = 0;                         │
│  3 │   for (var i = 0; i < items.length;    │
│     │       i++) {                            │
│  ...│     total += items[i].price;            │
│  12│   }                                      │
│  13│   return total;                          │
│  14│ }                                        │
└─────────────────────────────────────────────────┘
```

**Elementos UI:**
1. **Window chrome** (opcional): 3 dots coloridos
2. **Language selector**: Dropdown com linguagens
3. **Line numbers**: Coluna opcional
4. **Syntax colors**: Cores do tema selecionado

### 4.8 Performance Considerations

- **Debounce**: Delay de 300ms antes de re-highlight
- **Worker**: Considerar Web Worker para código muito longo
- **Lazy loading**: Linguagens carregadas sob demanda
- **Memoization**: Cache de resultados de highlighting
- **Virtual scrolling**: Para códigos com 1000+ linhas

## 5. Todo List

### Fase 1: Setup e Configuração
- [ ] Configurar Shiki com createHighlighter
- [ ] Definir lista de linguagens padrão
- [ ] Criar store/estado para o editor
- [ ] Implementar tema padrão (github-dark)

### Fase 2: Componente Base
- [ ] Adaptar CodeEditor existente
- [ ] Implementar overlay com textarea transparente
- [ ] Sincronizar scroll entre textarea e highlighted code
- [ ] Adicionar line numbers

### Fase 3: Detecção de Linguagem
- [ ] Integrar biblioteca de detecção (flourite)
- [ ] Implementar auto-detecção no onChange
- [ ] Adicionar toggle para modo auto/manual
- [ ] Mostrar indicador de linguagem detectada

### Fase 4: Selector de Linguagem
- [ ] Criar componente de dropdown
- [ ] Listar linguagens populares
- [ ] Carregar linguagens sob demanda
- [ ] Persistir seleção no state

### Fase 5: Funcionalidades Avançadas
- [ ] Adicionar switch de tema
- [ ] Implementar debounce para performance
- [ ] Adicionar keyboard shortcuts
- [ ] Suporte a tab/indentação

### Fase 6: Integração Homepage
- [ ] Substituir CodeEditor atual pelo novo
- [ ] Conectar com estado global (se necessário)
- [ ] Testar com código real do usuário

## 6. Perguntas para Esclarecimento

### 6.1 Escopo do Editor
1. **O editor deve ser somente leitura (display) ou editável?**
   - Com base na homepage atual, parece ser editável
   - Ray-so usa para gerar imagens (display only), mas kita我们需要 editing

2. **Quantas linhas de código esperamos suportar?**
   - 10-50 linhas: fluxo normal
   - 100+ linhas: precisa de virtualização
   - 1000+ linhas:要考虑 performance

### 6.2 Detecção de Linguagem
3. **Devemos usar auto-detecção por padrão ou manual?**
   - Auto: melhor UX mas pode falhar
   - Manual: mais control mas mais clicks
   - Híbrido: auto por padrão, usuario pode mudar

4. **Qual biblioteca de detecção prefere?**
   - flourite: leve, simples, boa precisão
   - guesslang-js: ML-based, mais pesado
   - highlight.js: já incluso no projeto?

### 6.3 Interface
5. **O seletor de linguagem deve estar sempre visível?**
   - Opção A: Sempre visível na toolbar
   - Opção B: Só mostrar quando clicado
   - Opção C: Auto-detectado, mostrar só quando mudar

6. **Line numbers devem estar ativados por padrão?**
   - No Pencil:SIM (parece ter números)

### 6.4 Performance
7. **Qual o tempo máximo aceitável para highlighting?**
   - < 100ms: ideal
   - 100-300ms: aceitável
   - > 300ms: precisa de loading state

8. **Devemos usar Web Worker para highlighting?**
   - Sim, se código > 100 linhas
   - Não, se código < 50 linhas (overhead)

### 6.5 Integração
9. **O código do usuário deve ser enviado para o backend para análise?**
   - Se sim: precisamos de endpoint de roast
   - Se não: apenas display local

10. **Devemos persistir o código no localStorage?**
    - Sim: para session recovery
    - Não: apenas transient

## 7. Dependencies a Instalar

```json
{
  "dependencies": {
    "shiki": "^1.0.0",           // Já instalado
    "flourite": "^1.0.0",       // Detecção de linguagem (opcional)
    "jotai": "^2.8.0",          // Estado (opcional - pode usar useState)
    "lodash.debounce": "^4.0.8" // Performance (opcional)
  }
}
```

## 8. Referências

- [Ray-so GitHub](https://github.com/raycast/ray-so)
- [Shiki Documentation](https://shiki.style)
- [Shiki Themes](https://shiki.style/themes)
- [Flourite - Language Detector](https://github.com/TechnoGate/flourite)
- [Highlight.js](https://highlightjs.org/)

---

**Documento criado em:** Mars 2026
**Última atualização:** Mars 2026
