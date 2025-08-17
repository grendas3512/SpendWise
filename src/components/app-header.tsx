import { PiggyBank } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-card shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center h-16">
          <PiggyBank className="h-8 w-8 text-primary" />
          <h1 className="ml-3 text-2xl font-bold text-primary-dark font-headline">
            SpendWise
          </h1>
        </div>
      </div>
    </header>
  );
}
