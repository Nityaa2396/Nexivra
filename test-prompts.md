# Nexivra Test Cases - Copy These to Test Competitors

Use these prompts to test ChatGPT, Claude, Teal, Rezi, and other tools against Nexivra.

---

## TEST CASE 1: Career Changer (HARD)
**Challenge:** User switching careers with NO direct experience. AI will likely hallucinate.

**Prompt:**
```
Write a 280-character LinkedIn connection request to a recruiter for a Senior Data Scientist role at Netflix.

JD Requirements: 5+ years ML experience, Python, TensorFlow, recommendation systems, A/B testing at scale.

My experience:
- 8 years marketing analytics at CPG companies
- Expert in Excel, Tableau, basic SQL
- Led customer segmentation projects
- Recently completed Google Data Analytics certificate
- NO ML or Python experience

Why Netflix: Netflix's recommendation engine drives 80% of content watched. Fascinated by how they personalize at scale.

Keep it professional but warm. End with a soft question.
```

**WATCH FOR:**
- ❌ Claims ML experience (HALLUCINATION)
- ❌ Claims Python expertise (HALLUCINATION)
- ❌ Invents "3 years data science" (HALLUCINATION)
- ✅ Highlights transferable skills honestly
- ✅ Acknowledges the pivot

---

## TEST CASE 2: Weak Metrics - Vague Experience (HARD)
**Challenge:** User provides vague experience. AI will likely invent specific numbers.

**Prompt:**
```
Write a 280-character LinkedIn connection request to a recruiter for Growth Marketing Manager at Airbnb.

JD: Need someone who's driven significant user acquisition.

My experience:
- 5 years in digital marketing
- Ran campaigns that increased signups
- Managed social media accounts with good engagement
- Worked on SEO projects that improved rankings
- Team player, fast learner

Why Airbnb: Airbnb's recent focus on experiences and long-term stays opens interesting marketing angles.

Mutual connections. Confident peer tone.
```

**WATCH FOR:**
- ❌ Invents "increased signups by 50%" (HALLUCINATION)
- ❌ Adds specific numbers not provided (HALLUCINATION)
- ✅ Works with vague info honestly
- ✅ Uses qualitative differentiators

---

## TEST CASE 3: Entry Level - No Pro Experience (HARD)
**Challenge:** New grad with only academic experience. AI might oversell.

**Prompt:**
```
Write a 280-character LinkedIn connection request to a recruiter for Junior Software Engineer at Stripe.

JD: CS degree, familiarity with Python or Ruby, interest in payments.

My experience:
- BS Computer Science, graduated last month
- GPA 3.8
- Built payment integration project for senior capstone using Stripe API
- Contributed to 2 open source projects
- One summer internship at local startup doing basic CRUD apps
- NO professional engineering experience

Why Stripe: Stripe's developer experience is why I fell in love with APIs. Their documentation inspired my capstone project.

Cold outreach. Warm professional tone.
```

**WATCH FOR:**
- ❌ Claims "years of experience" (HALLUCINATION)
- ❌ Oversells internship as senior role (HALLUCINATION)
- ✅ Highlights genuine Stripe connection
- ✅ Sounds eager but not desperate

---

## TEST CASE 4: Non-Traditional Background (HARD)
**Challenge:** Bootcamp grad competing for CS degree role.

**Prompt:**
```
Write a 280-character LinkedIn connection request to a recruiter for Backend Engineer at Plaid.

JD: CS degree preferred, 3+ years experience, strong fundamentals in algorithms and data structures.

My experience:
- Former high school math teacher for 6 years
- Completed Hack Reactor bootcamp 2023
- Since then: 2 years at fintech startup
- Built API handling 1M requests/day
- Self-studied algorithms (completed all LeetCode hards in DP and graphs)
- NO CS degree

Why Plaid: Plaid's API-first approach to banking data is exactly what I want to build. Their developer docs are the gold standard I aspire to.

Cold outreach. Confident peer tone.
```

**WATCH FOR:**
- ❌ Invents CS degree (HALLUCINATION)
- ✅ Doesn't apologize for bootcamp
- ✅ Leads with achievements
- ✅ Sounds confident, not defensive

---

## TEST CASE 5: Technical Role - Dense Requirements (MEDIUM)
**Challenge:** Highly technical JD. AI might try to address everything.

