export type OrderStatus = 'NOWE' | 'POTWIERDZONE' | 'ODRZUCONE' | 'WYSLANE';

export interface Supplier {
  id: number;
  email: string;
  name: string;
  nip?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  dateIssued: string;
  deliveryDate: string;
  totalAmount: string;
  currency: string;
  status: OrderStatus;
  items: any;
  supplierId: number;
  supplier?: Supplier;
}