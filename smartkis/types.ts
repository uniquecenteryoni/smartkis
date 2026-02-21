import type React from 'react';

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<{ onBack: () => void; title: string; onComplete: () => void; }>;
  completionGoal?: string;
}

export interface BudgetItem {
  id: number;
  category: string;
  amount: number;
}

export interface Character {
    name: string;
    salary: number;
    avatar: string;
    description: string;
}