import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const RECIPE_PROMPTS: Record<string, string> = {
  "recruiter-dm": `You are an expert at writing LinkedIn connection request messages for job seekers.

RULES:
- Keep under 300 characters
- NO generic openings like "I'm reaching out because..."
- NO listing multiple technologies in one sentence
- Only make claims that can be backed by the provided experience
- Sound human, not robotic
- Be specific, not generic
- Focus on ONE compelling hook

Write a LinkedIn DM based on the following inputs:`,

  "follow-up": `You are an expert at writing follow-up messages after no reply.

RULES:
- Keep it short (2-3 sentences max)
- Add NEW value - don't just "bump"
- Reference the original message briefly
- NO desperate language ("just checking in", "circling back")
- Give them a reason to respond NOW

Write a follow-up message based on:`,

  "recruiter-comment": `You are an expert at writing thoughtful LinkedIn comments that build presence without pitching.

RULES:
- Add genuine insight or perspective
- NO self-promotion or pitching
- Build on what they said, don't hijack
- Keep it concise (2-3 sentences)
- Sound like a peer, not a job seeker

Write a comment based on:`,

  "cold-email": `You are an expert at writing cold emails to recruiters.

RULES:
- Subject line under 50 characters
- Email body under 150 words
- NO generic openings
- ONE specific ask
- Include a concrete metric or achievement
- Make it easy to say yes

Write a cold email based on:`,
};

interface QualityGate {
  name: string;
  passed: boolean;
  reason: string;
}

function runQualityGates(output: string, inputs: Record<string, string>, recipeId: string): QualityGate[] {
  const gates: QualityGate[] = [];
  
  // Gate 1: Length check
  if (recipeId === "recruiter-dm") {
    gates.push({
      name: "Length ≤ 300 chars",
      passed: output.length <= 300,
      reason: output.length <= 300 ? "Within limit" : `${output.length} chars (over by ${output.length - 300})`,
    });
  }

  // Gate 2: No generic openings
  const genericOpenings = ["i'm reaching out", "i wanted to reach out", "i hope this message finds you", "i came across"];
  const hasGeneric = genericOpenings.some(g => output.toLowerCase().includes(g));
  gates.push({
    name: "No generic openings",
    passed: !hasGeneric,
    reason: hasGeneric ? "Contains generic opener" : "Original opening",
  });

  // Gate 3: No tech dumps (multiple technologies in parentheses or comma lists)
  const techDumpPattern = /\([^)]*,.*,.*\)/g;
  const hasTechDump = techDumpPattern.test(output) || (output.match(/,/g) || []).length > 3;
  gates.push({
    name: "No tech dumps",
    passed: !hasTechDump,
    reason: hasTechDump ? "Too many items listed" : "Focused content",
  });

  // Gate 4: Evidence Gate - check claims against inputs
  const inputText = Object.values(inputs).join(" ").toLowerCase();
  const numbers = output.match(/\d+[+%]?(?:\s*(?:years?|months?|M|million|k))?/gi) || [];
  let unverifiedClaims = 0;
  
  for (const num of numbers) {
    if (!inputText.includes(num.toLowerCase().replace(/\s/g, ''))) {
      // Check if the number exists in any form in inputs
      const numOnly = num.match(/\d+/)?.[0];
      if (numOnly && !inputText.includes(numOnly)) {
        unverifiedClaims++;
      }
    }
  }
  
  gates.push({
    name: "Evidence Gate",
    passed: unverifiedClaims === 0,
    reason: unverifiedClaims === 0 ? "All claims verified" : `${unverifiedClaims} unverified claim(s)`,
  });

  // Gate 5: Has personalization (uses recruiter name or company)
  const recruiterName = inputs.recruiter_name?.toLowerCase() || "";
  const hasPersonalization = recruiterName && output.toLowerCase().includes(recruiterName.split(" ")[0].toLowerCase());
  gates.push({
    name: "Personalized",
    passed: hasPersonalization,
    reason: hasPersonalization ? "Uses recipient name" : "Missing personalization",
  });

  // Gate 6: No desperate language
  const desperateWords = ["please", "just checking", "circling back", "any update", "following up again", "i really need"];
  const hasDesperate = desperateWords.some(w => output.toLowerCase().includes(w));
  gates.push({
    name: "No desperate language",
    passed: !hasDesperate,
    reason: hasDesperate ? "Contains weak language" : "Confident tone",
  });

  // Gate 7: Readable length (not too long per sentence)
  const sentences = output.split(/[.!?]+/).filter(s => s.trim());
  const avgWordsPerSentence = sentences.reduce((acc, s) => acc + s.trim().split(/\s+/).length, 0) / sentences.length;
  const isReadable = avgWordsPerSentence < 25;
  gates.push({
    name: "Readable",
    passed: isReadable,
    reason: isReadable ? "Good sentence length" : "Sentences too long",
  });

  return gates;
}

export async function POST(request: NextRequest) {
  try {
    const { recipeId, inputs } = await request.json();

    if (!recipeId || !inputs) {
      return NextResponse.json({ error: "Missing recipeId or inputs" }, { status: 400 });
    }

    const systemPrompt = RECIPE_PROMPTS[recipeId];
    if (!systemPrompt) {
      return NextResponse.json({ error: "Unknown recipe" }, { status: 400 });
    }

    // Format inputs for the prompt
    const inputText = Object.entries(inputs)
      .map(([key, value]) => `${key.replace(/_/g, " ").toUpperCase()}: ${value}`)
      .join("\n");

    // Call Claude API
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `${systemPrompt}\n\n${inputText}\n\nWrite the message now. Output ONLY the message, no explanations.`,
        },
      ],
    });

    const output = (message.content[0] as { type: string; text: string }).text.trim();

    // Run quality gates
    const gateResults = runQualityGates(output, inputs, recipeId);
    const allPassed = gateResults.every(g => g.passed);
    const passedCount = gateResults.filter(g => g.passed).length;

    return NextResponse.json({
      output,
      gateResults,
      allPassed,
      passedCount,
      totalGates: gateResults.length,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate message" },
      { status: 500 }
    );
  }
}
