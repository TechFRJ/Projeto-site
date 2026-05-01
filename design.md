# FARJ Digital — Design System

## Conceito

**"Deep Tech Precision"** — Precisão técnica com profundidade visual. A identidade combina o rigor de um produto de tecnologia com a presença de uma marca premium. Fundo quase-preto em azul profundo, tipografia geométrica poderosa, animações impactantes e detalhes que comunicam competência técnica sem frieza.

---

## Paleta de Cores

| Token              | Valor       | Uso                                  |
|--------------------|-------------|--------------------------------------|
| `--bg-void`        | `#050C18`   | Fundo mais escuro (hero, footer)     |
| `--bg-deep`        | `#070E1A`   | Fundo principal do body              |
| `--bg-dark`        | `#0A1628`   | Seção de serviços                    |
| `--bg-mid`         | `#0D1F3C`   | Cards de serviço                     |
| `--bg-light`       | `#112447`   | Elementos interativos / hover states |
| `--blue-electric`  | `#2D7EFF`   | Cor de destaque principal            |
| `--blue-glow`      | `#1A5FD8`   | Gradiente do logo e botões           |
| `--blue-dim`       | `#1A3E7A`   | Scrollbar, bordas secundárias        |
| `--white`          | `#F0F6FF`   | Texto principal (branco frio)        |

**Transparências do branco:**
- `--w80` = 80% → subtítulos, links nav
- `--w50` = 50% → texto de apoio, descriptions
- `--w20` = 20% → bordas, hints
- `--w08` = 8%  → backgrounds hover sutis
- `--w04` = 4%  → superfícies muito sutis

---

## Tipografia

### Fontes
| Função   | Família         | Pesos     | Uso                               |
|----------|-----------------|-----------|-----------------------------------|
| Display  | **Syne**        | 700, 800  | Títulos de seção, hero, nav logo  |
| Body     | **DM Sans**     | 300, 400, 500 | Corpo de texto, formulários   |
| Mono     | **JetBrains Mono** | 400, 500 | Labels de seção, admin btn, preços |

### Escala tipográfica
- Hero H1: `clamp(52px, 9vw, 96px)` — Syne 800
- Section H2: `clamp(34px, 5vw, 54px)` — Syne 800
- Card H3: `20px` — Syne 700
- Body text: `16px` — DM Sans 400
- Labels/Mono: `10–12px` — JetBrains Mono 500

### Características
- `letter-spacing: -0.035em` nos títulos grandes (esmaga levemente para parecer mais premium)
- `letter-spacing: 0.14em` em labels monospace (abre para leitura técnica)
- `line-height: 1.0` nos títulos de hero; `1.65–1.75` no corpo de texto

---

## Componentes

### Navegação
- **Transparente por padrão**, se torna `rgba(5,12,24,.92)` com `backdrop-filter: blur(20px)` ao rolar 50px
- Logo: marca quadrada com gradiente elétrico + nome em Syne
- Links: uppercase, letter-spaced, underline animado (largura 0→100% no hover)
- Botão Admin: outline com fonte mono, `// Admin` para reforçar identidade técnica
- Mobile: hamburger revela menu vertical com backdrop blur

### Hero
- **Canvas WebGL-lite**: partículas azuis flutuando com linhas de conexão (constelação)
- **Grid CSS**: linhas horizontais e verticais `rgba(45,126,255,.035)`, com mask radial para sumir nas bordas
- **Glow central**: radial-gradient pulsante (animação `pulse-glow`)
- Badge "Disponível para novos projetos" com dot piscante
- Scroll indicator: linha vertical com animação de compressão

### Cards de Serviço
- Fundo `--bg-mid` com borda `rgba(45,126,255,.15)`
- Linha no topo (`::before`) que aparece no hover (gradiente azul transparente→elétrico→transparente)
- Hover: `translateY(-5px)` + `box-shadow: 0 0 44px rgba(45,126,255,.16)` + borda mais visível
- Ícone em caixa com fundo `rgba(45,126,255,.10)` e borda fina
- Preço em `--blue-electric`, Syne 800, 30px

