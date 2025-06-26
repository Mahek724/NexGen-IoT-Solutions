import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/navbar.css';

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const handleSearch = (e) => {
  e.preventDefault();
  const term = e.target.elements.search.value.trim().toLowerCase();

  if (!term) return;

  const isTowerId = /^tower[-_]?\d+$/i.test(term);

  if (isTowerId) {
    navigate(`/project/battery/tower/${term}`);
  } else {
    navigate(`/project/${term}`);
  }
};


  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <span className="navbar-title">Research Dashboard</span>
        <div className="project-links">
          <Link to="/" className="project-link">Home</Link>
          <Link to="/project/battery" className="project-link">Battery</Link>
          <Link to="/project/solar" className="project-link">Solar</Link>
          <Link to="/project/robotics" className="project-link">Robotics</Link>
          <Link to="/project/hemm" className="project-link">HEMM</Link>
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