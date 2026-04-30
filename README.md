# FARJ Digital - Landing Page & Admin Dashboard

Plataforma profissional para apresentar serviços de desenvolvimento, com painel administrativo para gerenciar preços.

## 🚀 Features

- 📱 **Landing Page Responsiva** - Página única com scroll suave
- 💰 **Preços Dinâmicos** - Carregados do banco de dados
- 📧 **Formulário de Contato** - Com envio automático de email
- 🔐 **Painel Admin Protegido** - Autenticação via OAuth (Google/GitHub)
- 📊 **Gerenciar Preços** - Editar preços dos serviços em tempo real
- 💬 **Integração WhatsApp** - Link direto para contato
- 🎨 **Design Moderno** - Tailwind CSS + Logos FARJ Digital

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** HTML5 + Tailwind CSS + Vanilla JavaScript
- **Autenticação:** Passport.js + OAuth 2.0 (Google/GitHub)
- **Database:** SQLite (padrão) ou MongoDB
- **Email:** Nodemailer

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Google (para OAuth)

## 🚀 Quick Start

### 1. Instalação

```bash
# Clone o repositório
cd /home/user/Projeto-site

# Instale as dependências
npm install

# Copie o arquivo de ambiente
cp .env.example .env
```

### 2. Configuração

Edite o arquivo `.env` com suas informações:

```env
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
WHATSAPP_NUMBER=55XXXXXXXXXXX
```

### 3. Executar

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

Acesse:
- **Landing Page:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin

## 📖 Documentação

Para documentação detalhada sobre estrutura do projeto, desenvolvimento e deployment, veja [CLAUDE.md](./CLAUDE.md).

## 🏗️ Estrutura

```
projeto-site/
├── public/           # Arquivos estáticos (HTML, logos, assets)
├── src/              # CSS e JavaScript frontend
├── server/           # Backend (Express, rotas, modelos)
├── admin/            # Dashboard administrativo
├── CLAUDE.md         # Documentação para AI assistants
└── package.json      # Dependências
```

## 🔑 Serviços

O site apresenta 4 serviços principais:

1. **Desenvolvimento de Sites** - R$ 3.000
2. **Instalação de Servidores** - R$ 1.500
3. **Desenvolvimento de Sistemas** - R$ 5.000
4. **Landing Pages** - R$ 2.000

## 🔐 Autenticação

### Para Usuários Finais
- Formulário de contato público (sem autenticação)
- Link WhatsApp direto

### Para Admin
- Login via Google OAuth
- Acesso protegido ao painel de preços
- Gerenciamento de serviços

## 📧 Email

O formulário de contato envia emails para `CONTACT_EMAIL` configurado em `.env`.

Você pode usar:
- Gmail (com app password)
- SendGrid
- Outro serviço SMTP

## 🌐 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Railway

```bash
npm install -g @railway/cli
railway up
```

### Heroku

```bash
git push heroku main
```

## 🐛 Troubleshooting

**Problema:** Servidor não inicia
- Verifique `npm install`
- Verifique arquivo `.env`
- Porta 3000 já em uso?

**Problema:** OAuth não funciona
- Verifique `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
- Confirme redirect URI no Google Console

**Problema:** Emails não enviam
- Verifique credenciais Gmail
- Use app password, não senha da conta
- Confirme `CONTACT_EMAIL` válido

## 📝 Licença

MIT License - Copyright (c) 2026 farjAries

## 👤 Autor

**FARJ Digital**

## 📞 Contato

- WhatsApp: [Link dinâmico no site]
- Email: contato@farjdigital.com.br

---

Para desenvolvimento e documentação técnica, veja [CLAUDE.md](./CLAUDE.md).
