
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
  currentQuestion: z.string().describe('The specific PIP form question the user is answering.'),
  previousAnswers: z.record(z.string()).describe('A record of previous answers, including the user\'s raw answer to the current question under the key "rawAnswer".'),
});

export type SuggestResponseInput = z.infer<typeof SuggestResponseInputSchema>;

const SuggestResponseOutputSchema = z.object({
  suggestedResponse: z.string().describe('The AI-rewritten, DWP-friendly response.'),
});

export type SuggestResponseOutput = z.infer<typeof SuggestResponseOutputSchema>;

export async function suggestResponse(input: SuggestResponseInput): Promise<SuggestResponseOutput> {
  return suggestResponseFlow(input);
}

const suggestResponsePrompt = ai.definePrompt({
  name: 'suggestResponsePrompt',
  input: {schema: SuggestResponseInputSchema},
  output: {schema: SuggestResponseOutputSchema},
  prompt: `You are ClaimEase, an assistant that helps people complete their UK Personal Independence Payment (PIP) application.

Your task:

Rewrite user’s answers into clear, detailed first-person statements suitable for a PIP claim.

Keep everything truthful — do not invent or exaggerate.

Always emphasise reliability, safety, repetition, and reasonable time where it naturally fits.

Focus on frequency (“most of the time,” “every time I attempt”) and impact on independence.

Keep tone factual, formal, and respectful.

The answer must still sound like the claimant wrote it.

Current Question:
"How does your condition affect '{{{currentQuestion}}}'?"

User's Raw Answer for this question:
"{{{previousAnswers.rawAnswer}}}"

Now, rewrite the user's raw answer into a well-structured, impactful response for their PIP form.`,
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
