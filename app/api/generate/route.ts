import { NextRequest, NextResponse } from "next/server";
import { executeRecipe, loadRecipe } from "@/lib/engine/recipe";
import { createRun, updateRun } from "@/lib/db/runs";
import type { GenerateRequest, GenerateResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { recipeId, inputs, visitorId } = body;

    // Validate request
    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    if (!inputs || Object.keys(inputs).length === 0) {
      return NextResponse.json(
        { error: "Inputs are required" },
        { status: 400 }
      );
    }

    // Load recipe to validate inputs
    const recipe = await loadRecipe(recipeId);

    // Check required inputs
    const missingInputs = recipe.inputs
      .filter((input) => input.required && !inputs[input.id]?.trim())
      .map((input) => input.label);

    if (missingInputs.length > 0) {
      return NextResponse.json(
        { error: `Missing required inputs: ${missingInputs.join(", ")}` },
        { status: 400 }
      );
    }

    // Create run record
    const run = await createRun({
      recipeId,
      inputs,
      visitorId,
    });

    // Execute recipe
    console.log(`Executing recipe: ${recipeId} for run: ${run.id}`);
    const result = await executeRecipe(recipeId, inputs);

    // Update run with results
    await updateRun(run.id, {
      output: result.output,
      gateResults: result.gateResults,
      evidenceMap: result.evidenceMap,
      attempts: result.attempts,
    });

    // Build response
    const response: GenerateResponse = {
      runId: run.id,
      output: result.output,
      gateResults: result.gateResults,
      evidenceMap: result.evidenceMap,
      attempts: result.attempts,
      allGatesPassed: result.allGatesPassed,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Generate API error:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("Recipe not found")) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }

      if (error.message.includes("ANTHROPIC_API_KEY")) {
        return NextResponse.json(
          { error: "API configuration error. Please check server settings." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
