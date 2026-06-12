# Novo Design — Plano de Melhorias

Documento de implementação para 3 mudanças na landing FARJ Digital. Mantém tokens e identidade do `design.md` (Deep Tech Precision).

---

## Sumário das Mudanças

1. **Estrelas animadas em toda a `<section id="inicio">`** — não só no `.hero-visual`.
2. **Nova seção "Sobre mim"** — foto pessoal + bio curta.
3. **Nova seção "Trabalhos"** — portfólio com cards (imagem, descrição, link).

---

## 1. Estrelas/Constelação no Hero Inteiro

### Estado atual
- `.hero-visual` (coluna direita) contém `canvas#particles-canvas` (`position: absolute; inset: 0`), `.hero-glow`, `.hero-orbit.orbit-1`, `.hero-orbit.orbit-2`, `.hero-rocket`.
- Animação fica restrita a 50% do hero no desktop.

### Objetivo
- Canvas de estrelas/partículas cobre **a `.hero` inteira** como background. Foguete + órbitas + glow continuam centrados na coluna direita.

### Estrutura HTML proposta
Mover canvas pra fora do `.hero-visual` e colar como background do `.hero`:

```html
<section id="inicio" class="hero">
  <canvas id="particles-canvas" class="hero-stars" aria-hidden="true"></canvas>
  <div class="hero-inner">
    <div class="hero-content">…</div>
    <div class="hero-visual">
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="hero-orbit orbit-1" aria-hidden="true"></div>
      <div class="hero-orbit orbit-2" aria-hidden="true"></div>
      <div class="hero-rocket" aria-hidden="true"><i data-lucide="rocket"></i></div>
    </div>
  </div>
</section>
```

### CSS necessário
```css
.hero { position: relative; overflow: hidden; }

.hero-stars {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.hero-inner { position: relative; z-index: 2; }
.hero::before { z-index: 1; }              /* gradiente radial existente acima das estrelas */

/* Remover regra antiga .particles-canvas (era inset no .hero-visual) */
```

### JS — partículas full-hero
Substituir o init de `particles-canvas` em `src/js/main.js` (ou `animations.js`) para usar o tamanho do `<section id="inicio">`:

