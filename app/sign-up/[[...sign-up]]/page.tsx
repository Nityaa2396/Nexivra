import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15), transparent), #09090b',
    }}>
      <SignUp 
        appearance={{
          elements: {
            rootBox: {
              margin: '0 auto',
            },
          },
        }}
      />
    </div>
  );
}
