import { NextResponse } from "next/server";
import { listRecipes, loadRecipe } from "@/lib/engine/recipe";

// GET /api/recipes - List all recipes
export async function GET() {
  try {
    const recipes = await listRecipes();
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Error listing recipes:", error);
    return NextResponse.json(
      { error: "Failed to load recipes" },
      { status: 500 }
    );
  }
}
