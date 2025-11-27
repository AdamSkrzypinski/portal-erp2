import { useEffect, useState } from 'react';
import apiClient from './apiClient';
import type { Order } from './types';
import './App.scss';
import { LoginForm } from './components/LoginForm';
import { OrdersTable } from './components/OrdersTable';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Order[]>('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError('Nie udało się pobrać listy zamówień.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (id: number) => {
    try {
      await apiClient.patch(`/orders/${id}/status`, {
        status: 'POTWIERDZONE'
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Wystąpił błąd podczas potwierdzania zamówienia.');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app-card">
      <header className="app-header">
        <h1>Portal Dostawcy - Firma Sp. j.</h1>
        <button onClick={() => setIsLoggedIn(false)} className="logout-btn">
          Wyloguj
        </button>
      </header>
      
      {loading && <p className="loading-msg">Ładowanie zamówień z systemu ERP...</p>}
      
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <OrdersTable orders={orders} onConfirmOrder={handleConfirmOrder} />
      )}
    </div>
  );
}

export default App;