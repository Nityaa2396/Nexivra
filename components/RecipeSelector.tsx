import React from "react";
("use client");

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  "first-contact": {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    color: "#00ff88",
    bg: "rgba(0, 255, 136, 0.1)",
    border: "rgba(0, 255, 136, 0.2)",
  },
  "follow-up": {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
        />
      </svg>
    ),
    color: "#fbbf24",
    bg: "rgba(251, 191, 36, 0.1)",
    border: "rgba(251, 191, 36, 0.2)",
  },
  engagement: {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
    color: "#a78bfa",
    bg: "rgba(167, 139, 250, 0.1)",
    border: "rgba(167, 139, 250, 0.2)",
  },
  email: {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    color: "#60a5fa",
    bg: "rgba(96, 165, 250, 0.1)",
    border: "rgba(96, 165, 250, 0.2)",
  },
};

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  gates: number;
}

const RECIPES: Recipe[] = [
  {
    id: "recruiter-dm",
    name: "Recruiter LinkedIn DM",
    description: "Cold outreach that gets replies",
    category: "first-contact",
    gates: 7,
  },
  {
    id: "follow-up",
    name: "Follow-Up Message",
    description: "Second touch after no reply",
    category: "follow-up",
    gates: 5,
  },
  {
    id: "recruiter-comment",
    name: "Comment on Recruiter Post",
    description: "Build presence, not pitch",
    category: "engagement",
    gates: 5,
  },
  {
    id: "cold-email",
    name: "Cold Email",
    description: "Direct email outreach",
    category: "email",
    gates: 8,
  },
];

export function RecipeSelector() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRecipes = selectedCategory
    ? RECIPES.filter((r) => r.category === selectedCategory)
    : RECIPES;

  return (
    <div>
      {/* Category filters */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: !selectedCategory
              ? "#00ff88"
              : "rgba(255,255,255,0.1)",
            background: !selectedCategory
              ? "rgba(0,255,136,0.1)"
              : "transparent",
            color: !selectedCategory ? "#00ff88" : "#a1a1aa",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          All
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor:
                selectedCategory === key
                  ? config.color
                  : "rgba(255,255,255,0.1)",
              background: selectedCategory === key ? config.bg : "transparent",
              color: selectedCategory === key ? config.color : "#a1a1aa",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {config.icon}
            {key.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Recipe cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {filteredRecipes.map((recipe) => {
          const config = CATEGORY_CONFIG[recipe.category];
          return (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              style={{
                padding: "24px",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "block",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: config.bg,
                    border: `1px solid ${config.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: config.color,
                  }}
                >
                  {config.icon}
                </div>
                <div>
                  <h3
                    style={{ color: "#fff", fontWeight: 600, fontSize: "16px" }}
                  >
                    {recipe.name}
                  </h3>
                  <p style={{ color: "#71717a", fontSize: "13px" }}>
                    {recipe.description}
                  </p>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {Array.from({ length: recipe.gates }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: config.color,
                    }}
                  />
                ))}
                <span
                  style={{
                    fontSize: "12px",
                    color: config.color,
                    fontFamily: "JetBrains Mono",
                  }}
                >
                  {recipe.gates} gates
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
