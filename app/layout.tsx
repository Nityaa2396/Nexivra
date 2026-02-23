import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata = {
  title: "Nexivra | Job Seeker Outreach",
  description: "AI-powered outreach with quality gates that verify every claim",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00ff88",
          colorBackground: "#18181b",
          colorInputBackground: "#27272a",
          colorInputText: "#fafafa",
          colorText: "#fafafa",
          colorTextSecondary: "#a1a1aa",
          colorTextOnPrimaryBackground: "#09090b",
          borderRadius: "0.75rem",
        },
        elements: {
          // Card & Modal
          card: {
            backgroundColor: "#18181b",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          },

          // Headers
          headerTitle: {
            color: "#fafafa",
          },
          headerSubtitle: {
            color: "#a1a1aa",
          },

          // Primary Button
          formButtonPrimary: {
            backgroundColor: "#00ff88",
            color: "#09090b",
            "&:hover": {
              backgroundColor: "#00cc6a",
            },
          },

          // Social Buttons (Google, LinkedIn)
          socialButtonsBlockButton: {
            backgroundColor: "#27272a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#fafafa",
            "&:hover": {
              backgroundColor: "#3f3f46",
            },
          },
          socialButtonsBlockButtonText: {
            color: "#fafafa",
          },

          // Divider
          dividerLine: {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
          dividerText: {
            color: "#71717a",
          },

          // Form Fields
          formFieldLabel: {
            color: "#a1a1aa",
          },
          formFieldInput: {
            backgroundColor: "#27272a",
            borderColor: "rgba(255, 255, 255, 0.1)",
            color: "#fafafa",
          },

          // Footer Links
          footerActionLink: {
            color: "#00ff88",
          },
          footerActionText: {
            color: "#a1a1aa",
          },

          // User Button Dropdown Menu
          userButtonPopoverCard: {
            backgroundColor: "#18181b",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          userButtonPopoverActions: {
            backgroundColor: "#18181b",
          },
          userButtonPopoverActionButton: {
            color: "#fafafa",
            "&:hover": {
              backgroundColor: "#27272a",
            },
          },
          userButtonPopoverActionButtonText: {
            color: "#fafafa",
          },
          userButtonPopoverActionButtonIcon: {
            color: "#a1a1aa",
          },
          userButtonPopoverFooter: {
            backgroundColor: "#18181b",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          },
          userPreviewMainIdentifier: {
            color: "#fafafa",
          },
          userPreviewSecondaryIdentifier: {
            color: "#a1a1aa",
          },

          // Menu items
          menuButton: {
            color: "#fafafa",
          },
          menuItem: {
            color: "#fafafa",
            "&:hover": {
              backgroundColor: "#27272a",
            },
          },
          menuList: {
            backgroundColor: "#18181b",
          },

          // Badge
          badge: {
            backgroundColor: "rgba(251, 191, 36, 0.1)",
            color: "#fbbf24",
          },

          // Modal close button
          modalCloseButton: {
            color: "#a1a1aa",
            "&:hover": {
              color: "#fafafa",
            },
          },
        },
      }}
    >
      <html lang="en">
        <body>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
