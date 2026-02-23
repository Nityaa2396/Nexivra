import Link from "next/link";
import { Header } from "@/components/Header";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";

export default function HomePage() {
  return (
    <>
      <Header />
      
      {/* Background with gradient mesh */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15), transparent), radial-gradient(ellipse 60% 50% at 80% 50%, rgba(0, 255, 136, 0.08), transparent), #09090b',
        zIndex: -1
      }} />
      
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        {/* Hero */}
        <section style={{ paddingTop: '100px', paddingBottom: '80px', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '10px',
            padding: '10px 20px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 200, 255, 0.1) 100%)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            marginBottom: '32px',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.1)'
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
              boxShadow: '0 0 12px #00ff88'
            }} />
            <span style={{ 
              fontSize: '13px',
              fontFamily: 'JetBrains Mono, monospace',
              background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 500
            }}>Outreach that actually gets replies</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(40px, 6vw, 72px)', 
            fontWeight: 800, 
            marginBottom: '24px',
            lineHeight: 1.05,
            letterSpacing: '-0.02em'
          }}>
            <span style={{ color: '#ffffff' }}>Stop sending messages</span><br />
            <span style={{ color: '#ffffff' }}>that </span>
            <span style={{ 
              background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>get you ghosted</span>
          </h1>

          <p style={{ 
            fontSize: '19px', 
            maxWidth: '580px', 
            margin: '0 auto 48px',
            lineHeight: 1.7,
            color: '#a1a1aa'
          }}>
            AI-powered outreach with quality gates that verify every claim. 
            No hallucinations. No resume dumps. Just messages that work.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/recipes" style={{ 
              padding: '18px 36px',
              background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
              color: '#09090b',
              fontWeight: 700,
              fontSize: '16px',
              borderRadius: '14px',
              boxShadow: '0 0 40px rgba(0, 255, 136, 0.35), 0 4px 20px rgba(0, 0, 0, 0.3)',
              border: 'none'
            }}>
              Start Writing →
            </Link>
            <Link href="#features" style={{ 
              padding: '18px 36px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e4e4e7',
              fontWeight: 600,
              fontSize: '16px',
              borderRadius: '14px',
              backdropFilter: 'blur(10px)'
            }}>
              How It Works
            </Link>
          </div>
        </section>

        {/* Testimonial Carousel */}
        <TestimonialCarousel />

        {/* Problem/Solution */}
        <section id="features" style={{ paddingBottom: '100px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Problem Card */}
            <div style={{ 
              padding: '36px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  fontSize: '18px',
                  fontWeight: 700
                }}>✗</div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ef4444', fontWeight: 600 }}>The Problem</span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', color: '#ffffff', lineHeight: 1.3 }}>
                Generic AI writes resume dumps and invents facts
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', color: '#a1a1aa' }}>
                <p><span style={{ color: '#ef4444', marginRight: '12px' }}>✗</span>&quot;I have 12+ years experience&quot; (you never said that)</p>
                <p><span style={{ color: '#ef4444', marginRight: '12px' }}>✗</span>Lists 6 technologies in one sentence</p>
                <p><span style={{ color: '#ef4444', marginRight: '12px' }}>✗</span>&quot;I&apos;m reaching out because...&quot; (instant delete)</p>
              </div>
            </div>

            {/* Solution Card */}
            <div style={{ 
              padding: '36px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 200, 255, 0.04) 100%)',
              border: '1px solid rgba(0, 255, 136, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 200, 255, 0.1) 100%)',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00ff88',
                  fontSize: '18px',
                  fontWeight: 700
                }}>✓</div>
                <span style={{ 
                  fontFamily: 'JetBrains Mono', 
                  fontSize: '12px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em', 
                  background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600 
                }}>The Solution</span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', color: '#ffffff', lineHeight: 1.3 }}>
                Quality gates verify every claim before you send
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', color: '#a1a1aa' }}>
                <p><span style={{ color: '#00ff88', marginRight: '12px' }}>✓</span>Evidence Gate traces every claim to your inputs</p>
                <p><span style={{ color: '#00ff88', marginRight: '12px' }}>✓</span>Auto-rewrites until all checks pass</p>
                <p><span style={{ color: '#00ff88', marginRight: '12px' }}>✓</span>Focused messages that sound human</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recipes */}
        <section style={{ paddingBottom: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Four recipes. Every scenario.
            </h2>
            <p style={{ color: '#71717a', fontSize: '17px' }}>Each optimized with specialized quality gates</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '56px' }}>
            <RecipeCard href="/recipes/recruiter-dm" icon="💬" name="Recruiter DM" desc="LinkedIn connection requests" gates={7} color="#00ff88" />
            <RecipeCard href="/recipes/follow-up" icon="↩️" name="Follow-up" desc="Second touch after no reply" gates={5} color="#fbbf24" />
            <RecipeCard href="/recipes/recruiter-comment" icon="👁️" name="Post Comment" desc="Engage without pitching" gates={5} color="#a78bfa" />
            <RecipeCard href="/recipes/cold-email" icon="📧" name="Cold Email" desc="Direct email outreach" gates={8} color="#60a5fa" />
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/recipes" style={{ 
              display: 'inline-block',
              padding: '18px 48px',
              background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
              color: '#09090b',
              fontWeight: 700,
              fontSize: '16px',
              borderRadius: '14px',
              boxShadow: '0 0 40px rgba(0, 255, 136, 0.35), 0 4px 20px rgba(0, 0, 0, 0.3)'
            }}>
              Try It Free →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '40px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#52525b' }}>
            Built with quality gates that never sleep. © 2026 Nexivra
          </p>
        </footer>
      </main>
    </>
  );
}

function RecipeCard({ href, icon, name, desc, gates, color }: { 
  href: string; icon: string; name: string; desc: string; gates: number; color: string;
}) {
  return (
    <Link href={href} style={{ 
      padding: '28px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      display: 'block',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>{icon}</div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>{name}</h3>
        <p style={{ fontSize: '14px', marginBottom: '16px', color: '#71717a' }}>{desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: gates }).map((_, i) => (
              <div key={i} style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}50`
              }} />
            ))}
          </div>
          <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono', color: color, fontWeight: 600 }}>{gates} gates</span>
        </div>
      </div>
    </Link>
  );
}
