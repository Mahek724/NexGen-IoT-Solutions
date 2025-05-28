import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/home.css';

const images = [
  'images/bg1.jpg',
  'images/bg2.jpg',
  'images/bg3.jpg',
  'images/bg4.jpg'
];

const projectData = [
  {
    title: 'Battery Health Monitoring',
    summary: 'An IoT-based system to monitor and predict battery degradation using real-time data.',
    img: 'images/battery.jpg',
    link: '/project/battery'
  },
  {
    title: 'Solar Energy Optimization',
    summary: 'Harnessing AI to optimize solar panel output for maximum energy efficiency.',
    img: 'images/solar.jpg',
    link: '/project/solar'
  },
  {
    title: 'Robotics in Mining',
    summary: 'A robotic system designed to improve safety and efficiency in underground mining operations.',
    img: 'images/robotics.jpg',
    link: '/project/robotics'
  },
  {
    title: 'HEMM Predictive Maintenance',
    summary: 'Using ML to predict maintenance schedules and reduce downtime in heavy machinery.',
    img: 'images/hemm.jpg',
    link: '/project/hemm'
  }
];

function Home() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <div
        className="carousel-bg"
        style={{ backgroundImage: `url(${images[bgIndex]})` }}
      >
        <div className="carousel-overlay">
          <h1 className="hero-title">Welcome to the Smart Research Dashboard</h1>
          <p className="hero-subtitle">
            Explore real-time IoT projects in energy, automation and mining.
          </p>
        </div>
      </div>

      <div className="project-section">
        {projectData.map((project, idx) => (
          <div className="project-card" key={idx}>
            <img src={project.img} alt={project.title} className="project-img" />
            <div className="project-content">
              <h5 className="project-title">{project.title}</h5>
              <p className="project-summary">{project.summary}</p>
              <div className="btn-wrapper">
                <Link to={project.link} className="project-btn">View Project</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
