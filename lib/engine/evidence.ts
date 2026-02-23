import { generateJSON } from "./llm";
import type { GateResult, EvidenceClaim } from "@/types/gate";

interface EvidenceEvaluation {
  passed: boolean;
  evidence: Array<{
    claim: string;
    source_field: string | null;
    source_quote: string | null;
    verified: boolean;
    reason?: string;
  }>;
  reason: string;
}

/**
 * Evidence Gate - The Core Differentiator
 *
 * This gate verifies that every factual claim in the output
 * can be traced back to something the user actually provided.
 *
 * It prevents:
 * - Hallucinated metrics ("increased revenue 47%" when user never said that)
 * - Made-up experience ("led a team of 15" when user just said "team lead")
 * - Invented details that user would have to defend in an interview
 */
export async function runEvidenceGate(
  output: string,
  inputs: Record<string, string>,
  inputLabels?: Record<string, string>
): Promise<GateResult> {
  // Build a clear representation of what the user provided
  const inputDescription = Object.entries(inputs)
    .filter(([_, value]) => value && value.trim())
    .map(([key, value]) => {
      const label = inputLabels?.[key] || key.replace(/_/g, " ");
      return `[${label}]: "${value}"`;
    })
    .join("\n");

  const prompt = `You are a fact-checker for job seeker outreach messages. Your job is to verify that EVERY factual claim in the generated message can be traced to the user's provided inputs.

GENERATED MESSAGE:
"${output}"

USER'S PROVIDED INPUTS:
${inputDescription}

TASK:
1. Identify each factual claim in the message (metrics, achievements, experience, company knowledge)
2. For each claim, find the EXACT source in the user's inputs
3. Mark as VERIFIED if you can quote the source, or UNVERIFIED if it's not in the inputs

IMPORTANT DISTINCTIONS:
- VERIFIED: The claim directly matches or reasonably paraphrases user input
- UNVERIFIED: The claim adds specifics not in the input (e.g., user said "improved sales", message says "improved sales by 40%")
- UNVERIFIED: The claim invents details (team size, specific technologies, exact dates)
- VERIFIED: Reasonable inferences ARE allowed (e.g., "interested in the role" from context)

Respond with JSON:
{
  "passed": boolean (true if ALL factual claims are verified),
  "evidence": [
    {
      "claim": "the specific claim text from the message",
      "source_field": "field_name or null if unverified",
      "source_quote": "exact quote from input or null",
      "verified": true/false,
      "reason": "why verified or what's missing"
    }
  ],
  "reason": "overall assessment"
}

Be strict. If a metric appears that isn't in the input, it's unverified. Job seekers will be asked about these claims in interviews.`;

  try {
    const result = await generateJSON<EvidenceEvaluation>(prompt, {
      temperature: 0.1, // Very low for consistent fact-checking
    });

    // Transform to our format
    const evidence: EvidenceClaim[] = result.evidence.map((e) => ({
      claim: e.claim,
      sourceField: e.source_field,
      sourceQuote: e.source_quote,
      verified: e.verified,
      reason: e.reason,
    }));

    const unverifiedCount = evidence.filter((e) => !e.verified).length;

    return {
      gateId: "evidence_gate",
      gateName: "Evidence Verification",
      passed: result.passed,
      score: evidence.length > 0 
        ? evidence.filter((e) => e.verified).length / evidence.length 
        : 1,
      reason:
        unverifiedCount > 0
          ? `${unverifiedCount} claim(s) could not be verified against your inputs`
          : "All claims verified against your inputs",
      evidence,
    };
  } catch (error) {
    console.error("Evidence gate evaluation failed:", error);
    return {
      gateId: "evidence_gate",
      gateName: "Evidence Verification",
      passed: false,
      reason: `Evidence verification failed: ${error}`,
    };
  }
}

/**
 * Quick evidence check - simpler version for follow-up messages
 * where we just need to make sure new claims aren't hallucinated
 */
export async function quickEvidenceCheck(
  output: string,
  inputs: Record<string, string>
): Promise<{ passed: boolean; issues: string[] }> {
  const result = await runEvidenceGate(output, inputs);

  const issues = (result.evidence || [])
    .filter((e) => !e.verified)
    .map((e) => `Unverified: "${e.claim}" - ${e.reason || "not in your inputs"}`);

  return {
    passed: result.passed,
    issues,
  };
}

/**
 * Get a summary of evidence for display
 */
export function summarizeEvidence(evidence: EvidenceClaim[]): {
  verified: number;
  unverified: number;
  claims: Array<{
    text: string;
    status: "verified" | "unverified";
    source?: string;
  }>;
} {
  return {
    verified: evidence.filter((e) => e.verified).length,
    unverified: evidence.filter((e) => !e.verified).length,
    claims: evidence.map((e) => ({
      text: e.claim,
      status: e.verified ? "verified" : "unverified",
      source: e.sourceField || undefined,
    })),
  };
}
