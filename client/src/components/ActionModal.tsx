import { useState, useEffect } from 'react';
import type { Order } from '../types';
import './ActionModal.scss';

interface ActionModalProps {
  order: Order;
  actionType: 'CONFIRM' | 'REJECT' | 'DETAILS'; // Nowy typ DETAILS
  onClose: () => void;
  onSubmit: (id: number, status: string, comment: string) => void;
}

export function ActionModal({ order, actionType, onClose, onSubmit }: ActionModalProps) {
  const [comment, setComment] = useState('');

  // Jeśli otwieramy szczegóły, wpisz istniejący komentarz z bazy do pola
  useEffect(() => {
    if (actionType === 'DETAILS' && order.comment) {
      setComment(order.comment);
    }
  }, [actionType, order]);

  const handleSubmit = () => {
    const status = actionType === 'CONFIRM' ? 'POTWIERDZONE' : 'ODRZUCONE';
    onSubmit(order.id, status, comment);
  };

  const getTitle = () => {
    switch (actionType) {
      case 'CONFIRM': return 'Potwierdzenie Zamówienia';
      case 'REJECT': return 'Odrzucenie Zamówienia';
      case 'DETAILS': return 'Szczegóły Zamówienia';
      default: return '';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{getTitle()}</h3>
        
        <div className="order-details">
          <p><strong>Numer:</strong> {order.orderNumber}</p>
          <p><strong>Data dostawy:</strong> {new Date(order.deliveryDate).toLocaleDateString('pl-PL')}</p>
          <p><strong>Kwota:</strong> {order.totalAmount} {order.currency}</p>
          <p><strong>Produkty:</strong></p>
          <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
            {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
              <li key={idx}>{item.name} - {item.qty} szt.</li>
            ))}
          </ul>
        </div>

        {/* Sekcja komentarza */}
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>
          {actionType === 'DETAILS' 
            ? 'Komentarz do zamówienia:' 
            : `Komentarz ${actionType === 'REJECT' ? '(Wymagany powód)' : '(Opcjonalny)'}:`
          }
        </label>
        
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={actionType === 'DETAILS'} // Zablokuj edycję w trybie podglądu
          placeholder={actionType === 'DETAILS' ? 'Brak komentarza.' : 'Wpisz treść...'}
          style={actionType === 'DETAILS' ? { backgroundColor: '#333', color: '#ccc' } : {}}
        />

        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">
            {actionType === 'DETAILS' ? 'Zamknij' : 'Anuluj'}
          </button>
          
          {actionType !== 'DETAILS' && (
            <button 
              onClick={handleSubmit} 
              className={actionType === 'CONFIRM' ? 'btn-confirm' : 'btn-reject'}
              disabled={actionType === 'REJECT' && comment.trim().length === 0}
            >
              {actionType === 'CONFIRM' ? 'Zatwierdź' : 'Odrzuć Zamówienie'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}