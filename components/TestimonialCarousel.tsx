"use client";

import { useState, useEffect } from "react";

const SLIDES = [
  {
    stat: "100%",
    statLabel: "Accuracy Rate",
    miniStats: [
      { value: "0", label: "Hallucinations" },
      { value: "7", label: "Quality Gates" }
    ],
    quote: "Every claim in my outreach messages is now backed by evidence. No more awkward moments in interviews when asked about something the AI made up.",
    attribution: "The Evidence Gate Promise",
    subtext: "Verified accuracy across all test scenarios"
  },
  {
    stat: "7",
    statLabel: "Quality Gates",
    miniStats: [
      { value: "300", label: "Char Limit" },
      { value: "∞", label: "Rewrites" }
    ],
    quote: "The auto-rewrite feature kept refining my message until every quality gate passed. What used to take me 30 minutes now takes 30 seconds.",
    attribution: "Built-in Quality Assurance",
    subtext: "Automatic refinement until perfect"
  },
  {
    stat: "4",
    statLabel: "Recipe Types",
    miniStats: [
      { value: "DM", label: "LinkedIn" },
      { value: "Email", label: "Cold" }
    ],
    quote: "From first contact to follow-ups, there's a recipe for every scenario. Each one optimized for its specific use case.",
    attribution: "Complete Outreach Toolkit",
    subtext: "Every scenario covered"
  }
];

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[activeIndex];

  return (
    <section style={{ marginBottom: '100px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
        minHeight: '420px'
      }}>
        {/* Left - Visual */}
        <div style={{
          background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #7c3aed 100%)',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
          
          {/* Score display with fade animation */}
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div 
              key={activeIndex}
              style={{ 
                fontSize: '100px', 
                fontWeight: 900, 
                fontFamily: 'JetBrains Mono',
                color: '#09090b',
                lineHeight: 1,
                textShadow: '0 4px 30px rgba(0,0,0,0.2)',
                animation: 'fadeIn 0.5s ease-out'
              }}
            >
              {slide.stat}
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 700, 
              color: '#09090b',
              opacity: 0.8,
              marginTop: '8px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>{slide.statLabel}</div>
          </div>
          
          {/* Mini stats */}
          <div style={{ 
            display: 'flex', 
            gap: '32px', 
            marginTop: '40px',
            padding: '16px 28px',
            background: 'rgba(0,0,0,0.15)',
            borderRadius: '12px'
          }}>
            {slide.miniStats.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#09090b' }}>{stat.value}</div>
                <div style={{ fontSize: '10px', color: '#09090b', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right - Quote */}
        <div style={{
          padding: '56px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Pagination dots - clickable */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{ 
                  width: '32px', 
                  height: '4px', 
                  borderRadius: '2px', 
                  background: i === activeIndex ? '#00ff88' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
          
          {/* Quote */}
          <blockquote 
            key={activeIndex}
            style={{ 
              fontSize: '22px', 
              fontWeight: 500, 
              color: '#ffffff',
              lineHeight: 1.6,
              marginBottom: '40px',
              animation: 'fadeIn 0.5s ease-out'
            }}
          >
            &quot;{slide.quote}&quot;
          </blockquote>
          
          {/* Attribution */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '15px' }}>{slide.attribution}</div>
              <div style={{ color: '#71717a', fontSize: '13px', marginTop: '4px' }}>{slide.subtext}</div>
            </div>
            <div style={{
              padding: '10px 16px',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ color: '#00ff88', fontWeight: 700, fontSize: '14px' }}>✓</span>
              <span style={{ color: '#00ff88', fontSize: '12px', fontWeight: 600 }}>Verified</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