```js
const canvas = document.getElementById('particles-canvas');
const hero = document.getElementById('inicio');
const ctx = canvas.getContext('2d');

const STAR_COUNT = window.innerWidth < 768 ? 60 : 140;
const LINK_DIST = 110;
let stars = [];
let dpr = Math.max(1, window.devicePixelRatio || 1);

function resize() {
  const r = hero.getBoundingClientRect();
  canvas.width = r.width * dpr;
  canvas.height = r.height * dpr;
  canvas.style.width = r.width + 'px';
  canvas.style.height = r.height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function spawn() {
  const r = hero.getBoundingClientRect();
  stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * r.width,
    y: Math.random() * r.height,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    r: Math.random() * 1.4 + 0.4,
    tw: Math.random() * Math.PI * 2,           // fase do twinkle
  }));
}
function draw() {
  const r = hero.getBoundingClientRect();
  ctx.clearRect(0, 0, r.width, r.height);

  // Linhas de conexão (constelação)
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const d = Math.hypot(dx, dy);
      if (d < LINK_DIST) {
        ctx.strokeStyle = `rgba(96,170,255,${0.18 * (1 - d / LINK_DIST)})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.stroke();
      }
    }
  }

  // Estrelas com twinkle
  for (const s of stars) {
    s.x += s.vx; s.y += s.vy; s.tw += 0.03;
    if (s.x < 0 || s.x > r.width)  s.vx *= -1;
    if (s.y < 0 || s.y > r.height) s.vy *= -1;
    const alpha = 0.55 + Math.sin(s.tw) * 0.35;
    ctx.fillStyle = `rgba(180,210,255,${alpha})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  }
  raf = requestAnimationFrame(draw);
}

let raf;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
resize(); spawn();
if (!reduced) draw();
addEventListener('resize', () => { resize(); spawn(); });
```

### Regras seguidas (ui-ux-pro-max)
- `reduced-motion`: respeita `prefers-reduced-motion`.
- `transform-performance`: usa `requestAnimationFrame`, sem layout thrash.
- `safe-area-awareness`: canvas `pointer-events: none` (não bloqueia tap dos botões).
- Densidade de partículas reduz em mobile (perf).

---

## 2. Seção "Sobre Mim"

### Posição
Inserir **entre `#processo` e `#contato`** com `id="sobre"`. Adicionar link `<a href="#sobre">Sobre</a>` em `.nav-links`, `.nav-mobile ul` e footer.

### HTML
```html
<section id="sobre" class="section about-section">
  <div class="container">
    <div class="about-grid">
      <div class="about-photo reveal">
        <div class="about-photo-frame">
          <img src="/assets/images/fernando.jpg"
               alt="Fernando — Fundador FARJ Digital"
               width="480" height="600" loading="lazy">
          <div class="about-photo-glow" aria-hidden="true"></div>
        </div>
      </div>
      <div class="about-content reveal" style="--delay:120ms">
        <div class="section-tag">Quem está por trás</div>
        <h2>Olá, eu sou <span class="text-blue">Fernando</span></h2>
        <p class="about-lead">
          Desenvolvedor web freelancer apaixonado por transformar ideias em
          produtos digitais que funcionam de verdade.
        </p>
        <p>
          Há X anos construo sites, sistemas e automações para empresas no Brasil
          inteiro. Foco em código limpo, performance e processo claro — do briefing
          até o deploy final.
        </p>
        <ul class="about-skills">
          <li><i data-lucide="code-2"></i> Full-stack JavaScript</li>
          <li><i data-lucide="server"></i> Node.js &amp; servidores</li>
          <li><i data-lucide="zap"></i> Automações &amp; bots</li>
          <li><i data-lucide="palette"></i> Design centrado no usuário</li>
        </ul>
        <a href="#contato" class="btn-primary">Vamos conversar</a>
      </div>
    </div>
  </div>
</section>
```

### CSS
```css
.about-section { background: white; }

.about-grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 4rem;
  align-items: center;
}

.about-photo-frame {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  aspect-ratio: 4 / 5;
}
.about-photo-frame img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}
.about-photo-glow {
  position: absolute;
  inset: -20% -20% auto auto;
  width: 60%; height: 60%;
  background: radial-gradient(circle, rgba(0,128,255,0.35), transparent 70%);
  filter: blur(40px);
  pointer-events: none;
  z-index: -1;
}

.about-lead {
  font-size: 1.15rem;
  color: var(--text);
  margin: 0.75rem 0 1rem;
  font-weight: 500;
}
.about-content > p { color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.7; }

.about-skills {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem 1.25rem;
  margin: 1.5rem 0 2rem;
}
.about-skills li {
  display: flex; align-items: center; gap: 0.6rem;
  font-size: 0.92rem; color: var(--text);
  font-weight: 500;
}
.about-skills i { color: var(--blue-light); }

@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .about-skills { grid-template-columns: 1fr; }
}
```

### Asset necessário
- `public/assets/images/fernando.jpg` (recomendo 960×1200, WebP otimizado, ~150KB).
- Texto da bio + anos de experiência: substituir `X anos`.

### A11y
- `alt` descritivo (já incluso).
- Contraste texto/branco ≥ 4.5:1 (`var(--text-muted)` = #64748b passa em fundo branco).

---

## 3. Seção "Trabalhos" (Portfólio)

### Posição
Inserir **entre `#servicos` e `#processo`** com `id="trabalhos"`. Adicionar link `<a href="#trabalhos">Trabalhos</a>` em nav e footer.

### HTML
```html
<section id="trabalhos" class="section works-section">
  <div class="container">
    <div class="section-header reveal">
      <div class="section-tag">Portfólio</div>
      <h2>Projetos <span class="text-blue">entregues</span></h2>
      <p>Uma seleção de trabalhos recentes — cada um construído do zero com foco no problema do cliente.</p>
    </div>

    <div class="works-grid">
      <article class="work-card reveal" style="--delay:0ms">
        <a href="https://link-do-projeto-1.com" target="_blank" rel="noopener noreferrer" class="work-link">
          <div class="work-thumb">
            <img src="/assets/images/works/projeto-1.jpg"
                 alt="Captura de tela do Projeto 1"
                 width="800" height="500" loading="lazy">
          </div>
          <div class="work-body">
            <span class="work-tag">Landing page</span>
            <h3>Nome do Projeto 1</h3>
            <p>Descrição curta: que problema resolveu, stack usada, resultado.</p>
            <span class="work-cta">Ver projeto <i data-lucide="arrow-up-right"></i></span>
          </div>
        </a>
      </article>

      <article class="work-card reveal" style="--delay:100ms">
        <a href="https://link-do-projeto-2.com" target="_blank" rel="noopener noreferrer" class="work-link">
          <div class="work-thumb">
            <img src="/assets/images/works/projeto-2.jpg" alt="Captura de tela do Projeto 2" width="800" height="500" loading="lazy">
          </div>
          <div class="work-body">
            <span class="work-tag">Sistema web</span>
            <h3>Nome do Projeto 2</h3>
            <p>Descrição do projeto e papel desempenhado.</p>
            <span class="work-cta">Ver projeto <i data-lucide="arrow-up-right"></i></span>
          </div>
        </a>
      </article>

      <article class="work-card reveal" style="--delay:200ms">
        <a href="https://link-do-projeto-3.com" target="_blank" rel="noopener noreferrer" class="work-link">
          <div class="work-thumb">
            <img src="/assets/images/works/projeto-3.jpg" alt="Captura de tela do Projeto 3" width="800" height="500" loading="lazy">
          </div>
          <div class="work-body">
            <span class="work-tag">Automação</span>
            <h3>Nome do Projeto 3</h3>
            <p>Descrição do projeto e papel desempenhado.</p>
            <span class="work-cta">Ver projeto <i data-lucide="arrow-up-right"></i></span>
          </div>
        </a>
      </article>
    </div>
  </div>
</section>
```

### CSS
```css
.works-section { background: var(--bg-alt); }

.works-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.work-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}
.work-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(0,128,255,0.18);
}

.work-link { display: block; color: inherit; }

.work-thumb {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg-alt);
}
.work-thumb img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.work-card:hover .work-thumb img { transform: scale(1.04); }

.work-body { padding: 1.5rem; }
.work-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--blue-light);
  background: var(--blue-glow);
  padding: 0.25rem 0.7rem;
  border-radius: 100px;
  margin-bottom: 0.75rem;
}
.work-body h3 {
  font-family: 'Syne', sans-serif;
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
  color: var(--text);
}
.work-body p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1rem;
}
.work-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--blue);
  transition: gap 0.2s, color 0.2s;
}
.work-card:hover .work-cta { gap: 0.6rem; color: var(--blue-light); }
.work-cta i { width: 1em; height: 1em; }

@media (max-width: 1024px) {
  .works-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .works-grid { grid-template-columns: 1fr; }
}
```

### Assets
- Pasta `public/assets/images/works/` com 1 imagem por projeto (recomendo 1600×1000, WebP, ~120KB cada).
- Substituir `Nome do Projeto N`, descrições e URLs.

### Opção: dados via JSON
Para manutenção fácil, mover lista pra `src/data/works.json` e renderizar via JS (mesmo padrão dos services). Estrutura sugerida:
```json
[
  {
    "id": "projeto-1",
    "tag": "Landing page",
    "titulo": "Nome do Projeto",
    "descricao": "Descrição curta…",
    "imagem": "/assets/images/works/projeto-1.jpg",
    "link": "https://…"
  }
]
```

---

## Atualizações na Navegação

Adicionar 2 links no `<ul class="nav-links">`, no `.nav-mobile ul` e nos `.footer-links` (Navegação):

```html
<li><a href="#trabalhos">Trabalhos</a></li>
<li><a href="#sobre">Sobre</a></li>
```

Ordem sugerida: `Início → Serviços → Trabalhos → Processo → Sobre → Contato`.

> **`bottom-nav-limit` / `nav-overflow`**: 6 itens ainda OK em desktop. No mobile, todos visíveis no drawer.

---

## Checklist Pré-Entrega

- [ ] Canvas estrelas cobre `.hero` inteiro, sem bloquear cliques (`pointer-events: none`).
- [ ] `prefers-reduced-motion` desliga animação de partículas.
- [ ] Foto pessoal otimizada (WebP, `loading="lazy"`, `width`/`height` declarados → CLS = 0).
- [ ] Cada card de trabalho com `alt` descritivo e link `target="_blank" rel="noopener noreferrer"`.
- [ ] Links de nav novos funcionam (scroll suave já habilitado por `html { scroll-behavior: smooth }`).
- [ ] Mobile: testar em 375px — grids reduzem corretamente.
- [ ] Contraste texto sobre branco (about-section) e bg-alt (works-section) ≥ 4.5:1.
- [ ] Tab order lógica: nav → hero CTA → serviços → trabalhos → sobre → contato.
- [ ] Lighthouse Performance ≥ 90 mantido (lazy load + dimensões declaradas).

---

## Ordem Sugerida de Implementação

1. **Estrelas full-hero** (mexe só no JS + 2 regras CSS).
2. **Seção Sobre** (HTML + CSS + asset da foto).
3. **Seção Trabalhos** (HTML + CSS + assets das thumbs).
4. **Atualizar nav/footer** (4 lugares).
5. **Teste manual** em desktop + mobile + dark mode do SO.
