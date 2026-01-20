import { useState } from 'react';
import apiClient from '../apiClient';
import './LoginForm.scss';

interface LoginFormProps {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin();
    } catch (err) {
      setError('Błędny login lub hasło (lub serwer się jeszcze wybudza).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card login-card">
      <h2>Logowanie Dostawcy</h2>
      <h3>System ERP2 - Firma Sp. j.</h3>
      
      <div className="server-warning">
        <span className="warning-icon">⚠️</span>
        <div className="warning-text">
          <strong>Ważna informacja:</strong>
          <span>
            Aplikacja działa na darmowym serwerze z ograniczeniami. Pierwsze logowanie po okresie bezczynności może potrwać do <strong>60 sekund</strong> (wybudzanie).
            <br />
            Jeśli wystąpi błąd, odczekaj chwilę i spróbuj ponownie.
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logowanie (może potrwać chwilę)...' : 'Zaloguj się'}
        </button>
      </form>

      <div className="demo-credentials">
        <h3>Dane do logowania dla testowania aplikacji</h3>
        <ul>
          <li> 
            <strong style={{ color: '#e75050' }}>Administrator (Dział Zakupów):</strong>
            <code>zakupy@firma.pl</code>
            <code>admin123</code>
          </li>
          <li>
            <strong>Dostawca 1 (Stal i Profile):</strong>
            <code>dostawca1@firma.pl</code>
            <code>testowy1</code>
          </li>
          <li>
            <strong>Dostawca 2 (Elektronika):</strong>
            <code>dostawca2@firma.pl</code>
            <code>testowy2</code>
          </li>
          <li>
            <strong>Dostawca 3 (Opakowania i BHP):</strong>
            <code>dostawca3@firma.pl</code>
            <code>testowy3</code>
          </li>
        </ul>
      </div>
    </div>
  );
}