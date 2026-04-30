# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**FARJ Digital** is a professional landing page with an admin dashboard for managing service prices.

- **Purpose:** Showcase web development, server installation, system development, and landing page services
- **Type:** Single-page landing page with dynamic pricing + protected admin panel
- **Tech Stack:** Node.js + Express (backend), HTML5 + Tailwind CSS (frontend), SQLite/MongoDB (database), OAuth 2.0 (authentication)
- **Licensed:** MIT (farjAries)

### Key Features
- Public landing page with dynamically loaded service prices
- Contact form with email notifications
- WhatsApp integration (direct link)
- Admin dashboard (OAuth-protected) for managing prices
- Responsive design (mobile-first)

---

## Project Structure

```
projeto-site/
├── public/                    # Static files (served to clients)
│   ├── index.html            # Main landing page
│   ├── favicon.ico
│   └── assets/
│       ├── logos/            # 3 FARJ Digital logo variations
│       │   ├── logo-dark.svg
│       │   ├── logo-light.svg
│       │   └── logo-icon.svg
│       ├── images/           # Screenshots, service images
│       └── fonts/            # Custom fonts if needed
│
├── src/                       # Frontend source (CSS, JS)
│   ├── css/
│   │   ├── main.css          # Tailwind + custom styles
│   │   └── animations.css    # Parallax, fade-in effects
│   ├── js/
│   │   ├── main.js           # Entry point
│   │   ├── form.js           # Contact form logic
│   │   ├── scroll.js         # Smooth scroll, navbar
│   │   └── animations.js     # Intersection Observer animations
│   └── data/
│       └── whatsapp.json     # WhatsApp number config
│
├── server/                    # Backend (Node.js/Express)
│   ├── api.js                # Main Express server
│   ├── config.js             # Environment & DB setup
│   ├── middleware/
│   │   └── auth.js           # OAuth & session verification
│   ├── routes/
│   │   ├── auth.js           # GET /auth/google, /auth/logout
│   │   ├── contact.js        # POST /api/contact
│   │   └── admin.js          # GET/PATCH /api/admin/services/:id
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── Service.js        # Service schema (name, price, icon)
│   │   └── Contact.js        # Contact submission schema
│   └── emails/
│       └── templates/        # Email templates
│
├── admin/                     # Admin dashboard (separate page)
│   ├── index.html            # Admin UI (login + price management)
│   └── js/
│       ├── admin.js          # Manage services, edit prices
│       └── auth-check.js     # Verify OAuth session
│
├── .env.example              # Template for environment variables
├── .gitignore                # Files to ignore in git
├── package.json              # Dependencies & scripts
├── CLAUDE.md                 # This file
├── README.md                 # User-facing documentation
└── LICENSE                   # MIT License
```

---

## Environment Setup

