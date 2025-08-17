import type { Dispatch, SetStateAction } from 'react';
import type { Goal } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AddGoalDialog } from './add-goal-dialog';
import { PlusCircle } from 'lucide-react';

type GoalsListProps = {
  goals: Goal[];
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  totalSavings: number;
};

export function GoalsList({ goals, setGoals, totalSavings }: GoalsListProps) {
  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter((goal) => goal.id !== goalId));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Financial Goals</CardTitle>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <AddGoalDialog setGoals={setGoals}>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Goal
              </span>
            </Button>
          </AddGoalDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 && <p className="text-sm text-muted-foreground">No goals yet. Add one to get started!</p>}
        {goals.map((goal) => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-baseline">
                  <p className="font-medium mr-2">{goal.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteGoal(goal.id)} className="text-red-500 hover:text-red-700">
                  Delete
                </Button>
              </div>

              <Progress value={progress} aria-label={`${goal.name} progress`} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
