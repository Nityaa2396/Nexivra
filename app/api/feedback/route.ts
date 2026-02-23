import { NextRequest, NextResponse } from "next/server";
import { createFeedback, updateOutcome } from "@/lib/db/feedback";
import type { CreateFeedbackInput } from "@/types";

// POST /api/feedback - Record user action
export async function POST(request: NextRequest) {
  try {
    const body: CreateFeedbackInput = await request.json();
    const { runId, action, editDiff, gotReply, gotInterview, rating } = body;

    // Validate request
    if (!runId) {
      return NextResponse.json(
        { error: "Run ID is required" },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    const validActions = ["copied", "regenerated", "edited", "abandoned"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    const feedback = await createFeedback({
      runId,
      action,
      editDiff,
      gotReply,
      gotInterview,
      rating,
    });

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Failed to record feedback" },
      { status: 500 }
    );
  }
}

// PATCH /api/feedback - Update outcome (did they get a reply?)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { runId, gotReply, gotInterview } = body;

    if (!runId) {
      return NextResponse.json(
        { error: "Run ID is required" },
        { status: 400 }
      );
    }

    await updateOutcome(runId, gotReply, gotInterview);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Outcome update error:", error);
    return NextResponse.json(
      { error: "Failed to update outcome" },
      { status: 500 }
    );
  }
}
