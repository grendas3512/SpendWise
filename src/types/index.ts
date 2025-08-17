export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
};
