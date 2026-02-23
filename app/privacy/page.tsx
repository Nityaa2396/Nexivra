import { Header } from "@/components/Header";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#09090b',
        zIndex: -1
      }} />
      
      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '32px', color: '#ffffff' }}>
          Privacy Policy
        </h1>
        
        <div style={{ color: '#a1a1aa', lineHeight: 1.8, fontSize: '15px' }}>
          <p style={{ marginBottom: '24px' }}>
            <strong style={{ color: '#ffffff' }}>Last updated:</strong> February 2026
          </p>
          
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
            Information We Collect
          </h2>
          <p style={{ marginBottom: '16px' }}>
            When you use Nexivra, we collect:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '24px' }}>
            <li>Account information (email, name) from Google/LinkedIn sign-in</li>
            <li>Message inputs and generated outputs you create</li>
            <li>Usage data to improve our service</li>
          </ul>
          
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
            How We Use Your Information
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We use your information to:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '24px' }}>
            <li>Provide and improve our message generation service</li>
            <li>Store your generation history for your convenience</li>
            <li>Send important service updates</li>
          </ul>
          
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
            Data Security
          </h2>
          <p style={{ marginBottom: '24px' }}>
            Your data is stored securely using industry-standard encryption. We use Clerk for authentication and Supabase for data storage, both of which maintain SOC 2 compliance.
          </p>
          
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
            Your Rights
          </h2>
          <p style={{ marginBottom: '24px' }}>
            You can request deletion of your account and all associated data at any time by contacting us.
          </p>
          
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
            Contact
          </h2>
          <p>
            For privacy concerns, contact us at privacy@nexivra.com
          </p>
        </div>
      </main>
    </>
  );
}
