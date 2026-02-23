"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GateResult } from "@/types/gate";

interface GateResultsProps {
  results: GateResult[];
  showDetails?: boolean;
}

export function GateResults({ results, showDetails = false }: GateResultsProps) {
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount;

  return (
    <Card className={allPassed ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Quality Checks</span>
          <Badge variant={allPassed ? "default" : "secondary"} className={allPassed ? "bg-green-600" : "bg-yellow-600"}>
            {passedCount}/{totalCount} passed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {results.map((result, index) => (
            <div
              key={`${result.gateId}-${index}`}
              className="flex items-start gap-2 text-sm"
            >
              <span className="mt-0.5">
                {result.passed ? (
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
              </span>
              <div className="flex-1">
                <span className={result.passed ? "text-green-700" : "text-yellow-700"}>
                  {result.gateName}
                </span>
                {showDetails && (
                  <p className="text-xs text-gray-500 mt-0.5">{result.reason}</p>
                )}
              </div>
              {result.score !== undefined && (
                <span className="text-xs text-gray-500">
                  {Math.round(result.score * 100)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for inline display
export function GateResultsBadge({ results }: { results: GateResult[] }) {
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount;

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full ${
          allPassed ? "bg-green-500" : "bg-yellow-500"
        }`}
      />
      <span className="text-xs text-gray-600">
        {passedCount}/{totalCount} checks passed
      </span>
    </div>
  );
}
