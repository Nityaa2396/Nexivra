import { evaluateGate, rewriteWithFeedback } from "./llm";
import type { GateConfig } from "@/types/recipe";
import type { GateResult, GateRunResult, EvidenceClaim } from "@/types/gate";

const MAX_REWRITE_ATTEMPTS = 3;

function interpolate(
  template: string,
  variables: Record<string, unknown>
): string {
  return template.replace(/\{\{(\w+(?:\.\w+)?)\}\}/g, (_, key) => {
    const parts = key.split(".");
    let value: unknown = variables;
    for (const part of parts) {
      value = (value as Record<string, unknown>)?.[part];
    }
    if (value === undefined || value === null) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  });
}

async function runRuleGate(
  output: string,
  config: GateConfig,
  inputs: Record<string, string>
): Promise<GateResult> {
  const gateId = config.check || "rule";

  switch (config.check) {
    case "character_count": {
      const count = output.length;
      const passed =
        (!config.min || count >= config.min) &&
        (!config.max || count <= config.max);
      return {
        gateId,
        gateName: "Length Check",
        passed,
        reason: passed
          ? `Character count OK (${count})`
          : `Character count ${count}, expected ${config.min || 0}-${config.max || "∞"}`,
      };
    }

    case "word_count": {
      const count = output.split(/\s+/).filter(Boolean).length;
      const passed =
        (!config.min || count >= config.min) &&
        (!config.max || count <= config.max);
      return {
        gateId,
        gateName: "Word Count",
        passed,
        reason: passed
          ? `Word count OK (${count})`
          : `Word count ${count}, expected ${config.min || 0}-${config.max || "∞"}`,
      };
    }

    default:
      return {
        gateId,
        gateName: "Unknown Rule",
        passed: true,
        reason: "Unknown rule type, passing by default",
      };
  }
}

async function runLLMGate(
  output: string,
  config: GateConfig,
  inputs: Record<string, string>,
  stepOutputs: Record<string, unknown>,
  gateId: string,
  currentOutputKey?: string
): Promise<GateResult> {
  if (!config.prompt) {
    throw new Error(`LLM gate ${gateId} missing prompt`);
  }

  const context: Record<string, unknown> = {
    ...inputs,
    ...stepOutputs,
    output,
  };

  if (currentOutputKey) {
    context[currentOutputKey] = output;
  }

  const prompt = interpolate(config.prompt, context);

  try {
    const result = await evaluateGate(prompt, { output, inputs });

    const gateResult: GateResult = {
      gateId,
      gateName: gateId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      passed: result.passed,
      score: result.score,
      reason: result.reason,
    };

    if (result.evidence) {
      gateResult.evidence = result.evidence.map((e) => ({
        claim: e.claim,
        sourceField: e.sourceField,
        sourceQuote: e.sourceQuote,
        verified: e.verified,
        reason: e.reason,
      }));
      
      // For evidence gate: if ANY claim is unverified, gate fails
      const unverifiedClaims = gateResult.evidence.filter(e => !e.verified);
      if (unverifiedClaims.length > 0) {
        gateResult.passed = false;
        gateResult.reason = `${unverifiedClaims.length} claim(s) could not be verified: ${unverifiedClaims.map(c => `"${c.claim}"`).join(', ')}`;
      }
    }

    if (result.issues) {
      gateResult.issues = result.issues;
    }

    // Check for hallucinations_found field (from stricter evidence gate)
    if ((result as Record<string, unknown>).hallucinations_found) {
      const hallucinations = (result as Record<string, unknown>).hallucinations_found as string[];
      if (hallucinations && hallucinations.length > 0) {
        gateResult.passed = false;
        gateResult.reason = `Hallucinations found: ${hallucinations.join(', ')}`;
        gateResult.issues = hallucinations;
      }
    }

    return gateResult;
  } catch (error) {
    console.error(`Gate ${gateId} evaluation failed:`, error);
    return {
      gateId,
      gateName: gateId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      passed: true,
      reason: `Gate evaluation failed: ${error}. Passing with warning.`,
    };
  }
}

