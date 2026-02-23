"use client";

import { useState } from "react";

interface OutputDisplayProps {
  output: string;
  subject?: string;
  attempts?: number;
  onRegenerate?: () => void;
  isLoading?: boolean;
}

export function OutputDisplay({ 
  output, 
  subject,
  attempts = 1, 
  onRegenerate,
  isLoading 
}: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = subject ? `Subject: ${subject}\n\n${output}` : output;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div 
        className="p-6 rounded-2xl border"
        style={{ backgroundColor: 'var(--nx-bg-card)', borderColor: 'var(--nx-border)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--nx-accent-glow)' }}
          >
            <svg className="w-4 h-4 nx-spin" style={{ color: 'var(--nx-accent)' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <span className="text-sm font-mono" style={{ color: 'var(--nx-text-muted)' }}>
            Generating...
          </span>
        </div>
        <div className="space-y-2">
          <div className="h-4 rounded-lg nx-pulse" style={{ backgroundColor: 'var(--nx-bg)', width: '85%' }} />
          <div className="h-4 rounded-lg nx-pulse" style={{ backgroundColor: 'var(--nx-bg)', width: '100%' }} />
          <div className="h-4 rounded-lg nx-pulse" style={{ backgroundColor: 'var(--nx-bg)', width: '70%' }} />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-6 rounded-2xl border nx-slide-up"
      style={{ 
        backgroundColor: 'var(--nx-bg-card)', 
        borderColor: 'rgba(0, 255, 136, 0.2)',
        boxShadow: '0 0 30px rgba(0, 255, 136, 0.05)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center border"
            style={{ 
              backgroundColor: 'var(--nx-accent-glow)', 
              borderColor: 'rgba(0, 255, 136, 0.3)',
              boxShadow: '0 0 15px rgba(0, 255, 136, 0.2)'
            }}
          >
            <svg className="w-4 h-4" style={{ color: 'var(--nx-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-medium" style={{ color: 'var(--nx-text)' }}>
              Output
            </span>
            {attempts > 1 && (
              <p className="text-xs" style={{ color: 'var(--nx-accent)' }}>
                Refined {attempts - 1}x
              </p>
            )}
          </div>
        </div>
        
        <span 
          className="text-xs font-mono px-2 py-1 rounded-lg"
          style={{ backgroundColor: 'var(--nx-bg)', color: 'var(--nx-text-dim)' }}
        >
          {output.length} chars
        </span>
      </div>

      {/* Subject line */}
      {subject && (
        <div className="mb-3 pb-3 border-b" style={{ borderColor: 'var(--nx-border)' }}>
          <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--nx-text-dim)' }}>
            Subject
          </span>
          <p className="mt-1 font-medium" style={{ color: 'var(--nx-text)' }}>{subject}</p>
        </div>
      )}

      {/* Output content */}
      <div 
        className="rounded-xl border p-4 mb-4"
        style={{ backgroundColor: 'var(--nx-bg)', borderColor: 'var(--nx-border)' }}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--nx-text)' }}>
          {output}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="nx-btn-primary flex-1 py-3 rounded-xl text-sm"
          style={copied ? { background: 'var(--nx-success)' } : {}}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>

        {onRegenerate && (
          <button 
            onClick={onRegenerate} 
            className="nx-btn-secondary py-3 px-4 rounded-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
