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
    
    if (email === 'jan@stal-met.pl' && password === 'haslo123') {
      onLogin();
    } else {
      setError('Błędny login lub hasło (Spróbuj: jan@stal-met.pl / haslo123)');
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
    </div>
  );
}