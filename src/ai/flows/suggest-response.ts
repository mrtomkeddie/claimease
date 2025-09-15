
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
  prompt: `You are an expert in UK disability benefits, specifically the Personal Independence Payment (PIP). Your task is to rewrite a user's answer into a clear, formal, and effective response for their PIP application form.

- Rewrite the user's answer into a DWP-friendly response.
- Frame the response in the first person, from the user's perspective.
- Incorporate keywords that DWP assessors look for: "safely," "reliably," "repeatedly," and "in a reasonable time frame."
- Focus on the impact of their condition on the specific task. Explain *why* it's difficult.
- Be specific. Instead of "I struggle," explain *how* you struggle.
- If the user mentions a condition (e.g., {{{previousAnswers.mainCondition}}}), connect the difficulties back to that condition.

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
