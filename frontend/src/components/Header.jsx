import { FiHome, FiChevronRight, FiWind, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

export default function Header({ location }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">
            <FiWind />
          </div>
          <div>
            <div className="header-title">AirPulse</div>
            <div className="header-subtitle">Pollution Monitor</div>
          </div>
        </div>
        <div className="header-actions">
          <nav className="breadcrumb">
            <span className="breadcrumb-item"><FiHome /> Dashboard</span>
            <span className="breadcrumb-sep"><FiChevronRight /></span>
            <span className="breadcrumb-item">India</span>
            {location && (
              <>
                <span className="breadcrumb-sep"><FiChevronRight /></span>
                <span className="breadcrumb-item">{location.state}</span>
                <span className="breadcrumb-sep"><FiChevronRight /></span>
                <span className="breadcrumb-item active">{location.name}</span>
              </>
            )}
          </nav>
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <span className={`toggle-track ${theme}`}>
              <span className="toggle-thumb">
                {theme === 'dark' ? <FiMoon size={12} /> : <FiSun size={12} />}
              </span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
