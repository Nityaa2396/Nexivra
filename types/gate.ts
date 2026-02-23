// Quality gate types

export interface EvidenceClaim {
  claim: string;
  sourceField: string | null;
  sourceQuote: string | null;
  verified: boolean;
  reason?: string;
}

export interface GateResult {
  gateId: string;
  gateName: string;
  passed: boolean;
  score?: number; // 0-1 for scored gates
  reason: string;
  evidence?: EvidenceClaim[]; // For evidence gate
  issues?: string[]; // For tone/risk gates
}

export interface GateEvaluationInput {
  output: string;
  inputs: Record<string, string>;
  gateConfig: import("./recipe").GateConfig;
  stepOutputs?: Record<string, string>; // Outputs from previous steps
}

export interface RewriteRequest {
  originalOutput: string;
  failedGates: GateResult[];
  inputs: Record<string, string>;
  stepConfig: import("./recipe").RecipeStep;
  attempt: number;
}

export type OnFailAction = "rewrite" | "flag" | "block";

export interface GateRunResult {
  allPassed: boolean;
  results: GateResult[];
  finalOutput: string;
  attempts: number;
  evidenceMap?: EvidenceClaim[];
}