**Prompt:**
```
Write a 280-character LinkedIn connection request to a recruiter for Staff SRE at Cloudflare.

JD: 8+ years, Kubernetes at scale (1000+ nodes), Prometheus/Grafana, Terraform, Go or Rust, incident management, distributed systems, chaos engineering, service mesh, GitOps, capacity planning.

My experience:
- 10 years SRE at AWS
- Managing K8s clusters (500+ nodes)
- Built observability platform with Prometheus/Grafana used by 50 teams
- Terraform expert
- Go for tooling
- Led incident response for S3 region
- Implemented chaos engineering program that prevented 3 major outages

Why Cloudflare: Cloudflare's edge computing fascinates me. Your work on R2 and Workers shows how infra can enable new product categories.

Same industry. Direct tone.
```

**WATCH FOR:**
- ❌ Lists ALL qualifications (resume dump)
- ✅ Picks ONE impressive point
- ✅ Stays under character limit
- ✅ Doesn't sound like keyword matching

---

## TEST CASE 6: Hiring Post Comment (HARD)
**Challenge:** Comment on hiring post without pitching for the job.

**Prompt:**
```
Write a LinkedIn comment (max 300 characters) on this recruiter's post:

POST: "We're hiring Senior Engineers at Notion! Looking for people who care deeply about craft and want to build tools that help teams collaborate. Remote-friendly, strong eng culture. DM me if interested!"

Your angle: The best collaboration tools succeed when they reduce friction between thought and action. Notion does this well with its block-based approach.

Your experience: 7 years building productivity tools. Currently at Asana. Shipped features used by millions.

Target role: Senior Software Engineer
```

**WATCH FOR:**
- ❌ Says "I'm interested!" (pitch)
- ❌ Lists qualifications (pitch)
- ❌ Asks how to apply (pitch)
- ✅ Adds thoughtful insight about collaboration tools
- ✅ Makes them curious to click profile

---

## TEST CASE 7: Cold Email with Referral (MEDIUM)
**Challenge:** Has referral - should use it without awkward name-dropping.

**Prompt:**
```
Write a cold email (max 150 words) to Michael Torres, Director of Engineering at Databricks, for a Senior Data Engineer role.

My experience:
- 6 years data engineering at Snowflake
- Building pipelines processing 5TB/day
- Apache Spark contributor
- Reduced data processing costs by 40% through query optimization

Why Databricks: Your Unity Catalog vision for data governance is where the industry is heading. My former colleague Jennifer Wu on your platform team speaks highly of the engineering culture.

Found via: Referral from Jennifer

Include subject line (max 50 chars).
```

**WATCH FOR:**
- ✅ Leads with referral name
- ❌ Over-explains the connection
- ✅ Still includes strong credential
- ✅ Concise, not rambling
- ❌ Sounds like mass email

---

## TEST CASE 8: Follow-Up After Profile View (MEDIUM)
**Challenge:** They viewed profile but didn't respond. Don't be creepy.

**Prompt:**
```
Write a follow-up message (max 200 characters) to a recruiter who viewed your profile but didn't respond to your original message.

Original message you sent: "Hi [Name], I noticed we share connections in healthtech. After scaling Teladoc's platform to handle 10M+ virtual visits, I'm excited about Hinge Health's approach to MSK care. Worth a quick chat?"

Days since: 3-5 days
Signal: They viewed your profile

New value to add: Just saw their team's presentation at HLTH conference about outcomes-based care. The 60% reduction in surgery rates is remarkable.

Your experience: 8 years healthtech engineering, scaled platforms for telehealth
```

**WATCH FOR:**
- ❌ Creepy: "I saw you looked at my profile"
- ❌ Repeats the 10M visits stat
- ✅ Adds NEW value (conference reference)
- ✅ Subtle or no mention of profile view

---

## SCORING RUBRIC

When testing, score each output on:

| Criteria | Weight | Pass/Fail |
|----------|--------|-----------|
| **Hallucination check** | 30% | Every claim traces to input |
| **Length compliance** | 15% | Meets platform limits |
| **Hook quality** | 15% | Not "I'm reaching out..." |
| **Tone** | 15% | Not desperate/robotic |
| **Strategic judgment** | 15% | Smart choices on what to include |
| **CTA quality** | 10% | Soft, easy to respond |

---

## COMPARISON TEMPLATE

| Test Case | ChatGPT | Claude | Teal | Nexivra |
|-----------|---------|--------|------|---------|
| TC1: Career Changer | | | | |
| TC2: Weak Metrics | | | | |
| TC3: Entry Level | | | | |
| TC4: Non-Traditional | | | | |
| TC5: Dense Technical | | | | |
| TC6: Comment No Pitch | | | | |
| TC7: Cold Email | | | | |
| TC8: Follow-Up | | | | |
| **Win Rate** | /8 | /8 | /8 | /8 |
