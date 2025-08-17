import type { Dispatch, SetStateAction } from 'react';
import type { Transaction } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AddTransactionDialog } from './add-transaction-dialog';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

type TransactionsTableProps = {
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
};

export function TransactionsTable({ transactions, setTransactions }: TransactionsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>A list of your recent income and expenses.</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <AddTransactionDialog setTransactions={setTransactions}>
             <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Transaction
              </span>
            </Button>
          </AddTransactionDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.description}</TableCell>
                <TableCell>
                  <Badge variant="outline">{t.category}</Badge>
                </TableCell>
                <TableCell>{format(t.date, 'PPP')}</TableCell>
                <TableCell
                  className={`text-right font-medium ${t.type === 'income' ? 'text-accent' : 'text-destructive'}`}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
