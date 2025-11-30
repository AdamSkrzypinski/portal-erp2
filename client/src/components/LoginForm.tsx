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
      setError('Błędny login lub hasło.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card login-card">
      <h2>Logowanie Dostawcy</h2>
      <p>System B2B - Firma Sp. j.</p>
      
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
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>

      <div className="demo-credentials">
        <h3>Dane do logowania dla testowania aplikacji</h3>
        <ul>
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