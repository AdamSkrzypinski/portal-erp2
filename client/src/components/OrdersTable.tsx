import type { Order } from '../types';
import './OrdersTable.scss';

interface OrdersTableProps {
  orders: Order[];
  onConfirmOrder: (id: number) => void;
}

export function OrdersTable({ orders, onConfirmOrder }: OrdersTableProps) {
  
  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
    }).format(Number(amount));
  };

  return (
    <div className="orders-table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Numer Zamówienia</th>
            <th>Data Wystawienia</th>
            <th>Termin Dostawy</th>
            <th>Kwota</th>
            <th>Status</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={{ fontWeight: 500 }}>{order.orderNumber}</td>
              <td>{new Date(order.dateIssued).toLocaleDateString('pl-PL')}</td>
              <td style={{ color: '#aaa' }}>
                {new Date(order.deliveryDate).toLocaleDateString('pl-PL')}
              </td>
              <td>{formatCurrency(order.totalAmount, order.currency)}</td>
              <td>
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </td>
              <td>
                {order.status === 'NOWE' && (
                  <button 
                    type="button" 
                    className="action-btn"
                    onClick={() => onConfirmOrder(order.id)}
                  >
                    Potwierdź
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}