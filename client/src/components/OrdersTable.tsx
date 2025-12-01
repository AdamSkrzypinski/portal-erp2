import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import type { Order } from '../types';
import { OrderPdfDocument } from './OrderPdfDocument';
import { ActionModal } from './ActionModal';
import './OrdersTable.scss';

interface OrdersTableProps {
  orders: Order[];
  onUpdateOrder: (id: number, status: string, comment: string) => void;
}

export function OrdersTable({ orders, onUpdateOrder }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<'CONFIRM' | 'REJECT' | 'DETAILS' | null>(null);

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
    }).format(Number(amount));
  };

  const handleOpenModal = (order: Order, type: 'CONFIRM' | 'REJECT' | 'DETAILS') => {
    setSelectedOrder(order);
    setActionType(type);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setActionType(null);
  };

  const handleSubmitAction = (id: number, status: string, comment: string) => {
    onUpdateOrder(id, status, comment);
    handleCloseModal();
  };

  return (
    <>
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Numer</th>
              <th>Data Dostawy</th>
              <th>Kwota</th>
              <th>Status</th>
              <th>Komentarz</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isActionable = order.status === 'NOWE';
              const isPdfAvailable = order.status === 'POTWIERDZONE' || order.status === 'WYSLANE';

              return (
                <tr key={order.id}>
                  <td style={{ fontWeight: 500 }}>{order.orderNumber}</td>
                  <td style={{ color: '#aaa' }}>
                    {new Date(order.deliveryDate).toLocaleDateString('pl-PL')}
                  </td>
                  <td>{formatCurrency(order.totalAmount, order.currency)}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85em', color: '#ccc', maxWidth: '200px', whiteSpace: 'normal' }}>
                    {order.comment || '-'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      
                      <button 
                        type="button" 
                        className="action-btn"
                        style={{ backgroundColor: '#6c757d', display: 'flex', alignItems: 'center', gap: '5px' }}
                        onClick={() => handleOpenModal(order, 'DETAILS')}
                        title="Zobacz szczegóły zamówienia"
                      >
                        <span>🔍</span> Podgląd
                      </button>

                      <button 
                        type="button" 
                        className="action-btn"
                        style={{ backgroundColor: '#28a745' }}
                        onClick={() => isActionable && handleOpenModal(order, 'CONFIRM')}
                        disabled={!isActionable}
                        title={isActionable ? "Potwierdź przyjęcie zamówienia" : "Zamówienie już przetworzone"}
                      >
                        ✔
                      </button>

                      <button 
                        type="button" 
                        className="action-btn"
                        style={{ backgroundColor: '#dc3545' }}
                        onClick={() => isActionable && handleOpenModal(order, 'REJECT')}
                        disabled={!isActionable}
                        title={isActionable ? "Odrzuć zamówienie" : "Zamówienie już przetworzone"}
                      >
                        ✖
                      </button>

                      {isPdfAvailable ? (
                        <PDFDownloadLink
                          document={<OrderPdfDocument order={order} />}
                          fileName={`Zamowienie_${order.orderNumber.replace(/\//g, '-')}.pdf`}
                          className="pdf-btn"
                          title="Pobierz potwierdzenie PDF"
                        >
                          {({ loading }) => (loading ? '...' : 'PDF')}
                        </PDFDownloadLink>
                      ) : (
                        <button 
                          className="pdf-btn" 
                          disabled 
                          title="PDF dostępny tylko po potwierdzeniu"
                        >
                          PDF
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedOrder && actionType && (
        <ActionModal 
          order={selectedOrder} 
          actionType={actionType} 
          onClose={handleCloseModal}
          onSubmit={handleSubmitAction}
        />
      )}
    </>
  );
}