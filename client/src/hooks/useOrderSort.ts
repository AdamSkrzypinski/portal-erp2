import { useState, useMemo } from 'react';
import type { Order } from '../types';

export type SortKey = keyof Order | 'amount';

interface SortConfig {
  key: SortKey;
  direction: 'asc' | 'desc';
}

export function useOrderSort(orders: Order[], defaultKey: SortKey = 'deliveryDate') {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: defaultKey,
    direction: 'asc',
  });

  const sortedOrders = useMemo(() => {
    const sortableItems = [...orders];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof Order];
        let bValue: any = b[sortConfig.key as keyof Order];

        if (sortConfig.key === 'amount') {
          aValue = Number(a.totalAmount);
          bValue = Number(b.totalAmount);
        } else if (sortConfig.key === 'deliveryDate') {
          aValue = new Date(a.deliveryDate).getTime();
          bValue = new Date(b.deliveryDate).getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [orders, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { sortedOrders, sortConfig, requestSort };
}