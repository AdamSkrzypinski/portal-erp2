import './Footer.scss';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
          <span className="copyright">&copy; {currentYear}</span>            
          <span>Realizacja: </span>
          <a 
            href="https://github.com/AdamSkrzypinski" 
            target="_blank" 
            rel="noopener noreferrer"
            className="author-link"
          >
            Adam Skrzypiński
          </a>             
    </footer>
  );
}