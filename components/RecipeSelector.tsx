"use client";

import Link from "next/link";

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
}

const CATEGORY_CONFIG: Record<string, { icon: JSX.Element; color: string; bg: string; border: string }> = {
  "first-contact": {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: "var(--nx-accent)",
    bg: "var(--nx-accent-glow)",
    border: "rgba(0, 255, 136, 0.3)",
  },
  "follow-up": {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    ),
    color: "#fbbf24",
    bg: "rgba(251, 191, 36, 0.1)",
    border: "rgba(251, 191, 36, 0.3)",
  },
  "presence": {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    color: "#a78bfa",
    bg: "rgba(167, 139, 250, 0.1)",
    border: "rgba(167, 139, 250, 0.3)",
  },
};

interface RecipeSelectorProps {
  recipes: Recipe[];
}

export function RecipeSelector({ recipes }: RecipeSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {recipes.map((recipe) => {
        const config = CATEGORY_CONFIG[recipe.category] || {
          icon: <span>📄</span>,
          color: "var(--nx-text-muted)",
          bg: "var(--nx-bg)",
          border: "var(--nx-border)",
        };

        return (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="group nx-card transition-all duration-300 hover:border-emerald-500/50"
            style={{ borderColor: 'var(--nx-border)' }}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0"
                style={{ 
                  color: config.color,
                  backgroundColor: config.bg,
                  borderColor: config.border,
                }}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 
                    className="font-semibold group-hover:text-emerald-400 transition-colors"
                    style={{ color: 'var(--nx-text)' }}
                  >
                    {recipe.name}
                  </h3>
                  <svg 
                    className="w-4 h-4 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" 
                    style={{ color: 'var(--nx-text-dim)' }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm line-clamp-2" style={{ color: 'var(--nx-text-muted)' }}>
                  {recipe.description}
                </p>
                
                {/* Category badge */}
                <div className="mt-3">
                  <span 
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-md border"
                    style={{ 
                      color: config.color,
                      backgroundColor: config.bg,
                      borderColor: config.border,
                    }}
                  >
                    {recipe.category.replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
