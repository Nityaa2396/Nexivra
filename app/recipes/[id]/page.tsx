"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import Link from "next/link";

const MOCK_RECIPES: Record<string, { name: string; description: string; color: string; inputs: Array<{ id: string; label: string; type: string; placeholder: string; required: boolean }> }> = {
  "recruiter-dm": {
    name: "Recruiter LinkedIn DM",
    description: "Cold outreach that actually gets replies. Optimized for LinkedIn's 300-char limit.",
    color: "#00ff88",
    inputs: [
      { id: "job_posting", label: "Job Posting", type: "textarea", placeholder: "Paste the job posting or describe the role...", required: true },
      { id: "your_experience", label: "Your Experience", type: "textarea", placeholder: "Describe your relevant experience, achievements, metrics...", required: true },
      { id: "recruiter_name", label: "Recruiter Name", type: "text", placeholder: "e.g., Sarah Chen", required: true },
      { id: "referral", label: "Referral / Connection (optional)", type: "text", placeholder: "e.g., John mentioned you're hiring...", required: false },
    ]
  },
  "follow-up": {
    name: "Follow-Up Message",
    description: "Second touch after no reply. Adds new value without sounding desperate.",
    color: "#fbbf24",
    inputs: [
      { id: "original_message", label: "Your Original Message", type: "textarea", placeholder: "Paste what you sent before...", required: true },
      { id: "new_value", label: "New Value to Add", type: "textarea", placeholder: "New achievement, article, insight to share...", required: true },
      { id: "recruiter_name", label: "Recruiter Name", type: "text", placeholder: "e.g., Sarah Chen", required: true },
    ]
  },
  "recruiter-comment": {
    name: "Comment on Recruiter Post",
    description: "Thoughtful comment to get on their radar. Build presence, not pitch.",
    color: "#a78bfa",
    inputs: [
      { id: "post_content", label: "The Post Content", type: "textarea", placeholder: "Paste or describe what they posted...", required: true },
      { id: "your_expertise", label: "Your Relevant Expertise", type: "textarea", placeholder: "What insight can you add based on your experience?", required: true },
    ]
  },
  "cold-email": {
    name: "Cold Email",
    description: "Direct email when you find recruiter's address. Short, specific, no spam.",
    color: "#60a5fa",
    inputs: [
      { id: "job_posting", label: "Job Posting", type: "textarea", placeholder: "Paste the job posting or describe the role...", required: true },
      { id: "your_experience", label: "Your Experience", type: "textarea", placeholder: "Describe your relevant experience, achievements, metrics...", required: true },
      { id: "recruiter_name", label: "Recruiter Name", type: "text", placeholder: "e.g., Sarah Chen", required: true },
      { id: "company_insight", label: "Company Insight (optional)", type: "text", placeholder: "Something specific about the company...", required: false },
    ]
  }
};

