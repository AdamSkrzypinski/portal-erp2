import { useEffect, useState } from 'react';
import apiClient from './apiClient';
import type { Order, AuditLogEntry, User } from './types';
import './App.scss';

import { LoginForm } from './components/LoginForm';
import { OrdersTable } from './components/OrdersTable';
import { LogoutScreen } from './components/LogoutScreen';
import { Header } from './components/Header';
import { AuditLogTable } from './components/AuditLogTable';
import { Footer } from './components/Footer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  
  const [currentView, setCurrentView] = useState<'ORDERS' | 'LOGS'>('ORDERS');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
      setError('Nie udało się pobrać danych.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<AuditLogEntry[]>('/admin/logs');
      setLogs(response.data);
    } catch (err) {
      console.error(err);
      alert('Błąd pobierania historii.');
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

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setIsLoggingOut(false);
      setOrders([]);
      setLogs([]);
      setUser(null);
      setCurrentView('ORDERS');
    }, 1500);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  const handleViewChange = (view: 'ORDERS' | 'LOGS') => {
    setCurrentView(view);
    if (view === 'ORDERS') fetchOrders();
    if (view === 'LOGS') fetchLogs();
  };

  if (isLoggingOut) {
    return <LogoutScreen />;
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => window.location.reload()} />;
  }

  return (
    <div className="app-card">
      <Header userName={user?.name || ''} onLogout={handleLogout} />
      
      {user?.role === 'ADMIN' && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button 
            className="action-btn"
            style={{ 
              backgroundColor: currentView === 'ORDERS' ? '#009879' : '#333',
              padding: '10px 20px',
              fontSize: '1rem',
              border: '1px solid #555'
            }}
            onClick={() => handleViewChange('ORDERS')}
          >
            📦 Zamówienia
          </button>
          
          <button 
            className="action-btn"
            style={{ 
              backgroundColor: currentView === 'LOGS' ? '#6f42c1' : '#333',
              padding: '10px 20px',
              fontSize: '1rem',
              border: '1px solid #555'
            }}
            onClick={() => handleViewChange('LOGS')}
          >
            📜 Panel Administratora
          </button>
        </div>
      )}

      {loading && <p className="loading-msg">Ładowanie danych...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        currentView === 'ORDERS' 
          ? <OrdersTable orders={orders} onUpdateOrder={handleUpdateOrder} />
          : <AuditLogTable logs={logs} />
      )}
      <Footer />
    </div>
    
  );
}

export default App;