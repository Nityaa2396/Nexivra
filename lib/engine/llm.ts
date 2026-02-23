import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 1024;

export interface LLMResponse {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export async function generateText(
  prompt: string,
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): Promise<LLMResponse> {
  const response = await anthropic.messages.create({
    model: options?.model || DEFAULT_MODEL,
    max_tokens: options?.maxTokens || MAX_TOKENS,
    temperature: options?.temperature ?? 0.7,
    system: options?.systemPrompt,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === "text");
  const content = textContent?.type === "text" ? textContent.text : "";

  return {
    content,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    },
  };
}

export async function generateJSON<T>(
  prompt: string,
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): Promise<T> {
  const systemPrompt = `${options?.systemPrompt || ""}
You must respond with valid JSON only. No markdown, no explanation, just the JSON object.`;

  const response = await generateText(prompt, {
    ...options,
    systemPrompt: systemPrompt.trim(),
    temperature: options?.temperature ?? 0.3,
  });

  try {
    let jsonStr = response.content.trim();

    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.slice(0, -3);
    }

    return JSON.parse(jsonStr.trim()) as T;
  } catch (error) {
    console.error("Failed to parse JSON response:", response.content);
    throw new Error(`Failed to parse LLM JSON response: ${error}`);
  }
}

export async function evaluateGate(
  gatePrompt: string,
  context: {
    output: string;
    inputs: Record<string, string>;
  }
): Promise<{
  passed: boolean;
  score?: number;
  reason: string;
  evidence?: Array<{
    claim: string;
    sourceField: string | null;
    sourceQuote: string | null;
    verified: boolean;
    reason?: string;
  }>;
  issues?: string[];
  hallucinations_found?: string[];
}> {
  const systemPrompt = `You are a strict quality gate evaluator. Your job is to evaluate AI-generated content against specific criteria.

CRITICAL RULES:
1. Be STRICT about hallucinations - if a claim cannot be traced to user input, it's hallucinated
2. JD requirements are NOT user experience - don't confuse what the job wants with what the user has
3. If metrics appear that aren't in user input, they're invented
4. If industries/platforms appear that user didn't mention, they're invented
5. One hallucination = gate fails

Always respond with valid JSON matching the requested format.`;

  return generateJSON(gatePrompt, {
    systemPrompt,
    temperature: 0.1, // Very low temp for consistent, strict evaluation
  });
}

export async function rewriteWithFeedback(
  originalOutput: string,
  failureReasons: string[],
  originalPrompt: string
): Promise<string> {
  const systemPrompt = `You are rewriting content that failed quality checks due to HALLUCINATIONS or other issues.

CRITICAL RULES:
1. REMOVE any claims that aren't in the user's actual experience
2. Do NOT invent metrics, industries, platforms, or skills
3. If user didn't mention years of experience, don't add them
4. If user didn't mention an industry (B2B, SaaS, fintech), don't add one
5. Stay under character limits
6. Keep what's good, fix only what's wrong
7. Be CONSERVATIVE - it's better to be vague than to fabricate

Return ONLY the rewritten content, no explanation.`;

  const prompt = `Original content that FAILED quality checks:
"${originalOutput}"

FAILURES (you MUST fix these):
${failureReasons.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Original instructions:
${originalPrompt}

Rewrite to fix the failures. REMOVE hallucinated claims entirely rather than trying to modify them.
Return ONLY the fixed content.`;

  const response = await generateText(prompt, {
    systemPrompt,
    temperature: 0.4, // Slightly lower for more conservative rewrites
  });

  return response.content.trim();
}
