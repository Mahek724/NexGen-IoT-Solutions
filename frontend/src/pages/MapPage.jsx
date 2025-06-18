import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/map.css';
import mapImg from '../../public/images/map.jpg';

const NUM_TOWERS = 50;

const towerPositions = [
  { id: 1, top: '8%', left: '2%' },
  { id: 2, top: '12%', left: '10%' },
  { id: 3, top: '25%', left: '5%' },
  { id: 4, top: '35%', left: '12%' },
  { id: 5, top: '42%', left: '3%' },
  { id: 6, top: '49%', left: '10%' },
  { id: 7, top: '60%', left: '3%' },
  { id: 8, top: '62%', left: '13%' },
  { id: 9, top: '75%', left: '2%' },
  { id: 10, top: '78%', left: '8%' },

  { id: 11, top: '10%', left: '20%' },
  { id: 12, top: '21%', left: '28%' },
  { id: 13, top: '27%', left: '20%' },
  { id: 14, top: '38%', left: '34%' },
  { id: 15, top: '39%', left: '24%' },
  { id: 16, top: '50%', left: '18%' },
  { id: 17, top: '51%', left: '28%' },
  { id: 18, top: '64%', left: '22%' },
  { id: 19, top: '79%', left: '16%' },
  { id: 20, top: '69%', left: '29%' },

  { id: 21, top: '9%', left: '34%' },
  { id: 22, top: '24%', left: '37%' },
  { id: 23, top: '30%', left: '43%' },
  { id: 24, top: '12%', left: '43%' },
  { id: 25, top: '42%', left: '48%' },
  { id: 26, top: '48%', left: '40%' },
  { id: 27, top: '60%', left: '35%' },
  { id: 28, top: '60%', left: '47%' },
  { id: 29, top: '85%', left: '23%' },
  { id: 30, top: '72%', left: '40%' },

  { id: 31, top: '20%', left: '50%' },
  { id: 32, top: '8%', left: '55%' },
  { id: 33, top: '32%', left: '55%' },
  { id: 34, top: '18%', left: '63%' },
  { id: 35, top: '48%', left: '55%' },
  { id: 36, top: '75%', left: '49%' },
  { id: 37, top: '50%', left: '65%' },
  { id: 38, top: '62%', left: '55%' },
  { id: 39, top: '68%', left: '65%' },
  { id: 40, top: '78%', left: '60%' },

  { id: 41, top: '12%', left: '75%' },
  { id: 42, top: '38%', left: '73%' },
  { id: 43, top: '24%', left: '80%' },
  { id: 44, top: '20%', left: '89%' },
  { id: 45, top: '56%', left: '75%' },
  { id: 46, top: '52%', left: '83%' },
  { id: 47, top: '40%', left: '88%' },
  { id: 48, top: '64%', left: '90%' },
  { id: 49, top: '80%', left: '89%' },
  { id: 50, top: '80%', left: '75%' },
];


const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div className="map-background">
      <img src={mapImg} alt="Mine Map" className="map-img" />
      {towerPositions.map((tower) => (
        <div
          key={tower.id}
          className="tower-marker"
          style={{ top: tower.top, left: tower.left }}
          onClick={() => navigate(`/project/battery/tower/${tower.id}`)}
        >
          <div className="tower-label">Tower-{tower.id}</div>
          <div className="tower-icon">
            <span role="img" aria-label="tower">🔋</span>
          </div>
          <div className="tower-bar">
            <div className={`bar-fill ${tower.id % 2 === 0 ? 'bar-green' : 'bar-red'}`}></div>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default MapPage;