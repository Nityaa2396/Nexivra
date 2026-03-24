"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

interface InputField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

const MOCK_RECIPES: Record<string, { 
  name: string; 
  description: string; 
  color: string; 
  inputs: InputField[];
}> = {
  "recruiter-dm": {
    name: "Recruiter LinkedIn DM",
    description: "Cold outreach that actually gets replies. Optimized for LinkedIn's 300-char limit.",
    color: "#00ff88",
    inputs: [
      { id: "job_posting", label: "Job Posting / Role", type: "textarea", placeholder: "Paste the job posting or describe the role you're targeting...", required: true },
      { id: "your_experience", label: "Your Relevant Experience", type: "textarea", placeholder: "Your achievements with metrics (e.g., 'Scaled platform to 10M users, reduced latency by 40%')", required: true },
      { id: "recruiter_name", label: "Recruiter's First Name", type: "text", placeholder: "e.g., Sarah", required: true },
      { id: "company_insight", label: "Company Insight", type: "textarea", placeholder: "Recent news, product launch, or something specific about the company...", required: false },
      { 
        id: "connection_type", 
        label: "How You're Connected", 
        type: "select", 
        required: false,
        options: [
          { value: "", label: "Select connection type..." },
          { value: "mutual_connection", label: "Mutual connection" },
          { value: "same_company", label: "Worked at same company" },
          { value: "same_school", label: "Same university/school" },
          { value: "commented_post", label: "Commented on their post" },
          { value: "viewed_profile", label: "They viewed my profile" },
          { value: "same_group", label: "Same LinkedIn group" },
          { value: "none", label: "No prior connection" },
        ]
      },
      { 
        id: "tone", 
        label: "Tone", 
        type: "select", 
        required: false,
        options: [
          { value: "professional", label: "Professional" },
          { value: "warm", label: "Warm & Friendly" },
          { value: "confident", label: "Confident & Direct" },
          { value: "casual", label: "Casual" },
        ]
      },
    ]
  },
  "follow-up": {
    name: "Follow-Up Message",
    description: "Second touch after no reply. Adds new value without sounding desperate.",
    color: "#fbbf24",
    inputs: [
      { id: "original_message", label: "Your Original Message", type: "textarea", placeholder: "Paste what you sent before...", required: true },
      { id: "new_value", label: "New Value to Add", type: "textarea", placeholder: "New achievement, relevant news, article, or insight to share...", required: true },
      { id: "recruiter_name", label: "Recruiter's First Name", type: "text", placeholder: "e.g., Sarah", required: true },
      { 
        id: "days_since", 
        label: "Days Since Original Message", 
        type: "select", 
        required: false,
        options: [
          { value: "3-5", label: "3-5 days" },
          { value: "1_week", label: "About 1 week" },
          { value: "2_weeks", label: "About 2 weeks" },
          { value: "1_month", label: "About 1 month" },
        ]
      },
      { 
        id: "signal", 
        label: "Any Signal From Them?", 
        type: "select", 
        required: false,
        options: [
          { value: "", label: "Select if any..." },
          { value: "viewed_profile", label: "They viewed my profile" },
          { value: "liked_post", label: "They liked my post" },
          { value: "company_news", label: "Company had news/announcement" },
          { value: "job_reposted", label: "Job was reposted" },
          { value: "none", label: "No signal" },
        ]
      },
      { 
        id: "tone", 
        label: "Tone", 
        type: "select", 
        required: false,
        options: [
          { value: "professional", label: "Professional" },
          { value: "warm", label: "Warm & Friendly" },
          { value: "persistent", label: "Politely Persistent" },
        ]
      },
    ]
  },
  "recruiter-comment": {
    name: "Comment on Recruiter Post",
    description: "Thoughtful comment to get on their radar. Build presence, not pitch.",
    color: "#a78bfa",
    inputs: [
      { id: "post_content", label: "Their Post Content", type: "textarea", placeholder: "Paste or describe what they posted...", required: true },
      { id: "your_expertise", label: "Your Relevant Expertise", type: "textarea", placeholder: "What insight can you add based on your experience?", required: true },
      { id: "your_take", label: "Your Unique Take", type: "textarea", placeholder: "What's your perspective on their topic?", required: false },
      { 
        id: "comment_style", 
        label: "Comment Style", 
        type: "select", 
        required: false,
        options: [
          { value: "add_insight", label: "Add insight/data" },
          { value: "share_experience", label: "Share related experience" },
          { value: "ask_question", label: "Ask thoughtful question" },
          { value: "agree_expand", label: "Agree and expand" },
          { value: "respectful_disagree", label: "Respectfully disagree" },
        ]
      },
    ]
  },
  "cold-email": {
    name: "Cold Email",
    description: "Direct email when you find recruiter's address. Short, specific, no spam.",
    color: "#60a5fa",
    inputs: [
      { id: "job_posting", label: "Job Posting / Role", type: "textarea", placeholder: "Paste the job posting or describe the role...", required: true },
      { id: "your_experience", label: "Your Relevant Experience", type: "textarea", placeholder: "Your key achievements with metrics...", required: true },
      { id: "recruiter_name", label: "Recruiter's First Name", type: "text", placeholder: "e.g., Sarah", required: true },
      { id: "company_insight", label: "Company-Specific Insight", type: "textarea", placeholder: "Recent news, product launch, or something specific about them...", required: false },
      { 
        id: "tone", 
        label: "Tone", 
        type: "select", 
        required: false,
        options: [
          { value: "professional", label: "Professional" },
          { value: "warm", label: "Warm & Friendly" },
          { value: "confident", label: "Confident & Direct" },
        ]
      },
      { 
        id: "email_length", 
        label: "Email Length", 
        type: "select", 
        required: false,
        options: [
          { value: "short", label: "Short (3-4 sentences)" },
          { value: "medium", label: "Medium (5-6 sentences)" },
          { value: "detailed", label: "Detailed (with specifics)" },
        ]
      },
    ]
  }
};

