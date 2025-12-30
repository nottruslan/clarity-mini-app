import { useMemo } from 'react';
import { Transaction } from '../utils/storage';
import { FilterOptions } from '../components/Finance/TransactionFilters';

export function useFinanceFilters(
  transactions: Transaction[],
  filters: FilterOptions
): Transaction[] {
  return useMemo(() => {
    let filtered = [...transactions];

    // Фильтр по типу
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Фильтр по категории
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Фильтр по сумме
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(t => t.amount >= filters.minAmount!);
    }
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(t => t.amount <= filters.maxAmount!);
    }

    // Поиск
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.category.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [transactions, filters]);
}

