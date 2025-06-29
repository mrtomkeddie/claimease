
"use client";

import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Loader2, Sparkles } from 'lucide-react';

import { suggestResponse, type SuggestResponseInput } from '@/ai/flows/suggest-response';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { FormValues } from '@/lib/formSchema';
import type { StepField } from '@/lib/constants';

interface AiSuggestionButtonProps {
  form: UseFormReturn<FormValues, any, undefined>;
  fieldName: StepField;
  fieldLabel: string;
}

export function AiSuggestionButton({ form, fieldName, fieldLabel }: AiSuggestionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggest = async () => {
    setIsLoading(true);
    try {
      const allValues = form.getValues();
      const previousAnswers: Record<string, string> = {};

      for (const key in allValues) {
        if (key !== fieldName && allValues[key as StepField]) {
          previousAnswers[key] = allValues[key as StepField]!;
        }
      }

      const input: SuggestResponseInput = {
        currentQuestion: fieldLabel,
        previousAnswers,
      };

      const result = await suggestResponse(input);
      
      if (result.suggestedResponse) {
        form.setValue(fieldName, result.suggestedResponse, { shouldValidate: true, shouldDirty: true });
        toast({
          title: "Suggestion applied!",
          description: `AI suggestion for "${fieldLabel}" has been filled in.`,
        });
      } else {
        throw new Error("AI did not return a suggestion.");
      }

    } catch (error) {
      console.error("AI Suggestion Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get an AI suggestion. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleSuggest}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4 text-yellow-500" />
      )}
      AI Suggest
    </Button>
  );
}
