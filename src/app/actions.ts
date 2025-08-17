'use server';

import { suggestBudgetCategory } from '@/ai/flows/suggest-budget-category';

export async function suggestCategory(description: string) {
  if (!description) {
    throw new Error('Description is required to suggest a category.');
  }

  try {
    const result = await suggestBudgetCategory({
      transactionDescription: description,
    });
    return result;
  } catch (error) {
    console.error('Error suggesting category:', error);
    throw new Error('Failed to get category suggestion from AI.');
  }
}
