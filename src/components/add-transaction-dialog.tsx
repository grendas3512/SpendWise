"use client";

import type { Dispatch, SetStateAction, ReactNode } from 'react';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Transaction } from '@/types';
import { suggestCategory } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar as CalendarIcon, Wand2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const formSchema = z.object({
  description: z.string().min(1, "Description is required."),
  amount: z.coerce.number().positive("Amount must be positive."),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required."),
  date: z.date(),
});

type AddTransactionDialogProps = {
  children: ReactNode;
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
};

const categories = ["Groceries", "Rent", "Utilities", "Transportation", "Entertainment", "Dining Out", "Shopping", "Travel", "Health", "Education", "Personal Care", "Gifts", "Investments", "Savings", "Salary", "Other"];

export function AddTransactionDialog({ children, setTransactions }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
      category: "",
      date: new Date(),
    },
  });

  const handleSuggestCategory = async () => {
    const description = form.getValues("description");
    if (!description) {
      toast({
        title: "No description provided",
        description: "Please enter a description to suggest a category.",
        variant: "destructive",
      });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestCategory(description);
      if (result && categories.includes(result.suggestedCategory)) {
        form.setValue("category", result.suggestedCategory);
        toast({
          title: "Category Suggested!",
          description: `We've suggested '${result.suggestedCategory}' based on your description.`,
        });
      } else if(result) {
        form.setValue("category", "Other");
         toast({
          title: "Category Suggestion",
          description: `We suggested '${result.suggestedCategory}', which has been set to 'Other'. You can change it if needed.`,
        });
      }
    } catch (error) {
      toast({
        title: "Suggestion Failed",
        description: "Could not suggest a category at this time.",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...values,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Add a new income or expense to your budget.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">Expense</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel className="font-normal">Income</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="e.g., Coffee with a friend" {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={handleSuggestCategory}
                        disabled={isSuggesting}
                        aria-label="Suggest Category"
                      >
                        <Wand2 className={cn("h-4 w-4", isSuggesting && "animate-pulse")} />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <div className="flex gap-2">
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "flex-grow pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.setValue("date", new Date())}
                      >Today</Button>
                    </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Add Transaction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