export default function RecipePage() {
  const params = useParams();
  const recipeId = params.id as string;
  
  const recipe = MOCK_RECIPES[recipeId];
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (!recipe) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <h1 style={{ color: '#ffffff', marginBottom: '16px' }}>Recipe not found</h1>
          <Link href="/recipes" style={{ color: '#00ff88' }}>← Back to recipes</Link>
        </main>
      </>
    );
  }

  const handleInputChange = (id: string, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResult(`Hi ${inputs.recruiter_name || 'there'},\n\n[This is a mock output. Connect your API to generate real messages.]\n\nBased on your inputs, Nexivra would generate a personalized message here with all claims verified by quality gates.`);
    setIsLoading(false);
  };

  const isFormValid = recipe.inputs.filter(i => i.required).every(i => inputs[i.id]?.trim());

  return (
    <>
      <Header />
      
      {/* Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(ellipse 60% 40% at 70% 20%, ${recipe.color}08, transparent), radial-gradient(ellipse 80% 50% at 30% 80%, rgba(120, 119, 198, 0.08), transparent), #09090b`,
        zIndex: -1
      }} />
      
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Link href="/recipes" style={{ fontSize: '14px', color: '#71717a', marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>←</span> Back to recipes
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <div style={{ 
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${recipe.color}20 0%, ${recipe.color}10 100%)`,
              border: `1px solid ${recipe.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 30px ${recipe.color}20`
            }}>
              <span style={{ color: recipe.color, fontSize: '22px' }}>✎</span>
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>{recipe.name}</h1>
              <p style={{ fontSize: '14px', color: '#71717a', marginTop: '4px' }}>{recipe.description}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '28px', alignItems: 'start' }}>
          {/* Form */}
          <div style={{ 
            padding: '28px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <h2 style={{ 
              fontFamily: 'JetBrains Mono', 
              fontSize: '11px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              color: '#71717a',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: recipe.color, boxShadow: `0 0 10px ${recipe.color}` }} />
              Inputs
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {recipe.inputs.map((input) => (
                <div key={input.id}>
                  <label style={{ 
                    display: 'block',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#71717a',
                    marginBottom: '10px',
                    fontWeight: 500
                  }}>
                    {input.label}
                    {input.required && <span style={{ color: recipe.color, marginLeft: '4px' }}>*</span>}
                  </label>
                  {input.type === 'textarea' ? (
                    <textarea
                      value={inputs[input.id] || ''}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      placeholder={input.placeholder}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        color: '#fafafa',
                        fontSize: '14px',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={inputs[input.id] || ''}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      placeholder={input.placeholder}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        color: '#fafafa',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!isFormValid || isLoading}
              style={{
                width: '100%',
                marginTop: '28px',
                padding: '18px',
                borderRadius: '14px',
                border: 'none',
                background: isFormValid && !isLoading ? `linear-gradient(135deg, ${recipe.color} 0%, ${recipe.color}cc 100%)` : 'rgba(255, 255, 255, 0.05)',
                color: isFormValid && !isLoading ? '#09090b' : '#52525b',
                fontWeight: 700,
                fontSize: '15px',
                cursor: isFormValid && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: isFormValid && !isLoading ? `0 0 30px ${recipe.color}40` : 'none',
                transition: 'all 0.3s'
              }}
            >
              {isLoading ? (
                <>
                  <span style={{ 
                    width: '18px', 
                    height: '18px', 
                    border: '2px solid currentColor',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Generating...
                </>
              ) : (
                <>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                  Generate Message
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {result ? (
              <>
                <div style={{ 
                  padding: '24px',
                  borderRadius: '20px',
                  background: `linear-gradient(135deg, ${recipe.color}08 0%, transparent 100%)`,
                  border: `1px solid ${recipe.color}20`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: `${recipe.color}20`,
                        border: `1px solid ${recipe.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: recipe.color,
                        fontWeight: 700
                      }}>✓</div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Output</span>
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', padding: '4px 10px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '6px', color: '#71717a' }}>{result.length} chars</span>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(0,0,0,0.2)', marginBottom: '16px' }}>
                    <p style={{ fontSize: '14px', color: '#e4e4e7', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{result}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: `linear-gradient(135deg, ${recipe.color} 0%, ${recipe.color}cc 100%)`,
                      color: '#09090b',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: `0 0 20px ${recipe.color}30`
                    }}
                  >
                    Copy to Clipboard
                  </button>
                </div>

                <div style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1,2,3,4,5,6,7].map(i => (
                          <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00ff88', boxShadow: '0 0 8px rgba(0, 255, 136, 0.6)' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '14px', color: '#71717a' }}>Quality Checks</span>
                    </div>
                    <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono', color: '#00ff88', fontWeight: 700 }}>7/7</span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: '56px 28px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px', color: '#3f3f46' }}>✉</div>
                <p style={{ color: '#ffffff', fontWeight: 600, marginBottom: '6px', fontSize: '16px' }}>Ready to generate</p>
                <p style={{ fontSize: '14px', color: '#71717a', marginBottom: '20px' }}>Fill in the form and click Generate</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                  {[1,2,3,4,5,6,7].map(i => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#27272a' }} />
                  ))}
                </div>
                <p style={{ fontSize: '12px', color: '#52525b', marginTop: '10px' }}>7 quality gates will verify your output</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