export async function runGate(
  output: string,
  gateId: string,
  config: GateConfig,
  inputs: Record<string, string>,
  stepOutputs: Record<string, unknown> = {},
  currentOutputKey?: string
): Promise<GateResult> {
  if (config.type === "rule") {
    return runRuleGate(output, config, inputs);
  } else if (config.type === "llm_judge") {
    return runLLMGate(output, config, inputs, stepOutputs, gateId, currentOutputKey);
  } else {
    throw new Error(`Unknown gate type: ${config.type}`);
  }
}

export async function runGatesWithRetry(
  initialOutput: string,
  gateIds: string[],
  gateConfigs: Record<string, GateConfig>,
  inputs: Record<string, string>,
  stepOutputs: Record<string, unknown>,
  originalPrompt: string,
  currentOutputKey?: string
): Promise<GateRunResult> {
  let currentOutput = initialOutput;
  let attempts = 1;
  let allResults: GateResult[] = [];
  let evidenceMap: EvidenceClaim[] | undefined;

  while (attempts <= MAX_REWRITE_ATTEMPTS + 1) {
    const results: GateResult[] = [];

    // Sort gates by priority
    const sortedGateIds = [...gateIds].sort((a, b) => {
      const priorityA = gateConfigs[a]?.priority ?? 99;
      const priorityB = gateConfigs[b]?.priority ?? 99;
      return priorityA - priorityB;
    });

    for (const gateId of sortedGateIds) {
      const config = gateConfigs[gateId];
      if (!config) {
        console.warn(`Gate config not found for: ${gateId}`);
        continue;
      }

      const result = await runGate(
        currentOutput,
        gateId,
        config,
        inputs,
        stepOutputs,
        currentOutputKey
      );
      results.push(result);

      // Collect evidence map from evidence gate
      if (gateId === "evidence_gate" && result.evidence) {
        evidenceMap = result.evidence;
      }
    }

    allResults = results;

    // Check if all passed
    const failedGates = results.filter((r) => !r.passed);

    if (failedGates.length === 0) {
      // All passed!
      return {
        allPassed: true,
        results,
        finalOutput: currentOutput,
        attempts,
        evidenceMap,
      };
    }

    // Check if any failures require rewrite
    const gatesToRewrite = failedGates.filter((r) => {
      const config = gateConfigs[r.gateId];
      return config?.onFail === "rewrite";
    });

    if (gatesToRewrite.length === 0 || attempts > MAX_REWRITE_ATTEMPTS) {
      // No rewrite needed or max attempts reached
      console.log(`Stopping after ${attempts} attempts. Failed gates: ${failedGates.map(g => g.gateId).join(', ')}`);
      return {
        allPassed: false,
        results,
        finalOutput: currentOutput,
        attempts,
        evidenceMap,
      };
    }

    // Build detailed feedback for rewrite
    const failureReasons = gatesToRewrite.map((r) => {
      let feedback = `${r.gateName}: ${r.reason}`;
      
      // Add specific guidance for evidence gate failures
      if (r.gateId === "evidence_gate" && r.evidence) {
        const unverified = r.evidence.filter(e => !e.verified);
        if (unverified.length > 0) {
          feedback += `\n  REMOVE these hallucinated claims:\n`;
          unverified.forEach(claim => {
            feedback += `  - "${claim.claim}" (${claim.reason})\n`;
          });
          feedback += `  ONLY use facts from the user's actual experience.`;
        }
      }
      
      // Add specific guidance for other gates
      if (r.issues && r.issues.length > 0) {
        feedback += `\n  Issues: ${r.issues.join(', ')}`;
      }
      
      return feedback;
    });

    console.log(`Attempt ${attempts}: Rewriting due to ${gatesToRewrite.length} gate failures`);
    console.log('Failures:', failureReasons.join('\n'));

    // Enhanced rewrite prompt with specific anti-hallucination guidance
    const enhancedPrompt = `${originalPrompt}

CRITICAL: Previous attempt had HALLUCINATIONS. You MUST:
1. ONLY use facts from the user's stated experience
2. Do NOT invent metrics, industries, or skills
3. Do NOT use skills from the job description as if they're the user's

${failureReasons.join('\n\n')}`;

    currentOutput = await rewriteWithFeedback(
      currentOutput,
      failureReasons,
      enhancedPrompt
    );

    attempts++;
  }

  return {
    allPassed: false,
    results: allResults,
    finalOutput: currentOutput,
    attempts,
    evidenceMap,
  };
}
