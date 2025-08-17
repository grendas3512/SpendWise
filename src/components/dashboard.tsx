"use client";

import { useState } from 'react';
import type { Transaction, Goal } from '@/types';
import { AppHeader } from './app-header';
import { BalanceSummary } from './balance-summary';
import { GoalsList } from './goals-list';
import { SpendingPieChart } from './spending-pie-chart';
import { TransactionsTable } from './transactions-table';

const initialTransactions: Transaction[] = [
  { id: '1', type: 'income', amount: 4500, category: 'Salary', description: 'Monthly Salary', date: new Date('2024-07-01') },
  { id: '2', type: 'expense', amount: 1200, category: 'Rent', description: 'Apartment Rent', date: new Date('2024-07-01') },
  { id: '3', type: 'expense', amount: 75.50, category: 'Groceries', description: 'Weekly grocery shopping', date: new Date('2024-07-03') },
  { id: '4', type: 'expense', amount: 45.20, category: 'Dining Out', description: 'Dinner with friends', date: new Date('2024-07-05') },
  { id: '5', type: 'expense', amount: 250, category: 'Shopping', description: 'New clothes', date: new Date('2024-07-06') },
  { id: '6', type: 'expense', amount: 120, category: 'Utilities', description: 'Electricity Bill', date: new Date('2024-07-10') },
  { id: '7', type: 'expense', amount: 50, category: 'Transportation', description: 'Gas for car', date: new Date('2024-07-12') },
  { id: '8', type: 'expense', amount: 500, category: 'Savings', description: 'Contribution to savings', date: new Date('2024-07-15') },
];

const initialGoals: Goal[] = [
  { id: '1', name: 'Vacation to Italy', targetAmount: 4000, currentAmount: 1500 },
  { id: '2', name: 'New Laptop', targetAmount: 1800, currentAmount: 400 },
];

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const totalSavings = transactions
    .filter(t => t.category === 'Savings' && t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8 space-y-6">
        <BalanceSummary transactions={transactions} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <GoalsList goals={goals} setGoals={setGoals} totalSavings={totalSavings} />
          <SpendingPieChart transactions={transactions} />
        </div>
        <TransactionsTable transactions={transactions} setTransactions={setTransactions} />
      </main>
    </div>
  );
}