### Prerequisites
- **Node.js** 18+ and npm
- **Database:** SQLite (default, local file) or MongoDB (optional, cloud or local)
- **OAuth Provider:** Google Cloud Console (for OAuth credentials)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd /home/user/Projeto-site
   npm install
   ```

2. **Create `.env` from template:**
   ```bash
   cp .env.example .env
   ```

3. **Configure `.env` file:**
   - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (from Google Cloud Console)
   - Set `EMAIL_USER` and `EMAIL_PASS` (Gmail app password)
   - Set `CONTACT_EMAIL` (where form submissions go)
   - Set `SESSION_SECRET` (any random string)
   - Set `WHATSAPP_NUMBER` (your WhatsApp business number)
   - For MongoDB, change `DB_TYPE=mongodb` and set `MONGODB_URI`

### Google OAuth Setup
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Secret to `.env`

---

## Running the Project

### Development Mode
```bash
npm run dev
```
- Starts server on `http://localhost:3000`
- Automatically restarts on file changes (`--watch` flag)
- Landing page: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/admin` (requires OAuth login)

### Production Mode
```bash
npm start
```
- Starts server on port specified in `.env` (default 3000)

### Build for Production
```bash
npm run build
```
- Minifies CSS/JS (add build script if using bundler)

---

## Data Structure

### Services (Database Model)

All services are stored in the database with this structure:

```javascript
{
  id: "desenvolvimento-sites",           // Unique ID (slug format)
  nome: "Desenvolvimento de Sites",      // Service name
  descricao: "Sites responsivos...",     // Short description
  preco: 3000,                           // Price in BRL (cents or units)
  icone: "globe",                        // Icon identifier
  detalhes: "Detailed description..."    // Long description
}
```

**Default services (seeded on first run):**
1. Desenvolvimento de Sites - R$ 3000
2. Instalação de Servidores - R$ 1500
3. Desenvolvimento de Sistemas - R$ 5000
4. Landing Pages - R$ 2000

### Database Files
- **SQLite:** `database.sqlite3` (local file, created automatically)
- **MongoDB:** Cloud database (URI in `.env`)

---

## API Endpoints

### Public Endpoints

#### GET `/api/services`
Returns all services with current prices.
```json
[
  {
    "id": "desenvolvimento-sites",
    "nome": "Desenvolvimento de Sites",
    "preco": 3000,
    "icone": "globe"
  }
]
```

#### POST `/api/contact`
Submit contact form.
```json
{
  "nome": "John Doe",
  "email": "john@example.com",
  "mensagem": "Olá, quero um site..."
}
```
Response: `{ status: 200, message: "Email enviado com sucesso" }`

#### GET `/auth/google`
Redirects to Google OAuth login.

#### GET `/auth/google/callback`
OAuth callback (handled automatically by Passport).

#### GET `/auth/logout`
Logs out current user and clears session.

### Admin Endpoints (Protected - requires OAuth login)

#### GET `/api/admin/services`
Returns all services (admin has full access).

#### PATCH `/api/admin/services/:id`
Update a service's price or details.
```json
{
  "preco": 3500,
  "descricao": "Updated description"
}
```

#### POST `/api/admin/services`
Create a new service (future use).

---

## Frontend Architecture

### Landing Page (`public/index.html`)

**Sections:**
1. **Navigation:** Logo + nav links + Admin button (hidden on mobile)
2. **Hero:** Call-to-action + main image
3. **Services:** Grid of 4 service cards (price loaded dynamically)
4. **Contact Form:** Name, email, message
5. **WhatsApp CTA:** Direct link to WhatsApp
6. **Footer:** Copyright, social links

**Dynamic Loading:**
- On page load, `src/js/main.js` calls `GET /api/services`
- Services are rendered into cards with prices
- If API fails, fallback prices from `services.json` are used

### Admin Dashboard (`admin/index.html`)

**Features:**
1. **Login Check:** On load, verify OAuth session (`/api/auth/check`)
2. **Service Table:** List all services with current prices
3. **Edit Modal:** Click "Editar" to open price editor
4. **Save:** PATCH `/api/admin/services/:id` updates database
5. **Logout:** Clear session and redirect to landing page

**Auth Flow:**
- If not logged in, redirect to `/auth/google`
- After OAuth callback, session is created
- Admin dashboard checks session on each load

---

## Contact Form Flow

```
1. User fills form (name, email, message)
2. Client-side validation (src/js/form.js)
3. POST /api/contact with JSON payload
4. Server validates & sanitizes inputs
5. Saves submission to database
6. Sends email via Nodemailer to CONTACT_EMAIL
7. Returns success response
8. Frontend shows confirmation message
```

**Email Sent To:** `CONTACT_EMAIL` env variable

---

## Managing Services (Admin Tasks)

### Add a New Service
1. Open admin dashboard (`/admin`)
2. Click "Adicionar Serviço" (if button exists)
3. Fill form: name, description, price, icon
4. Submit → saves to database

### Edit Service Price
1. Open admin dashboard
2. Find service in table
3. Click "Editar"
4. Change price in modal
5. Click "Salvar" → PATCH request updates database
6. Landing page refetches prices automatically

### Delete a Service (future)
- Currently not implemented; would require DELETE endpoint

### Seed Initial Data
- On first run with empty database, `server/config.js` seeds 4 default services
- Or manually insert via admin dashboard

---

## Styling & Design

### Tailwind CSS
- All UI components use Tailwind utility classes
- Configuration: `tailwind.config.js` (if exists)
- Custom colors/fonts defined in Tailwind config

### CSS Files
- `src/css/main.css` — Tailwind imports + custom styles
- `src/css/animations.css` — Smooth scroll, fade-in, parallax effects

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Color Scheme
- **Primary:** Blue (#0066FF or from Tailwind)
- **Text:** Dark gray/black
- **Background:** White with subtle grays
- **Logos:** 3 variations (dark, light, icon) for different contexts

---

## Common Development Tasks

### Modify Service Description
1. Open `server/models/Service.js` or database directly
2. Edit the `detalhes` field
3. Restart server or use admin dashboard

### Add a New Page (future)
1. Create `public/pages/[name].html`
2. Add route in `server/routes/pages.js`
3. Link from navigation
4. Follow same CSS/JS structure

### Change WhatsApp Number
1. Edit `src/data/whatsapp.json` with new number
2. Or update `WHATSAPP_NUMBER` in `.env`
3. Restart server (for env changes)

### Update Logo
1. Replace SVG files in `public/assets/logos/`
2. Ensure filenames match HTML references
3. No server restart needed (static files)

### Modify Navigation Links
1. Edit `public/index.html` navigation section
2. Add new `<a>` tags with appropriate href
3. Update active state logic in `src/js/scroll.js`

---

## Deployment

### Prepare for Production

1. **Update `.env` with production values:**
   ```
   NODE_ENV=production
   GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
   # Use secure email service (SendGrid, etc.)
   # Use MongoDB Atlas or managed database
   ```

2. **Set up database:** MongoDB Atlas or SQLite backup

3. **Verify all secrets:** No `.env` in git, use secrets management

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Link custom domain
```

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway up

