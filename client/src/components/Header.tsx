import './Header.scss';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

export function Header({ userName, onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <h1>Portal Dostawcy - Firma Sp. j.</h1>
      
      <div className="user-section">
        <div className="user-info">
          Zalogowany jako:<br />
          <strong>{userName}</strong>
        </div>
        <button onClick={onLogout} className="logout-btn">
          Wyloguj
        </button>
      </div>
    </header>
  );
}