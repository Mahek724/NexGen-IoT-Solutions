import { useState, useEffect } from 'react'
import { Routes, Route} from 'react-router-dom'
//import './App.css'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProjectPage from './pages/ProjectPage';
import BatteryPage from './pages/BatteryPage';
import SolarPage from './pages/SolarPage';
import RoboticsPage from './pages/RoboticsPage';
import HEMMPage from './pages/HEMMPage';
import Footer from './components/Footer';

function App() {
     const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
      document.body.className = darkMode ? 'dark-mode' : '';
    }, [darkMode]);


  return (
    
      <div>
        
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <div className="container mt-4"></div>
            <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/home" element={<Home />} />
             <Route path="/project/:id" element={<ProjectPage />} />
             <Route path="/project/battery" element={<BatteryPage />} />
             <Route path="/project/solar" element={<SolarPage />} />
             <Route path="/project/robotics" element={<RoboticsPage />} />
             <Route path="/project/hemm" element={<HEMMPage />} />
             
             
            </Routes>
            <Footer></Footer>

        
    </div>
  )
}

export default App
