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
  created_at: string;
}

export default function HistoryPage() {
  const { user } = useUser();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

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
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const recipeNames: Record<string, string> = {
    'recruiter-dm': 'Recruiter DM',
    'follow-up': 'Follow-up',
    'recruiter-comment': 'Post Comment',
    'cold-email': 'Cold Email',
  };

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
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>
            Generation History
          </h1>
          <p style={{ color: '#71717a', fontSize: '16px' }}>
            Your recent message generations
          </p>
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
        ) : generations.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 40px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
              No generations yet
            </h3>
            <p style={{ color: '#71717a', marginBottom: '24px' }}>
              Start creating outreach messages to see them here
            </p>
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
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {generations.map((gen) => (
              <div 
                key={gen.id}
                style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{ 
                      fontSize: '12px', 
                      fontFamily: 'JetBrains Mono',
                      padding: '4px 10px',
                      backgroundColor: 'rgba(0, 255, 136, 0.1)',
                      border: '1px solid rgba(0, 255, 136, 0.2)',
                      borderRadius: '6px',
                      color: '#00ff88'
                    }}>
                      {recipeNames[gen.recipe_id] || gen.recipe_id}
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#52525b' }}>
                    {formatDate(gen.created_at)}
                  </span>
                </div>
                
                <p style={{ 
                  color: '#e4e4e7', 
                  fontSize: '14px', 
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  maxHeight: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {gen.output}
                </p>
                
                <button
                  onClick={() => navigator.clipboard.writeText(gen.output)}
                  style={{
                    marginTop: '16px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    color: '#a1a1aa',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Copy to clipboard
                </button>
              </div>
            ))}
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
