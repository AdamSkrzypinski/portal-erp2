import { useState, useEffect } from 'react';
import type { Order } from '../types';
import './ActionModal.scss';

interface ActionModalProps {
  order: Order;
  actionType: 'CONFIRM' | 'REJECT' | 'DETAILS' | 'SEND'; // Dodano SEND
  onClose: () => void;
  onSubmit: (id: number, status: string, comment: string) => void;
}

export function ActionModal({ order, actionType, onClose, onSubmit }: ActionModalProps) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    if ((actionType === 'DETAILS' || actionType === 'SEND') && order.comment) {
      setComment(order.comment);
    }
  }, [actionType, order]);

  const handleSubmit = () => {
    let status = '';
    switch (actionType) {
      case 'CONFIRM': status = 'POTWIERDZONE'; break;
      case 'REJECT': status = 'ODRZUCONE'; break;
      case 'SEND': status = 'WYSLANE'; break; 
    }
    onSubmit(order.id, status, comment);
  };

  const getTitle = () => {
    switch (actionType) {
      case 'CONFIRM': return 'Potwierdzenie Zamówienia';
      case 'REJECT': return 'Odrzucenie Zamówienia';
      case 'DETAILS': return 'Szczegóły Zamówienia';
      case 'SEND': return 'Potwierdzenie Wysyłki';
      default: return '';
    }
  };

  const getButtonLabel = () => {
    switch (actionType) {
      case 'CONFIRM': return 'Zatwierdź';
      case 'REJECT': return 'Odrzuć Zamówienie';
      case 'SEND': return 'Zaznacz jako Wysłane';
      default: return '';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{getTitle()}</h3>
        
        <div className="order-details">
          <p><strong>Numer:</strong> {order.orderNumber}</p>
          <p><strong>Produkty:</strong></p>
          <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
            {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
              <li key={idx}>{item.name} - {item.qty} szt.</li>
            ))}
          </ul>
        </div>

        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>
          {actionType === 'DETAILS' 
            ? 'Komentarz do zamówienia:' 
            : actionType === 'SEND'
              ? 'Informacje o wysyłce (np. nr listu przewozowego):'
              : `Komentarz ${actionType === 'REJECT' ? '(Wymagany powód)' : '(Opcjonalny)'}:`
          }
        </label>
        
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={actionType === 'DETAILS'}
          placeholder={actionType === 'SEND' ? 'Np. Kurier DPD, nr 12345...' : 'Wpisz treść...'}
          style={actionType === 'DETAILS' ? { backgroundColor: '#333', color: '#ccc' } : {}}
        />

        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">
            {actionType === 'DETAILS' ? 'Zamknij' : 'Anuluj'}
          </button>
          
          {actionType !== 'DETAILS' && (
            <button 
              onClick={handleSubmit} 
              className={actionType === 'REJECT' ? 'btn-reject' : 'btn-confirm'}
              disabled={actionType === 'REJECT' && comment.trim().length === 0}
            >
              {getButtonLabel()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}