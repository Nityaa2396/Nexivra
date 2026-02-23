"use client";

import { useState } from "react";

interface GateResult {
  gateId: string;
  gateName: string;
  passed: boolean;
  reason?: string;
  score?: number;
}

interface QualityGatesProps {
  gates: GateResult[];
  isLoading?: boolean;
}

export function QualityGates({ gates, isLoading }: QualityGatesProps) {
  const [expanded, setExpanded] = useState(false);
  
  const passedCount = gates.filter((g) => g.passed).length;
  const totalCount = gates.length;
  const allPassed = passedCount === totalCount;

  if (isLoading) {
    return (
      <div 
        className="p-5 rounded-2xl border"
        style={{ backgroundColor: 'var(--nx-bg-card)', borderColor: 'var(--nx-border)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 rounded-full nx-pulse"
                style={{ backgroundColor: 'var(--nx-text-dim)', animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <span className="text-sm font-mono" style={{ color: 'var(--nx-text-muted)' }}>
            Running checks...
          </span>
        </div>
      </div>
    );
  }

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
          <div className="flex gap-1">
            {gates.map((gate, i) => (
              <div
                key={gate.gateId}
                className="w-2 h-2 rounded-full transition-all"
                style={{ 
                  backgroundColor: gate.passed ? 'var(--nx-success)' : 'var(--nx-error)',
                  boxShadow: gate.passed 
                    ? '0 0 6px rgba(0, 255, 136, 0.6)' 
                    : '0 0 6px rgba(239, 68, 68, 0.6)',
                  animationDelay: `${i * 0.05}s`
                }}
                title={gate.gateName}
              />
            ))}
          </div>
          
          <span className="text-sm" style={{ color: 'var(--nx-text-muted)' }}>
            Quality Checks
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span 
            className="text-sm font-mono font-semibold"
            style={{ color: allPassed ? 'var(--nx-success)' : 'var(--nx-warning)' }}
          >
            {passedCount}/{totalCount}
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
        <div 
          className="px-5 pb-5 space-y-2 nx-fade-in border-t"
          style={{ borderColor: 'var(--nx-border)' }}
        >
          <div className="pt-4" />
          {gates.map((gate) => (
            <div
              key={gate.gateId}
              className="flex items-start gap-3 p-3 rounded-xl transition-all"
              style={{ backgroundColor: 'rgba(10, 15, 26, 0.5)' }}
            >
              <div 
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ 
                  backgroundColor: gate.passed ? 'var(--nx-success)' : 'var(--nx-error)',
                  boxShadow: gate.passed 
                    ? '0 0 6px rgba(0, 255, 136, 0.6)' 
                    : '0 0 6px rgba(239, 68, 68, 0.6)'
                }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium" style={{ color: 'var(--nx-text)' }}>
                  {gate.gateName}
                </span>
                {gate.reason && (
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--nx-text-dim)' }}>
                    {gate.reason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