### Formulário de Contato
- Layout duas colunas (info à esquerda, formulário à direita)
- Inputs com fundo `--bg-dark`, borda `--border`, glow azul no focus
- Botão submit: gradiente azul com `box-shadow` de glow
- Link WhatsApp: verde escuro translúcido, totalmente separado do visual azul
- Status de feedback: verde (sucesso) ou vermelho (erro) translúcido

### Botões
| Variante       | Aparência                                        |
|----------------|--------------------------------------------------|
| `.btn-primary` | Fundo `--blue-electric` + glow 32px             |
| `.btn-ghost`   | Transparente + borda branca 20%                 |
| `.btn-submit`  | Full-width, Syne 700, glow azul + hover lift    |

---

## Animações

### Hero (entrada)
- `@keyframes fade-up`: `opacity 0 + translateY(26px)` → visível
- Stagger com `animation-delay`: badge (0s), título (0.15s), subtítulo (0.30s), botões (0.45s), scroll hint (0.70s)

### Scroll Reveal
- Classe `.reveal`: `opacity:0 + translateY(32px)` → `.in` remove o transform
- Classe `.stagger`: aplica `.in` aos filhos com delays `0s, 0.1s, 0.2s, 0.3s`
- `IntersectionObserver` com `threshold: 0.08`

### Micro-interações
- Nav underline: `width 0→100%` em `.3s ease`
- Cards: `transform + box-shadow + border-color` em `.35s ease`
- Botões: `translateY(-2px) + box-shadow expand` em `.25s ease`
- Glow do hero: `pulse-glow` 5s infinite (scale 1→1.12)
- Dot do badge: `blink` 2.2s infinite (opacity 1→0.25)
- Scroll line: `scroll-pulse` 2s (scaleY 1→0.55)

### Partículas (canvas)
- N partículas proporcional à área (`W*H / 11000`, máx 120)
- Cada partícula: posição aleatória, velocidade `±0.38px/frame`, raio `0.4–1.8px`
- Linhas de conexão para pares com distância `< 140px`, opacidade proporcional à distância
- Loop via `requestAnimationFrame`
- `ResizeObserver` para recriar quando o container redimensiona

---

## Layout

### Espaçamento
- Sections: `padding: 110px 0`
- Container: `max-width: 1200px`, `padding: 0 28px`
- Cards grid: `gap: 20px`, `auto-fit minmax(260px, 1fr)`
- Contact layout: `gap: 80px` (colunas), `grid-template-columns: 1fr 1.1fr`

### Breakpoints
| Breakpoint | Mudança                                           |
|------------|---------------------------------------------------|
| `< 900px`  | Contato passa para 1 coluna; footer 2 colunas     |
| `< 640px`  | Nav collapsa em hamburger; footer 1 coluna        |

---

## Identidade Visual

### Logo
- Marca: quadrado com `border-radius: 8px`, gradiente `#2D7EFF → #1A5FD8`
- Texto: "FARJ" branco + "Digital" em `--blue-electric`
- Glow: `box-shadow: 0 0 20px rgba(45,126,255,.40)`

### Section Labels
- Formato: `// nome-da-secao` em JetBrains Mono
- Cor: `--blue-electric`
- Propósito: reforçar o tom técnico/dev da marca

### Divisor de seção
- Linha de 48×2px em `--blue-electric`
- Separador visual entre o heading e o conteúdo

---

## Acessibilidade

- `aria-label` em nav, seções e elementos interativos
- `aria-hidden="true"` em elementos decorativos (canvas, grid, glow)
- `role="status"` no badge de disponibilidade
- `role="alert" + aria-live="polite"` no status do formulário
- `aria-expanded` no botão hamburger mobile
- Focus visible com outline `2px solid var(--blue-electric)`
- Contraste: texto branco sobre fundos escuros passa WCAG AA

---

## Arquivos

| Arquivo                  | Responsabilidade                        |
|--------------------------|-----------------------------------------|
| `public/index.html`      | HTML + CSS inline completo do design    |
| `src/js/main.js`         | Lógica: serviços, formulário, WhatsApp  |
| `src/css/main.css`       | Estilos utilitários legados (scrollbar, print) |
| `design.md`              | Este documento — referência do design   |
