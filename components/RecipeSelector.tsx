"use client";

import Link from "next/link";
import { useState } from "react";

const CATEGORY_CONFIG: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  "first-contact": {
    icon: "💬",
    color: "#00ff88",
    bg: "rgba(0, 255, 136, 0.1)",
    border: "rgba(0, 255, 136, 0.2)",
  },
  "follow-up": {
    icon: "↩️",
    color: "#fbbf24",
    bg: "rgba(251, 191, 36, 0.1)",
    border: "rgba(251, 191, 36, 0.2)",
  },
  "engagement": {
    icon: "👁️",
    color: "#a78bfa",
    bg: "rgba(167, 139, 250, 0.1)",
    border: "rgba(167, 139, 250, 0.2)",
  },
  "email": {
    icon: "📧",
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
  { id: "recruiter-dm", name: "Recruiter LinkedIn DM", description: "Cold outreach that gets replies", category: "first-contact", gates: 7 },
  { id: "follow-up", name: "Follow-Up Message", description: "Second touch after no reply", category: "follow-up", gates: 5 },
  { id: "recruiter-comment", name: "Comment on Recruiter Post", description: "Build presence, not pitch", category: "engagement", gates: 5 },
  { id: "cold-email", name: "Cold Email", description: "Direct email outreach", category: "email", gates: 8 },
];

export function RecipeSelector() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRecipes = selectedCategory
    ? RECIPES.filter((r) => r.category === selectedCategory)
    : RECIPES;

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: !selectedCategory ? "#00ff88" : "rgba(255,255,255,0.1)",
            background: !selectedCategory ? "rgba(0,255,136,0.1)" : "transparent",
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
              borderColor: selectedCategory === key ? config.color : "rgba(255,255,255,0.1)",
              background: selectedCategory === key ? config.bg : "transparent",
              color: selectedCategory === key ? config.color : "#a1a1aa",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            {config.icon} {key.replace("-", " ")}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {filteredRecipes.map((recipe) => {
          const config = CATEGORY_CONFIG[recipe.category];
          return (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              style={{
                padding: "24px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "block",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{config.icon}</div>
              <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "16px", marginBottom: "4px" }}>{recipe.name}</h3>
              <p style={{ color: "#71717a", fontSize: "13px", marginBottom: "12px" }}>{recipe.description}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {Array.from({ length: recipe.gates }).map((_, i) => (
                  <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: config.color }} />
                ))}
                <span style={{ fontSize: "12px", color: config.color, fontFamily: "JetBrains Mono" }}>
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
