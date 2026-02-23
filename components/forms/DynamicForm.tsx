"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { RecipeInput } from "@/types/recipe";

interface DynamicFormProps {
  inputs: RecipeInput[];
  onSubmit: (values: Record<string, string>) => void;
  isLoading?: boolean;
}

export function DynamicForm({ inputs, onSubmit, isLoading }: DynamicFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    // Initialize with defaults
    const initial: Record<string, string> = {};
    inputs.forEach((input) => {
      if (input.default) {
        initial[input.id] = input.default;
      }
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    inputs.forEach((input) => {
      const value = values[input.id]?.trim() || "";

      if (input.required && !value) {
        newErrors[input.id] = "This field is required";
      }

      if (input.maxLength && value.length > input.maxLength) {
        newErrors[input.id] = `Maximum ${input.maxLength} characters`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  const renderField = (input: RecipeInput) => {
    const value = values[input.id] || "";
    const error = errors[input.id];

    const commonProps = {
      id: input.id,
      disabled: isLoading,
      className: error ? "border-red-500" : "",
    };

    switch (input.type) {
      case "text":
        return (
          <Input
            {...commonProps}
            type="text"
            placeholder={input.placeholder}
            value={value}
            onChange={(e) => handleChange(input.id, e.target.value)}
            maxLength={input.maxLength}
          />
        );

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            placeholder={input.placeholder}
            value={value}
            onChange={(e) => handleChange(input.id, e.target.value)}
            maxLength={input.maxLength}
            rows={4}
            className={`resize-none ${error ? "border-red-500" : ""}`}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(v) => handleChange(input.id, v)}
            disabled={isLoading}
          >
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {input.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {inputs.map((input) => (
        <Card key={input.id} className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0 space-y-2">
            <label
              htmlFor={input.id}
              className="block text-sm font-medium text-gray-700"
            >
              {input.label}
              {input.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {renderField(input)}

            {input.help && !errors[input.id] && (
              <p className="text-xs text-gray-500">{input.help}</p>
            )}

            {errors[input.id] && (
              <p className="text-xs text-red-500">{errors[input.id]}</p>
            )}

            {input.maxLength && input.type !== "select" && (
              <p className="text-xs text-gray-400 text-right">
                {(values[input.id] || "").length} / {input.maxLength}
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating...
          </span>
        ) : (
          "Generate"
        )}
      </Button>
    </form>
  );
}
