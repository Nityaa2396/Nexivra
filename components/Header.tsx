"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';

export function Header() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header style={{ 
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      backgroundColor: 'rgba(9, 9, 11, 0.8)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ 
        maxWidth: '1100px', 
        margin: '0 auto', 
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 200, 255, 0.1) 100%)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.15)'
          }}>
            <span style={{ 
              fontFamily: 'JetBrains Mono', 
              fontWeight: 800, 
              fontSize: '16px',
              background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>N</span>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '18px', color: '#ffffff', letterSpacing: '-0.01em' }}>
            NEXIVRA
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/recipes" style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 500 }}>
            Recipes
          </Link>
          
          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          
          {!isLoaded ? (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#27272a' }} />
          ) : isSignedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/history" style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 500 }}>
                History
              </Link>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: {
                      width: '36px',
                      height: '36px',
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <SignInButton mode="modal">
                <button style={{
                  fontSize: '14px',
                  color: '#a1a1aa',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 12px',
                }}>
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{
                  fontSize: '14px',
                  color: '#09090b',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
                }}>
                  Sign Up Free
                </button>
              </SignUpButton>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
