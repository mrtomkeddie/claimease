// src/ai/flows/suggest-response.ts
'use server';

/**
 * @fileOverview Provides AI-powered suggestions for form responses based on the current question and previous answers.
 *
 * - suggestResponse - A function that generates suggested responses.
 * - SuggestResponseInput - The input type for the suggestResponse function.
 * - SuggestResponseOutput - The return type for the suggestResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestResponseInputSchema = z.object({
  currentQuestion: z.string().describe('The current question in the form.'),
  previousAnswers: z.record(z.string()).describe('A record of previous answers provided by the user.'),
});

export type SuggestResponseInput = z.infer<typeof SuggestResponseInputSchema>;

const SuggestResponseOutputSchema = z.object({
  suggestedResponse: z.string().describe('The AI-suggested response to the current question.'),
});

export type SuggestResponseOutput = z.infer<typeof SuggestResponseOutputSchema>;

export async function suggestResponse(input: SuggestResponseInput): Promise<SuggestResponseOutput> {
  return suggestResponseFlow(input);
}

const suggestResponsePrompt = ai.definePrompt({
  name: 'suggestResponsePrompt',
  input: {schema: SuggestResponseInputSchema},
  output: {schema: SuggestResponseOutputSchema},
  prompt: `You are an AI assistant helping users fill out a form.

  Based on the current question and the user's previous answers, suggest a response to help them complete the form faster.

  Current Question: {{{currentQuestion}}}

  Previous Answers:
  {{#each previousAnswers}}
  {{@key}}: {{{this}}}
  {{/each}}

  Suggest a concise and relevant response:`,
});

const suggestResponseFlow = ai.defineFlow(
  {
    name: 'suggestResponseFlow',
    inputSchema: SuggestResponseInputSchema,
    outputSchema: SuggestResponseOutputSchema,
  },
  async input => {
    const {output} = await suggestResponsePrompt(input);
    return output!;
  }
);
