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
  prompt: `You are an expert in UK disability benefits, specifically the Personal Independence Payment (PIP). Your task is to rewrite a user's answer into a clear, formal, and effective response for their PIP application form.

  - Focus on the impact of their condition on their daily life.
  - Use keywords that the DWP (Department for Work and Pensions) assessors look for, such as "safely," "reliably," "repeatedly," and "in a reasonable time."
  - Be specific and avoid jargon.
  - Frame the answer in the first person.

  Current Question: {{{currentQuestion}}}

  User's Answer:
  "{{previousAnswers.rawAnswer}}"

  Rewrite the answer to be DWP-friendly:`,
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
