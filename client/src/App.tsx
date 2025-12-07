import { useEffect, useState } from 'react';
import apiClient from './apiClient';
import type { Order } from './types';
import './App.scss';

import { LoginForm } from './components/LoginForm';
import { OrdersTable } from './components/OrdersTable';
import { LogoutScreen } from './components/LogoutScreen';
import { Header } from './components/Header';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
      const parsedUser = JSON.parse(user);
      setUserName(parsedUser.name);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setIsLoggingOut(false);
      setOrders([]);
      setUserName('');
    }, 1500);
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Order[]>('/orders');
      const parsedOrders = response.data.map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      }));
      setOrders(parsedOrders);
    } catch (err) {
      console.error(err);
      setError('Nie udało się pobrać listy zamówień.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (id: number, status: string, comment: string) => {
    try {
      await apiClient.patch(`/orders/${id}/status`, {
        status,
        comment
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Wystąpił błąd podczas aktualizacji zamówienia.');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
      const user = localStorage.getItem('user');
      if (user) setUserName(JSON.parse(user).name);
    }
  }, [isLoggedIn]);

  if (isLoggingOut) {
    return <LogoutScreen />;
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app-card">
      <Header userName={userName} onLogout={handleLogout} />
      
      {loading && <p className="loading-msg">Ładowanie zamówień z systemu ERP...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <OrdersTable orders={orders} onUpdateOrder={handleUpdateOrder} />
      )}
    </div>
  );
}

export default App;