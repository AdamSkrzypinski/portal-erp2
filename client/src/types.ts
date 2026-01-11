export interface Order {
  id: number;
  orderNumber: string;
  dateIssued: string;
  deliveryDate: string;
  totalAmount: string;
  currency: string;
  status: 'NOWE' | 'POTWIERDZONE' | 'ODRZUCONE' | 'WYSLANE';
  items: Array<{ name: string; qty: number }> | string;
  comment?: string;
  supplier?: { name: string }; 
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPPLIER';
  nip?: string; 
}

export interface AuditLogEntry {
  id: number;
  timestamp: string;
  action: string;
  oldValue: string | null;
  newValue: string | null;
  comment: string | null;
  supplier: { name: string }; 
  order: { orderNumber: string };
}