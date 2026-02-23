import { supabaseAdmin } from "./supabase";
import type { Feedback, CreateFeedbackInput } from "@/types";

export async function createFeedback(
  input: CreateFeedbackInput
): Promise<Feedback> {
  const { data, error } = await supabaseAdmin
    .from("feedback")
    .insert({
      run_id: input.runId,
      action: input.action,
      edit_diff: input.editDiff,
      got_reply: input.gotReply,
      got_interview: input.gotInterview,
      rating: input.rating,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating feedback:", error);
    throw new Error(`Failed to create feedback: ${error.message}`);
  }

  return transformFeedback(data);
}

export async function getFeedbackForRun(runId: string): Promise<Feedback[]> {
  const { data, error } = await supabaseAdmin
    .from("feedback")
    .select()
    .eq("run_id", runId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error getting feedback:", error);
    throw new Error(`Failed to get feedback: ${error.message}`);
  }

  return data.map(transformFeedback);
}

export async function updateOutcome(
  runId: string,
  gotReply: boolean,
  gotInterview?: boolean
): Promise<void> {
  // Find the most recent feedback for this run and update it
  const { error } = await supabaseAdmin
    .from("feedback")
    .update({
      got_reply: gotReply,
      got_interview: gotInterview,
    })
    .eq("run_id", runId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error updating outcome:", error);
    throw new Error(`Failed to update outcome: ${error.message}`);
  }
}

// Get aggregate stats (for analytics later)
export async function getFeedbackStats(): Promise<{
  totalRuns: number;
  copiedCount: number;
  regeneratedCount: number;
  editedCount: number;
  replyRate: number;
}> {
  const { data, error } = await supabaseAdmin.from("feedback").select("*");

  if (error) {
    console.error("Error getting feedback stats:", error);
    throw new Error(`Failed to get feedback stats: ${error.message}`);
  }

  const totalRuns = data.length;
  const copiedCount = data.filter((f) => f.action === "copied").length;
  const regeneratedCount = data.filter((f) => f.action === "regenerated").length;
  const editedCount = data.filter((f) => f.action === "edited").length;
  const withReplyData = data.filter((f) => f.got_reply !== null);
  const replyRate =
    withReplyData.length > 0
      ? withReplyData.filter((f) => f.got_reply).length / withReplyData.length
      : 0;

  return {
    totalRuns,
    copiedCount,
    regeneratedCount,
    editedCount,
    replyRate,
  };
}

// Transform database row to Feedback type
function transformFeedback(row: Record<string, unknown>): Feedback {
  return {
    id: row.id as string,
    runId: row.run_id as string,
    action: row.action as Feedback["action"],
    editDiff: row.edit_diff as string | null,
    gotReply: row.got_reply as boolean | null,
    gotInterview: row.got_interview as boolean | null,
    rating: row.rating as number | null,
    createdAt: row.created_at as string,
  };
}
