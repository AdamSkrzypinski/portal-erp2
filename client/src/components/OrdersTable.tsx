import type { Order } from '../types';
import './OrdersTable.scss'; // Importujemy style

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  
  // Pomocnicza funkcja do formatowania waluty (np. 15 000.00 PLN)
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
              <td style={{ color: '#555' }}>
                {new Date(order.deliveryDate).toLocaleDateString('pl-PL')}
              </td>
              <td>{formatCurrency(order.totalAmount, order.currency)}</td>
              <td>
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <button type="button" className="action-btn">
                  Szczegóły
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}