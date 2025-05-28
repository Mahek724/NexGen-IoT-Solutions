import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/navbar.css';

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const term = e.target.elements.search.value.trim();
    if (term) navigate(`/project/${term.toLowerCase()}`);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <span className="navbar-title">Research Dashboard</span>
        <div className="project-links">
          <Link to="/" className="project-link">Home</Link>
          {['Battery', 'Solar', 'Robotics', 'HEMM'].map(name => (
            <Link key={name} to={`/project/${name.toLowerCase()}`} className="project-link">
              {name}
            </Link>
          ))}
        </div>
      </div>

      <div className="navbar-right">
        <form className="search-form" onSubmit={handleSearch}>
          <input name="search" type="text" placeholder="Search" />
          <button type="submit">Go</button>
        </form>

        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
