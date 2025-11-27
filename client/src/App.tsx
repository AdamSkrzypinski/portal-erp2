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

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<Order[]>('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Błąd pobierania:', err);
    } finally {
      setLoading(false);
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
    <div className="card">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Portal Dostawcy - Firma Sp. j.</h1>
        <button onClick={() => setIsLoggedIn(false)} style={{ background: '#666' }}>Wyloguj</button>
      </header>
      
      {loading ? (
        <p>Ładowanie zamówień z systemu ERP...</p>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}

export default App;