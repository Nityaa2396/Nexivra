"use client";

import { useState } from "react";

interface EvidenceClaim {
  claim: string;
  sourceField: string | null;
  sourceQuote?: string | null;
  verified: boolean;
  reason?: string;
}

interface EvidenceMapProps {
  evidence: EvidenceClaim[];
}

export function EvidenceMap({ evidence }: EvidenceMapProps) {
  const [expanded, setExpanded] = useState(false);
  
  const verifiedCount = evidence.filter((e) => e.verified).length;
  const totalCount = evidence.length;
  const allVerified = verifiedCount === totalCount;

  return (
    <div 
      className="rounded-2xl border nx-fade-in overflow-hidden"
      style={{ backgroundColor: 'var(--nx-bg-card)', borderColor: 'var(--nx-border)' }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center border"
            style={{ 
              backgroundColor: allVerified ? 'var(--nx-accent-glow)' : 'rgba(251, 191, 36, 0.15)',
              borderColor: allVerified ? 'rgba(0, 255, 136, 0.3)' : 'rgba(251, 191, 36, 0.3)'
            }}
          >
            <svg 
              className="w-4 h-4" 
              style={{ color: allVerified ? 'var(--nx-accent)' : 'var(--nx-warning)' }} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div>
            <span className="text-sm" style={{ color: 'var(--nx-text-muted)' }}>
              Evidence Map
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span 
            className="text-sm font-mono font-semibold"
            style={{ color: allVerified ? 'var(--nx-success)' : 'var(--nx-warning)' }}
          >
            {verifiedCount}/{totalCount}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            style={{ color: 'var(--nx-text-muted)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 nx-fade-in border-t" style={{ borderColor: 'var(--nx-border)' }}>
          <div 
            className="mt-4 rounded-xl border overflow-hidden"
            style={{ backgroundColor: 'var(--nx-bg)', borderColor: 'var(--nx-border)' }}
          >
            {/* Terminal header */}
            <div 
              className="flex items-center gap-2 px-4 py-2 border-b"
              style={{ backgroundColor: 'var(--nx-bg-elevated)', borderColor: 'var(--nx-border)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'rgba(239, 68, 68, 0.7)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'rgba(251, 191, 36, 0.7)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'rgba(0, 255, 136, 0.7)' }} />
              </div>
              <span className="text-xs font-mono ml-2" style={{ color: 'var(--nx-text-dim)' }}>
                verification.log
              </span>
            </div>
            
            {/* Terminal content */}
            <div className="p-4 font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
              {evidence.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span style={{ color: item.verified ? 'var(--nx-success)' : 'var(--nx-error)' }}>
                    {item.verified ? "✓" : "✗"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span style={{ color: 'var(--nx-text)' }}>"{item.claim}"</span>
                    {item.sourceField && (
                      <span style={{ color: 'var(--nx-text-dim)' }}>
                        {" → "}
                        <span style={{ color: 'var(--nx-accent)' }}>{item.sourceField}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--nx-border)' }}>
                <span style={{ color: 'var(--nx-text-dim)' }}>$ </span>
                <span style={{ color: allVerified ? 'var(--nx-success)' : 'var(--nx-warning)' }}>
                  {allVerified ? "All claims verified ✓" : `${totalCount - verifiedCount} unverified`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
