import { useState } from 'react';
import './LoginForm.scss';

interface LoginFormProps {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
  
    const validUsers = ['dostawca1@firma.pl', 'dostawca2@firma.pl', 'dostawca3@firma.pl'];
    const validPass = ['testowy1', 'testowy2', 'testowy3'];

    if (validUsers.includes(email) && validPass.includes(password)) {
      onLogin();
    } else {
      setError('Błędny login lub hasło.');
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
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="login-button">
          Zaloguj się
        </button>
      </form>

      <div className="demo-credentials">
        <h3>Dane do logowania dla testowania aplikacji</h3>
        <ul>
          <li>
            <strong>Dostawca 1:</strong>
            <code>dostawca1@firma.pl</code>
            <code>testowy1</code>

          </li>
          <li>
            <strong>Dostawca 2:</strong>
            <code>dostawca2@firma.pl</code>
            <code>testowy2</code>

          </li>
          <li>
            <strong>Dostawca 3:</strong>
            <code>dostawca3@firma.pl</code>
            <code>testowy3</code>

          </li>
        </ul>
      </div>
    </div>
  );
}