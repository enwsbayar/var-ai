import { Link, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
    const { pathname } = useLocation();

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <Zap size={18} />
                    </div>
                    <span className="logo-text">VAR<span className="logo-accent">AI</span></span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Ana Sayfa</Link>
                    <Link to="/upload" className={`nav-link ${pathname === '/upload' ? 'active' : ''}`}>Analiz Et</Link>
                </div>

                <Link to="/upload" className="btn btn-primary nav-cta">
                    <Zap size={16} />
                    Analizi Başlat
                </Link>
            </div>
        </nav>
    );
}