interface GateResult {
  name: string;
  passed: boolean;
  reason: string;
}

export default function RecipePage() {
  const params = useParams();
  const recipeId = params.id as string;
  const { user } = useUser();
  
  const recipe = MOCK_RECIPES[recipeId];
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [gateResults, setGateResults] = useState<GateResult[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    setGateResults([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, inputs }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      setResult(data.output);
      setGateResults(data.gateResults || []);

      // Save to Supabase if user is logged in
      if (user) {
        try {
          await supabase.from('generations').insert({
            user_id: user.id,
            recipe_id: recipeId,
            inputs,
            output: data.output,
            gate_results: data.gateResults,
          });
        } catch (e) {
          console.error('Failed to save generation:', e);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = recipe.inputs.filter(i => i.required).every(i => inputs[i.id]?.trim());
  const passedGates = gateResults.filter(g => g.passed).length;

  return (
    <>
      <Header />
      
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
                      }}
                    />
                  ) : input.type === 'select' ? (
                    <select
                      value={inputs[input.id] || ''}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        color: '#fafafa',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {input.options?.map(opt => (
                        <option key={opt.value} value={opt.value} style={{ backgroundColor: '#18181b' }}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
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
                  Generating with AI...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '16px' }}>⚡</span>
                  Generate Message
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{ 
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                fontSize: '14px'
              }}>
                ⚠️ {error}
              </div>
            )}
            
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
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Generated Message</span>
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

                {/* Quality Gates */}
                <div style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Quality Gates</span>
                    <span style={{ 
                      fontSize: '13px', 
                      fontFamily: 'JetBrains Mono', 
                      color: passedGates === gateResults.length ? '#00ff88' : '#fbbf24', 
                      fontWeight: 700 
                    }}>
                      {passedGates}/{gateResults.length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {gateResults.map((gate, i) => (
                      <div key={i} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: gate.passed ? 'rgba(0, 255, 136, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                        border: `1px solid ${gate.passed ? 'rgba(0, 255, 136, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ color: gate.passed ? '#00ff88' : '#ef4444', fontSize: '14px' }}>
                            {gate.passed ? '✓' : '✗'}
                          </span>
                          <span style={{ fontSize: '13px', color: '#e4e4e7' }}>{gate.name}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#71717a' }}>{gate.reason}</span>
                      </div>
                    ))}
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
