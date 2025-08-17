"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
import type { Transaction } from '@/types'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

export function SpendingPieChart({ transactions }: { transactions: Transaction[] }) {
  const expenseData = React.useMemo(() => {
    const categories: { [key: string]: number } = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (!categories[t.category]) {
          categories[t.category] = 0;
        }
        categories[t.category] += t.amount;
      });

    return Object.entries(categories).map(([name, value]) => ({ name, value, fill: COLORS[Math.floor(Math.random() * COLORS.length)] }));
  }, [transactions]);
  
  const chartConfig = React.useMemo(() => {
      const config: any = {};
      expenseData.forEach(item => {
          config[item.name] = { label: item.name };
      });
      return config;
  }, [expenseData]);

  return (
    <Card className="flex flex-col lg:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>A look at your expense distribution.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={expenseData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
                {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
