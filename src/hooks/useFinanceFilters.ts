import { useMemo } from 'react';
import { Transaction } from '../utils/storage';
import { FilterOptions } from '../components/Finance/TransactionFilters';

export function useFinanceFilters(
  transactions: Transaction[],
  filters: FilterOptions
): Transaction[] {
  return useMemo(() => {
    console.log('[useFinanceFilters] Computing filtered transactions:', {
      inputCount: transactions.length,
      filters: filters
    });
    
    let filtered = [...transactions];

    // Фильтр по типу
    if (filters.type && filters.type !== 'all') {
      const beforeCount = filtered.length;
      filtered = filtered.filter(t => t.type === filters.type);
      console.log('[useFinanceFilters] After type filter:', {
        before: beforeCount,
        after: filtered.length,
        type: filters.type
      });
    }

    // Фильтр по категории
    if (filters.category) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(t => t.category === filters.category);
      console.log('[useFinanceFilters] After category filter:', {
        before: beforeCount,
        after: filtered.length,
        category: filters.category
      });
    }

    // Фильтр по сумме
    if (filters.minAmount !== undefined) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(t => t.amount >= filters.minAmount!);
      console.log('[useFinanceFilters] After minAmount filter:', {
        before: beforeCount,
        after: filtered.length,
        minAmount: filters.minAmount
      });
    }
    if (filters.maxAmount !== undefined) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(t => t.amount <= filters.maxAmount!);
      console.log('[useFinanceFilters] After maxAmount filter:', {
        before: beforeCount,
        after: filtered.length,
        maxAmount: filters.maxAmount
      });
    }

    // Поиск
    if (filters.searchQuery) {
      const beforeCount = filtered.length;
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.category.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
      console.log('[useFinanceFilters] After search filter:', {
        before: beforeCount,
        after: filtered.length,
        query: filters.searchQuery
      });
    }

    console.log('[useFinanceFilters] Final filtered count:', filtered.length);
    console.log('[useFinanceFilters] Final filtered transactions:', filtered.map(t => ({
      id: t.id,
      date: new Date(t.date).toISOString(),
      dateLocal: new Date(t.date).toString(),
      timestamp: t.date,
      type: t.type,
      amount: t.amount,
      category: t.category
    })));
    return filtered;
  }, [transactions, filters]);
}

