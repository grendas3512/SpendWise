import type { Dispatch, SetStateAction, ReactNode } from 'react';
import { useState } from 'react';
import type { Goal } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AddGoalDialogProps = {
  children: ReactNode;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
};

export function AddGoalDialog({ children, setGoals }: AddGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
    };
    setGoals((prev) => [...prev, newGoal]);
    setName('');
    setTargetAmount('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a New Goal</DialogTitle>
            <DialogDescription>
              What new financial goal do you want to achieve?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Goal Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Emergency Fund"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetAmount" className="text-right">
                Target Amount
              </Label>
              <Input
                id="targetAmount"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 5000"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
