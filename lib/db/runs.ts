import { supabaseAdmin } from "./supabase";
import type { Run, CreateRunInput, UpdateRunInput } from "@/types";

export async function createRun(input: CreateRunInput): Promise<Run> {
  const { data, error } = await supabaseAdmin
    .from("runs")
    .insert({
      visitor_id: input.visitorId,
      user_id: input.userId,
      recipe_id: input.recipeId,
      inputs: input.inputs,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating run:", error);
    throw new Error(`Failed to create run: ${error.message}`);
  }

  return transformRun(data);
}

export async function updateRun(
  runId: string,
  input: UpdateRunInput
): Promise<Run> {
  const { data, error } = await supabaseAdmin
    .from("runs")
    .update({
      output: input.output,
      gate_results: input.gateResults,
      evidence_map: input.evidenceMap,
      attempts: input.attempts,
    })
    .eq("id", runId)
    .select()
    .single();

  if (error) {
    console.error("Error updating run:", error);
    throw new Error(`Failed to update run: ${error.message}`);
  }

  return transformRun(data);
}

export async function getRun(runId: string): Promise<Run | null> {
  const { data, error } = await supabaseAdmin
    .from("runs")
    .select()
    .eq("id", runId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    console.error("Error getting run:", error);
    throw new Error(`Failed to get run: ${error.message}`);
  }

  return transformRun(data);
}

export async function getRunsByVisitor(visitorId: string): Promise<Run[]> {
  const { data, error } = await supabaseAdmin
    .from("runs")
    .select()
    .eq("visitor_id", visitorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error getting runs:", error);
    throw new Error(`Failed to get runs: ${error.message}`);
  }

  return data.map(transformRun);
}

// Transform database row to Run type
function transformRun(row: Record<string, unknown>): Run {
  return {
    id: row.id as string,
    visitorId: row.visitor_id as string | null,
    userId: row.user_id as string | null,
    recipeId: row.recipe_id as string,
    inputs: row.inputs as Record<string, string>,
    output: row.output as string | null,
    gateResults: row.gate_results as Run["gateResults"],
    evidenceMap: row.evidence_map as Run["evidenceMap"],
    attempts: row.attempts as number,
    createdAt: row.created_at as string,
  };
}
