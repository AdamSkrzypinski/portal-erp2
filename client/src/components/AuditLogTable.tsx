import type { AuditLogEntry } from '../types';
import './OrdersTable.scss'; // Baza stylów tabeli (layout)
import './AuditLogTable.scss'; // Specyficzne style dla logów (kolory, detale)

interface AuditLogTableProps {
  logs: AuditLogEntry[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="orders-table-container audit-log-container">
      <h3 className="audit-header">
        📜 Historia Zmian (Audit Log)
      </h3>
      
      <table className="orders-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Użytkownik</th>
            <th>Nr Zamówienia</th>
            <th>Akcja</th>
            <th>Szczegóły</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="col-timestamp">
                {new Date(log.timestamp).toLocaleString('pl-PL')}
              </td>
              <td className="col-supplier">
                <strong>{log.supplier.name}</strong>
              </td>
              <td className="col-order-ref">
                {log.order.orderNumber}
              </td>
              <td className="col-action">
                <div className="action-title">{log.action}</div>
                {log.oldValue && (
                  <div className="change-diff">
                    {log.oldValue} ➝ <span className="val-new">{log.newValue}</span>
                  </div>
                )}
              </td>
              <td className="col-comment-audit">
                {log.comment || '-'}
              </td>
            </tr>
          ))}
          
          {logs.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-state">
                Brak wpisów w historii zmian.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}