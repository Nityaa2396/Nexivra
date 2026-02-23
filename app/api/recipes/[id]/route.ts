import { NextRequest, NextResponse } from "next/server";
import { loadRecipe } from "@/lib/engine/recipe";

// GET /api/recipes/[id] - Get a specific recipe
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipe = await loadRecipe(id);

    // Return recipe without internal gate prompts (for security)
    const publicRecipe = {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      category: recipe.category,
      inputs: recipe.inputs,
      output: recipe.output,
    };

    return NextResponse.json({ recipe: publicRecipe });
  } catch (error) {
    console.error("Error loading recipe:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to load recipe" },
      { status: 500 }
    );
  }
}
