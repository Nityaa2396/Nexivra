import { promises as fs } from "fs";
import path from "path";
import yaml from "yaml";
import { generateText } from "./llm";
import { runGatesWithRetry } from "./gates";
import type { Recipe, RecipeStep } from "@/types/recipe";
import type { GateResult, EvidenceClaim } from "@/types/gate";

const recipeCache = new Map<string, Recipe>();

function interpolate(
  template: string,
  variables: Record<string, unknown>
): string {
  // Handle conditionals: {{#if var}}content{{/if}}
  let result = template.replace(
    /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, varName, content) => {
      const value = variables[varName];
      return value && String(value).trim() ? content : "";
    }
  );

  // Handle simple variables: {{variable}} and {{object.property}}
  result = result.replace(/\{\{(\w+(?:\.\w+)?)\}\}/g, (_, key) => {
    const parts = key.split(".");
    let value: unknown = variables;
    for (const part of parts) {
      value = (value as Record<string, unknown>)?.[part];
    }
    if (value === undefined || value === null) return "";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  });

  return result;
}

function tryParseJSON(str: string): unknown {
  try {
    let cleaned = str.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }
    return JSON.parse(cleaned.trim());
  } catch {
    return str;
  }
}

export async function loadRecipe(recipeId: string): Promise<Recipe> {
  if (recipeCache.has(recipeId)) {
    return recipeCache.get(recipeId)!;
  }

  const recipePath = path.join(process.cwd(), "recipes", `${recipeId}.yaml`);

  try {
    const content = await fs.readFile(recipePath, "utf-8");
    const recipe = yaml.parse(content) as Recipe;

    if (!recipe.id || !recipe.name || !recipe.inputs || !recipe.steps) {
      throw new Error(`Invalid recipe: missing required fields`);
    }

    recipeCache.set(recipeId, recipe);
    return recipe;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Recipe not found: ${recipeId}`);
    }
    throw error;
  }
}

export async function listRecipes(): Promise<
  Array<{ id: string; name: string; description: string; category: string }>
> {
  const recipesDir = path.join(process.cwd(), "recipes");

  try {
    const files = await fs.readdir(recipesDir);
    const yamlFiles = files.filter((f) => f.endsWith(".yaml"));

    const recipes = await Promise.all(
      yamlFiles.map(async (file) => {
        const id = file.replace(".yaml", "");
        const recipe = await loadRecipe(id);
        return {
          id: recipe.id,
          name: recipe.name,
          description: recipe.description,
          category: recipe.category,
        };
      })
    );

    return recipes;
  } catch (error) {
    console.error("Error listing recipes:", error);
    return [];
  }
}

async function executeStep(
  step: RecipeStep,
  inputs: Record<string, string>,
  stepOutputs: Record<string, unknown>
): Promise<string> {
  const context: Record<string, unknown> = {
    ...inputs,
    ...stepOutputs,
  };

  const prompt = interpolate(step.prompt, context);

  const response = await generateText(prompt, {
    temperature: 0.7,
  });

  return response.content.trim();
}

export interface RecipeExecutionResult {
  output: string;
  gateResults: GateResult[];
  evidenceMap?: EvidenceClaim[];
  attempts: number;
  stepOutputs: Record<string, unknown>;
  allGatesPassed: boolean;
}

export async function executeRecipe(
  recipeId: string,
  inputs: Record<string, string>
): Promise<RecipeExecutionResult> {
  const recipe = await loadRecipe(recipeId);

  const stepOutputs: Record<string, unknown> = {};
  let finalGateResults: GateResult[] = [];
  let finalEvidenceMap: EvidenceClaim[] | undefined;
  let totalAttempts = 0;
  let allGatesPassed = true;

  for (const step of recipe.steps) {
    console.log(`Executing step: ${step.name}`);

    const initialOutput = await executeStep(step, inputs, stepOutputs);

    if (step.gates && step.gates.length > 0) {
      const gateResult = await runGatesWithRetry(
        initialOutput,
        step.gates,
        recipe.gates,
        inputs,
        stepOutputs,
        step.prompt,
        step.outputKey
      );

      // Try to parse as JSON for subsequent steps
      stepOutputs[step.outputKey] = tryParseJSON(gateResult.finalOutput);
      finalGateResults = [...finalGateResults, ...gateResult.results];
      totalAttempts += gateResult.attempts;

      if (gateResult.evidenceMap) {
        finalEvidenceMap = gateResult.evidenceMap;
      }

      if (!gateResult.allPassed) {
        allGatesPassed = false;
      }
    } else {
      // No gates - try to parse as JSON
      stepOutputs[step.outputKey] = tryParseJSON(initialOutput);
      totalAttempts += 1;
    }
  }

  // Determine final output
  let finalOutput: string;

  if (recipe.output.fields && recipe.output.fields.length > 0) {
    finalOutput = recipe.output.fields
      .map((field) => {
        const val = stepOutputs[field];
        return typeof val === "string" ? val : JSON.stringify(val);
      })
      .filter(Boolean)
      .join("\n\n");
  } else {
    const lastStep = recipe.steps[recipe.steps.length - 1];
    const lastOutput = stepOutputs[lastStep.outputKey];
    finalOutput = typeof lastOutput === "string" ? lastOutput : JSON.stringify(lastOutput);
  }

  return {
    output: finalOutput,
    gateResults: finalGateResults,
    evidenceMap: finalEvidenceMap,
    attempts: totalAttempts,
    stepOutputs,
    allGatesPassed,
  };
}

export function clearRecipeCache(): void {
  recipeCache.clear();
}
