"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Generation {
  id: string;
  recipe_id: string;
  inputs: Record<string, string>;
  output: string;
  gate_results: Array<{ name: string; passed: boolean; reason: string }>;
  created_at: string;
  is_draft?: boolean;
}

const RECIPE_INFO: Record<string, { name: string; icon: string; color: string }> = {
  "recruiter-dm": { name: "Recruiter DM", icon: "💬", color: "#00ff88" },
  "follow-up": { name: "Follow-up", icon: "↩️", color: "#fbbf24" },
  "recruiter-comment": { name: "Post Comment", icon: "👁️", color: "#a78bfa" },
  "cold-email": { name: "Cold Email", icon: "📧", color: "#60a5fa" },
};

export default function HistoryPage() {
  const { user } = useUser();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [showDraftsOnly, setShowDraftsOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<string>("professional");

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        setGenerations(data || []);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [user]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this generation?')) return;
    
    try {
      await supabase.from('generations').delete().eq('id', id);
      setGenerations(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleSaveAsDraft = async (gen: Generation) => {
    try {
      await supabase
        .from('generations')
        .update({ is_draft: true })
        .eq('id', gen.id);
      
      setGenerations(prev => 
        prev.map(g => g.id === gen.id ? { ...g, is_draft: true } : g)
      );
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
  };

  const handleRemoveDraft = async (id: string) => {
    try {
      await supabase
        .from('generations')
        .update({ is_draft: false })
        .eq('id', id);
      
      setGenerations(prev => 
        prev.map(g => g.id === id ? { ...g, is_draft: false } : g)
      );
    } catch (err) {
      console.error('Failed to remove draft:', err);
    }
  };

  const handleRegenerate = async (gen: Generation) => {
    setRegeneratingId(gen.id);
    
    try {
      // Add tone to inputs
      const updatedInputs = { ...gen.inputs, tone: selectedTone };
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          recipeId: gen.recipe_id, 
          inputs: updatedInputs 
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      // Save new generation
      const { data: newGen } = await supabase
        .from('generations')
        .insert({
          user_id: user?.id,
          recipe_id: gen.recipe_id,
          inputs: updatedInputs,
          output: data.output,
          gate_results: data.gateResults,
        })
        .select()
        .single();

      if (newGen) {
        setGenerations(prev => [newGen, ...prev]);
        setExpandedId(newGen.id);
      }
    } catch (err) {
      console.error('Failed to regenerate:', err);
      alert('Failed to regenerate. Please try again.');
    } finally {
      setRegeneratingId(null);
    }
  };

  // Filter generations
  const filteredGenerations = generations.filter(gen => {
    if (showDraftsOnly && !gen.is_draft) return false;
    if (filter !== "all" && gen.recipe_id !== filter) return false;
    return true;
  });

  const draftsCount = generations.filter(g => g.is_draft).length;

  return (
    <>
      <Header />
      
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.1), transparent), #09090b',
        zIndex: -1
      }} />
      
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>
            Generation History
          </h1>
          <p style={{ color: '#71717a', fontSize: '16px' }}>
            Your recent message generations • {generations.length} total
            {draftsCount > 0 && <span style={{ color: '#fbbf24' }}> • {draftsCount} drafts</span>}
          </p>
        </div>

        {/* Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.3)',
              color: '#fafafa',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Recipes</option>
            {Object.entries(RECIPE_INFO).map(([id, info]) => (
              <option key={id} value={id}>{info.icon} {info.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowDraftsOnly(!showDraftsOnly)}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid',
              borderColor: showDraftsOnly ? '#fbbf24' : 'rgba(255,255,255,0.1)',
              background: showDraftsOnly ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
              color: showDraftsOnly ? '#fbbf24' : '#a1a1aa',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ⭐ Drafts Only {draftsCount > 0 && `(${draftsCount})`}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid #27272a',
              borderTopColor: '#00ff88',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
            <p style={{ color: '#71717a', marginTop: '16px' }}>Loading...</p>
          </div>
        ) : filteredGenerations.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 40px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {showDraftsOnly ? '⭐' : '📝'}
            </div>
            <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
              {showDraftsOnly ? 'No drafts saved' : 'No generations yet'}
            </h3>
            <p style={{ color: '#71717a', marginBottom: '24px' }}>
              {showDraftsOnly 
                ? 'Save generations as drafts to find them here' 
                : 'Start creating outreach messages to see them here'}
            </p>
            {!showDraftsOnly && (
              <Link href="/recipes" style={{
                display: 'inline-block',
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                color: '#09090b',
                fontWeight: 600,
                borderRadius: '12px',
                boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
              }}>
                Create Your First Message →
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredGenerations.map((gen) => {
              const info = RECIPE_INFO[gen.recipe_id] || { name: gen.recipe_id, icon: '📝', color: '#71717a' };
              const isExpanded = expandedId === gen.id;
              const passedGates = gen.gate_results?.filter(g => g.passed).length || 0;
              const totalGates = gen.gate_results?.length || 0;

              return (
                <div 
                  key={gen.id}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
                    border: `1px solid ${gen.is_draft ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
                    position: 'relative',
                  }}
                >
                  {/* Draft badge */}
                  {gen.is_draft && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(251, 191, 36, 0.1)',
                      border: '1px solid rgba(251, 191, 36, 0.2)',
                      color: '#fbbf24',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}>
                      ⭐ DRAFT
                    </div>
                  )}

                  {/* Header row */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      marginBottom: '12px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : gen.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${info.color}15`,
                        border: `1px solid ${info.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                      }}>
                        {info.icon}
                      </div>
                      <div>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: 600,
                          color: '#ffffff',
                        }}>
                          {info.name}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                          <span style={{ fontSize: '12px', color: '#52525b' }}>
                            {formatDate(gen.created_at)}
                          </span>
                          {totalGates > 0 && (
                            <span style={{ 
                              fontSize: '11px', 
                              fontFamily: 'JetBrains Mono',
                              color: passedGates === totalGates ? '#00ff88' : '#fbbf24',
                            }}>
                              {passedGates}/{totalGates} gates
                            </span>
                          )}
                          <span style={{ fontSize: '11px', color: '#52525b' }}>
                            {gen.output.length} chars
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#71717a',
                        cursor: 'pointer',
                        fontSize: '18px',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      ▼
                    </button>
                  </div>

                  {/* Preview (when collapsed) */}
                  {!isExpanded && (
                    <p style={{ 
                      color: '#a1a1aa', 
                      fontSize: '14px', 
                      lineHeight: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {gen.output}
                    </p>
                  )}

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{ marginTop: '16px' }}>
                      {/* Full message */}
                      <div style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        marginBottom: '16px',
                      }}>
                        <p style={{ 
                          color: '#e4e4e7', 
                          fontSize: '14px', 
                          lineHeight: 1.7,
                          whiteSpace: 'pre-wrap',
                        }}>
                          {gen.output}
                        </p>
                      </div>

                      {/* Quality gates (collapsed view) */}
                      {gen.gate_results && gen.gate_results.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                          marginBottom: '16px',
                        }}>
                          {gen.gate_results.map((gate, i) => (
                            <span
                              key={i}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                background: gate.passed ? 'rgba(0, 255, 136, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                border: `1px solid ${gate.passed ? 'rgba(0, 255, 136, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                color: gate.passed ? '#00ff88' : '#ef4444',
                              }}
                            >
                              {gate.passed ? '✓' : '✗'} {gate.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Regenerate section */}
                      <div style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'rgba(0, 255, 136, 0.03)',
                        border: '1px solid rgba(0, 255, 136, 0.1)',
                        marginBottom: '16px',
                      }}>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#71717a', 
                          marginBottom: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          Regenerate with different tone
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {['professional', 'warm', 'confident', 'casual'].map(tone => (
                            <button
                              key={tone}
                              onClick={() => setSelectedTone(tone)}
                              style={{
                                padding: '8px 14px',
                                borderRadius: '8px',
                                border: '1px solid',
                                borderColor: selectedTone === tone ? '#00ff88' : 'rgba(255,255,255,0.1)',
                                background: selectedTone === tone ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                                color: selectedTone === tone ? '#00ff88' : '#a1a1aa',
                                fontSize: '13px',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                              }}
                            >
                              {tone}
                            </button>
                          ))}
                          <button
                            onClick={() => handleRegenerate(gen)}
                            disabled={regeneratingId === gen.id}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                              color: '#09090b',
                              fontSize: '13px',
                              fontWeight: 600,
                              cursor: regeneratingId === gen.id ? 'not-allowed' : 'pointer',
                              opacity: regeneratingId === gen.id ? 0.7 : 1,
                            }}
                          >
                            {regeneratingId === gen.id ? '⏳ Regenerating...' : '⚡ Regenerate'}
                          </button>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleCopy(gen.output, gen.id)}
                          style={{
                            padding: '10px 16px',
                            borderRadius: '10px',
                            border: 'none',
                            background: copiedId === gen.id ? '#00ff88' : 'rgba(255,255,255,0.1)',
                            color: copiedId === gen.id ? '#09090b' : '#fafafa',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {copiedId === gen.id ? '✓ Copied!' : '📋 Copy'}
                        </button>

                        {gen.is_draft ? (
                          <button
                            onClick={() => handleRemoveDraft(gen.id)}
                            style={{
                              padding: '10px 16px',
                              borderRadius: '10px',
                              border: '1px solid rgba(251, 191, 36, 0.3)',
                              background: 'rgba(251, 191, 36, 0.1)',
                              color: '#fbbf24',
                              fontSize: '13px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            ⭐ Remove from Drafts
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSaveAsDraft(gen)}
                            style={{
                              padding: '10px 16px',
                              borderRadius: '10px',
                              border: '1px solid rgba(255,255,255,0.1)',
                              background: 'transparent',
                              color: '#a1a1aa',
                              fontSize: '13px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            ⭐ Save as Draft
                          </button>
                        )}

                        <Link
                          href={`/recipes/${gen.recipe_id}`}
                          style={{
                            padding: '10px 16px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'transparent',
                            color: '#a1a1aa',
                            fontSize: '13px',
                            fontWeight: 500',
                            cursor: 'pointer',
                            textDecoration: 'none',
                          }}
                        >
                          ✎ New {info.name}
                        </Link>

                        <button
                          onClick={() => handleDelete(gen.id)}
                          style={{
                            padding: '10px 16px',
                            borderRadius: '10px',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            background: 'transparent',
                            color: '#ef4444',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            marginLeft: 'auto',
                          }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