# Configure env vars in Railway dashboard
```

### Deploy to Other Platforms
- **Heroku:** `git push heroku main` + add buildpack
- **Render:** Connect Git repo + set env vars
- **AWS/GCP:** Use serverless functions or VMs

---

## Debugging & Troubleshooting

### Server Won't Start
- Check `npm install` completed
- Verify `.env` file exists and has required vars
- Check port 3000 not in use: `lsof -i :3000`
- Check Node version: `node -v` (should be 18+)

### OAuth Login Fails
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` correct
- Check redirect URI matches in Google Console and `.env`
- Clear browser cookies for `localhost`
- Check `.env` SESSION_SECRET is set

### Form Emails Not Sending
- Verify `EMAIL_USER` and `EMAIL_PASS` correct
- If using Gmail, enable "Less secure apps" or use app password
- Check `CONTACT_EMAIL` is valid
- Look for errors in server console

### Database Issues
- For SQLite: check `database.sqlite3` file exists in root
- For MongoDB: verify connection string and network access
- Check database has correct collections/tables

### Prices Not Updating on Landing Page
- Check `/api/services` returns new prices (test in Postman/curl)
- Clear browser cache (Ctrl+Shift+Delete)
- Restart server
- Check admin PATCH endpoint worked (check database directly)

### Admin Dashboard Unauthorized
- Verify you're logged in (should see user info)
- Check authorized email in `AUTHORIZED_ADMINS`
- Verify OAuth session still valid (logout and re-login)

---

## Code Conventions

### JavaScript
- Use `const`/`let` (no `var`)
- Use async/await (not `.then()` chains)
- File names: `camelCase.js`
- Functions: `camelCase()` for functions, `PascalCase` for classes
- Comments: Only for non-obvious logic

**Example:**
```javascript
// Fetch and render services
async function loadServices() {
  const response = await fetch('/api/services');
  const services = await response.json();
  renderServiceCards(services);
}
```

### HTML
- Semantic HTML5 tags: `<header>`, `<main>`, `<article>`, `<footer>`
- CSS classes: `kebab-case` (Tailwind utilities)
- IDs: Only for JavaScript targeting, `camelCase`
- Accessibility: `alt` text, `aria-labels` where needed

### CSS
- Use Tailwind classes first (don't write custom CSS unless necessary)
- Custom CSS in `src/css/main.css` for component-specific styles
- BEM notation for custom classes: `.block__element--modifier`
- Mobile-first: `@media` queries for larger screens

### File Organization
- Group related functions together
- Max file size: ~500 lines (split if larger)
- Export explicit functions only
- No circular dependencies

---

## Testing

### Manual Testing Checklist
- [ ] Landing page loads without errors
- [ ] Services display with correct prices
- [ ] Contact form validates empty fields
- [ ] Contact form submits and email received
- [ ] WhatsApp link opens WhatsApp app/web
- [ ] Admin login redirects to Google OAuth
- [ ] Admin dashboard loads after login
- [ ] Editing price updates in database
- [ ] Landing page refetch shows new price
- [ ] Logout clears session
- [ ] Mobile responsiveness (test on phone)

### Browser Testing
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### API Testing
```bash
# Test GET services
curl http://localhost:3000/api/services

# Test POST contact
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"nome":"Test","email":"test@test.com","mensagem":"Hi"}'
```

---

## Performance & SEO

### Lighthouse Targets
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95

### Optimization Tips
- Lazy load images with `loading="lazy"`
- Compress logos (use TinyPNG or similar)
- Minify CSS/JS in production
- Use HTTPS (auto on Vercel/Railway)
- Add meta tags for social sharing
- Optimize Core Web Vitals

### SEO Essentials
- `<title>` tag: "FARJ Digital - Desenvolvimento de Sites"
- `<meta description>`: Compelling summary
- Open Graph tags: `og:title`, `og:description`, `og:image`
- Structured data: JSON-LD for Organization

---

## Future Improvements

### Possible Enhancements
- Blog section (pages + CMS)
- Portfolio/case studies
- Client testimonials
- Booking/appointment system
- Multiple language support (i18n)
- Advanced analytics
- A/B testing for pricing

### Scalability Path
```
Landing Page (current)
    ↓
+ Blog & Case Studies
    ↓
+ Client Portal (login, view projects)
    ↓
+ Full SPA (React/Vue migration)
    ↓
+ Microservices (separate APIs)
```

---

## Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with auto-reload |
| `npm start` | Start production server |
| `npm run build` | Build for production |
| `npm install` | Install dependencies |
| `npm list` | List installed packages |
| `npm outdated` | Check for outdated packages |

---

## Useful Repositories & Resources

- **Express.js Docs:** https://expressjs.com
- **Tailwind CSS:** https://tailwindcss.com
- **Passport.js:** https://www.passportjs.org/
- **Mongoose Docs:** https://mongoosejs.com/
- **Nodemailer:** https://nodemailer.com/

---

## Commits & Branch Strategy

**Active Development Branch:** `claude/add-claude-documentation-JGlY1`

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body (optional)>

Example:
feat(admin): add price edit modal
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`

**Branches:**
- `main` — Production-ready code
- `dev` — Development branch
- `claude/*` — Feature branches for Claude Code

---

## Contact & Support

**Project Owner:** FARJ Digital
**Repository:** TechFRJ/Projeto-site

For questions or issues, refer to the Git commit history or README.md.
