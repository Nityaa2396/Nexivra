import { Header } from "@/components/Header";
import Link from "next/link";

const RECIPES = [
  { id: "recruiter-dm", name: "Recruiter LinkedIn DM", description: "Cold outreach that actually gets replies. Optimized for LinkedIn's 300-char limit.", gates: 7, icon: "💬", color: "#00ff88" },
  { id: "follow-up", name: "Follow-Up Message", description: "Second touch after no reply. Adds new value without sounding desperate.", gates: 5, icon: "↩️", color: "#fbbf24" },
  { id: "recruiter-comment", name: "Comment on Recruiter Post", description: "Thoughtful comment to get on their radar. Build presence, not pitch.", gates: 5, icon: "👁️", color: "#a78bfa" },
  { id: "cold-email", name: "Cold Email", description: "Direct email when you find recruiter's address. Short, specific, no spam.", gates: 8, icon: "📧", color: "#60a5fa" },
];

export default function RecipesPage() {
  return (
    <>
      <Header />
      
      {/* Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.1), transparent), #09090b',
        zIndex: -1
      }} />
      
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Choose Your Recipe
          </h1>
          <p style={{ color: '#71717a', fontSize: '17px' }}>
            Each recipe is optimized for a specific outreach scenario with specialized quality gates.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {RECIPES.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              style={{ 
                padding: '28px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'block'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ 
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${recipe.color}15 0%, ${recipe.color}08 100%)`,
                  border: `1px solid ${recipe.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0
                }}>
                  {recipe.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                    {recipe.name}
                  </h3>
                  <p style={{ fontSize: '14px', marginBottom: '14px', color: '#71717a', lineHeight: 1.5 }}>
                    {recipe.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {Array.from({ length: recipe.gates }).map((_, i) => (
                        <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: recipe.color, boxShadow: `0 0 8px ${recipe.color}50` }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono', color: recipe.color, fontWeight: 600 }}>
                      {recipe.gates} quality gates
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ 
          padding: '28px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.06) 0%, rgba(0, 200, 255, 0.03) 100%)',
          border: '1px solid rgba(0, 255, 136, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ 
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 200, 255, 0.1) 100%)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00ff88',
              fontSize: '18px',
              flexShrink: 0
            }}>?</div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                Not sure which to use?
              </h3>
              <p style={{ fontSize: '14px', color: '#71717a', lineHeight: 1.6 }}>
                Start with <span style={{ color: '#00ff88', fontWeight: 500 }}>Recruiter LinkedIn DM</span> for first contact. 
                If they don&apos;t respond after a week, use <span style={{ color: '#fbbf24', fontWeight: 500 }}>Follow-Up Message</span>. 
                Use <span style={{ color: '#a78bfa', fontWeight: 500 }}>Post Comment</span> to build presence before reaching out.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
