# Nexivra

**AI-powered job seeker outreach with quality gates that verify every claim.**

🔗 **Live:** [nexivra.vercel.app](https://nexivra.vercel.app)

![Nexivra Screenshot](https://img.shields.io/badge/Status-Live-00ff88?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

---

## ✨ Features

### 🎯 4 Recipe Types
- **Recruiter DM** - LinkedIn connection requests (300 char limit)
- **Follow-up** - Second touch after no reply
- **Post Comment** - Engage without pitching
- **Cold Email** - Direct email outreach

### 🛡️ 7 Quality Gates
Every message is verified before you send:
1. **Length Check** - Within platform limits
2. **No Generic Openings** - Blocks "I'm reaching out..."
3. **No Tech Dumps** - Prevents listing 6 technologies
4. **Evidence Gate** - Verifies claims against your inputs
5. **Personalization** - Uses recipient's name
6. **No Desperate Language** - Blocks "just checking in..."
7. **Readability** - Ensures good sentence length

### 🔐 Authentication
- Google OAuth
- LinkedIn OAuth
- Powered by Clerk

### 📊 History & Drafts
- View all past generations
- Save favorites as drafts
- Regenerate with different tone
- Filter by recipe type

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Inline CSS (dark theme) |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude API |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Accounts: Clerk, Supabase, Anthropic, Vercel

### Installation

```bash
# Clone
git clone https://github.com/Nityaa2396/Nexivra.git
cd Nexivra

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run locally
npm run dev
```

### Environment Variables

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

## 📁 Project Structure

```
nexivra/
├── app/
│   ├── api/
│   │   └── generate/       # AI generation endpoint
│   ├── history/            # Generation history page
│   ├── recipes/
│   │   └── [id]/           # Recipe detail pages
│   ├── sign-in/            # Clerk auth pages
│   ├── sign-up/
│   ├── privacy/            # Privacy policy
│   └── page.tsx            # Landing page
├── components/
│   ├── Header.tsx          # Navigation with auth
│   ├── RecipeSelector.tsx  # Recipe cards
│   └── TestimonialCarousel.tsx
├── lib/
│   └── supabase.ts         # Database client
└── middleware.ts           # Route protection
```

---

## 🗄️ Database Schema

```sql
-- Users (synced with Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generations
CREATE TABLE generations (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  recipe_id TEXT NOT NULL,
  inputs JSONB NOT NULL,
  output TEXT NOT NULL,
  gate_results JSONB,
  is_draft BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔄 API Reference

### POST /api/generate

Generate a message with quality gates.

**Request:**
```json
{
  "recipeId": "recruiter-dm",
  "inputs": {
    "job_posting": "Senior Engineer at Stripe",
    "your_experience": "5 years React, scaled to 10M users",
    "recruiter_name": "Sarah",
    "tone": "professional"
  }
}
```

**Response:**
```json
{
  "output": "Hi Sarah! I noticed Stripe is hiring...",
  "gateResults": [
    { "name": "Length ≤ 300 chars", "passed": true, "reason": "Within limit" },
    { "name": "Evidence Gate", "passed": true, "reason": "All claims verified" }
  ],
  "allPassed": true,
  "passedCount": 7,
  "totalGates": 7
}
```

---

## 📋 Roadmap

### ✅ Completed
- [x] Landing page with testimonials
- [x] 4 recipe types with specialized inputs
- [x] AI generation with Claude
- [x] 7 quality gates
- [x] Google & LinkedIn OAuth
- [x] Generation history
- [x] Save drafts feature
- [x] Regenerate with tone adjustment
- [x] Supabase database
- [x] Vercel deployment

### 🔜 Coming Soon
- [ ] Production Clerk keys (remove dev badge)
- [ ] Custom domain
- [ ] Email notifications for saved drafts
- [ ] Export history to CSV
- [ ] Team/workspace support
- [ ] API rate limiting
- [ ] Usage analytics dashboard

---

## 🤝 Contributing

Contributions welcome! Please open an issue first to discuss changes.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Krishna (Nitya)**
- GitHub: [@Nityaa2396](https://github.com/Nityaa2396)

---

Built with ❤️ using Claude AI
