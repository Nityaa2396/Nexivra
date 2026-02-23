// Recipe configuration types

export interface RecipeInput {
  id: string;
  type: "text" | "textarea" | "select";
  label: string;
  placeholder?: string;
  required: boolean;
  help?: string;
  maxLength?: number;
  options?: {
    value: string;
    label: string;
  }[];
  default?: string;
}

export interface RecipeStep {
  id: string;
  name: string;
  prompt: string;
  outputKey: string;
  gates?: string[];
}

export interface GateConfig {
  type: "rule" | "llm_judge";
  priority?: number;
  prompt?: string;
  check?: "character_count" | "word_count" | "contains_pattern";
  min?: number;
  max?: number;
  patterns?: Record<string, string[]>;
  matchField?: string;
  onFail: "rewrite" | "flag" | "block";
  maxRetries?: number;
  failMessage?: string;
}

export interface RecipeOutput {
  format: "text" | "email";
  fields?: string[];
  maxLength?: number;
  showEvidenceMap: boolean;
  showGateScores: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  version?: string;
  inputs: RecipeInput[];
  steps: RecipeStep[];
  gates: Record<string, GateConfig>;
  output: RecipeOutput;
}

// Recipe with parsed YAML
export interface LoadedRecipe extends Recipe {
  rawConfig: string;
}
