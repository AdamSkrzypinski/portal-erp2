import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import type { Order } from '../types';
import { OrderPdfDocument } from './OrderPdfDocument';
import { ActionModal } from './ActionModal';
import { useOrderSort, type SortKey } from '../hooks/useOrderSort';
import './OrdersTable.scss';

interface OrdersTableProps {
  orders: Order[];
  onUpdateOrder: (id: number, status: string, comment: string) => void;
}

export function OrdersTable({ orders, onUpdateOrder }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<'CONFIRM' | 'REJECT' | 'DETAILS' | 'SEND' | null>(null);
  
  const { sortedOrders, sortConfig, requestSort } = useOrderSort(orders);

  const getSortIndicator = (key: SortKey) => {
    if (sortConfig.key !== key) return <span className="sort-icon">↕</span>;
    return sortConfig.direction === 'asc' 
      ? <span className="sort-icon active">▲</span> 
      : <span className="sort-icon active">▼</span>;
  };

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
    }).format(Number(amount));
  };

  const handleOpenModal = (order: Order, type: 'CONFIRM' | 'REJECT' | 'DETAILS' | 'SEND') => {
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
              <th onClick={() => requestSort('orderNumber')} className="sortable">
                Numer {getSortIndicator('orderNumber')}
              </th>
              <th onClick={() => requestSort('deliveryDate')} className="sortable">
                Data Dostawy {getSortIndicator('deliveryDate')}
              </th>
              <th onClick={() => requestSort('amount')} className="sortable">
                Kwota {getSortIndicator('amount')}
              </th>
              <th onClick={() => requestSort('status')} className="sortable">
                Status {getSortIndicator('status')}
              </th>
              <th>Komentarz</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => {
              const isNew = order.status === 'NOWE';
              const isConfirmed = order.status === 'POTWIERDZONE';
              const isSent = order.status === 'WYSLANE';
              
              const isPdfAvailable = isConfirmed || isSent;

              return (
                <tr key={order.id}>
                  <td className="col-order-number">{order.orderNumber}</td>
                  <td className="col-date">
                    {new Date(order.deliveryDate).toLocaleDateString('pl-PL')}
                  </td>
                  <td>{formatCurrency(order.totalAmount, order.currency)}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="col-comment">
                    {order.comment || '-'}
                  </td>
                  <td>
                    <div className="actions-container">
                      <button 
                        type="button" 
                        className="action-btn btn-details"
                        onClick={() => handleOpenModal(order, 'DETAILS')}
                        title="Zobacz szczegóły zamówienia"
                      >
                        <span>🔍</span>
                      </button>

                      <button 
                        type="button" 
                        className="action-btn btn-confirm"
                        onClick={() => isNew && handleOpenModal(order, 'CONFIRM')}
                        disabled={!isNew}
                        title={isNew ? "Potwierdź przyjęcie zamówienia" : "Niedostępne"}
                      >
                        ✔
                      </button>

                      <button 
                        type="button" 
                        className="action-btn btn-reject"
                        onClick={() => isNew && handleOpenModal(order, 'REJECT')}
                        disabled={!isNew}
                        title={isNew ? "Odrzuć zamówienie" : "Niedostępne"}
                      >
                        ✖
                      </button>

                      <button 
                        type="button" 
                        className="action-btn btn-send"
                        onClick={() => isConfirmed && handleOpenModal(order, 'SEND')}
                        disabled={!isConfirmed}
                        title={isConfirmed ? "Oznacz jako wysłane i dodaj nr przewozowy" : "Wymaga potwierdzenia"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                        </svg>
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
                        <button className="pdf-btn" disabled title="PDF dostępny po potwierdzeniu">
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