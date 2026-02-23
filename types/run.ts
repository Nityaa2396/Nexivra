// Run and feedback types

import { GateResult, EvidenceClaim } from "./gate";

export interface Run {
  id: string;
  visitorId: string | null;
  userId: string | null;
  recipeId: string;
  inputs: Record<string, string>;
  output: string | null;
  gateResults: GateResult[] | null;
  evidenceMap: EvidenceClaim[] | null;
  attempts: number;
  createdAt: string;
}

export interface CreateRunInput {
  visitorId?: string;
  userId?: string;
  recipeId: string;
  inputs: Record<string, string>;
}

export interface UpdateRunInput {
  output: string;
  gateResults: GateResult[];
  evidenceMap?: EvidenceClaim[];
  attempts: number;
}

export type FeedbackAction = "copied" | "regenerated" | "edited" | "abandoned";

export interface Feedback {
  id: string;
  runId: string;
  action: FeedbackAction;
  editDiff: string | null;
  gotReply: boolean | null;
  gotInterview: boolean | null;
  rating: number | null;
  createdAt: string;
}

export interface CreateFeedbackInput {
  runId: string;
  action: FeedbackAction;
  editDiff?: string;
  gotReply?: boolean;
  gotInterview?: boolean;
  rating?: number;
}

// API request/response types
export interface GenerateRequest {
  recipeId: string;
  inputs: Record<string, string>;
  visitorId?: string;
}

export interface GenerateResponse {
  runId: string;
  output: string;
  gateResults: GateResult[];
  evidenceMap?: EvidenceClaim[];
  attempts: number;
  allGatesPassed: boolean;
}
