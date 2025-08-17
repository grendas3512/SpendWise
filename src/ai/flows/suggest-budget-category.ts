'use server';

/**
 * @fileOverview A budget category suggestion AI agent.
 *
 * - suggestBudgetCategory - A function that suggests a budget category based on a transaction description.
 * - SuggestBudgetCategoryInput - The input type for the suggestBudgetCategory function.
 * - SuggestBudgetCategoryOutput - The return type for the suggestBudgetCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBudgetCategoryInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction.'),
});
export type SuggestBudgetCategoryInput = z.infer<typeof SuggestBudgetCategoryInputSchema>;

const SuggestBudgetCategoryOutputSchema = z.object({
  suggestedCategory: z.string().describe('The suggested budget category.'),
  confidence: z
    .number()
    .describe('A number between 0 and 1 indicating confidence in the suggestion.'),
});
export type SuggestBudgetCategoryOutput = z.infer<typeof SuggestBudgetCategoryOutputSchema>;

export async function suggestBudgetCategory(
  input: SuggestBudgetCategoryInput
): Promise<SuggestBudgetCategoryOutput> {
  return suggestBudgetCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBudgetCategoryPrompt',
  input: {schema: SuggestBudgetCategoryInputSchema},
  output: {schema: SuggestBudgetCategoryOutputSchema},
  prompt: `You are a personal finance assistant helping users categorize their transactions for budgeting purposes.

  Given the following transaction description, suggest a single, most appropriate budget category.
  Also, provide a confidence score between 0 and 1 (inclusive) indicating how certain you are of the suggestion.

  Transaction Description: {{{transactionDescription}}}

  Consider these categories: Groceries, Rent, Utilities, Transportation, Entertainment, Dining Out, Shopping, Travel, Health, Education, Personal Care, Gifts, Investments, Savings, Other.
`,
});

const suggestBudgetCategoryFlow = ai.defineFlow(
  {
    name: 'suggestBudgetCategoryFlow',
    inputSchema: SuggestBudgetCategoryInputSchema,
    outputSchema: SuggestBudgetCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
