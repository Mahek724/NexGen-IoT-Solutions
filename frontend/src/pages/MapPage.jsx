import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState } from 'react';
import '../assets/css/map.css';
import mapImg from '../../public/images/map.jpg';

const towerPositions = [
  { id: 1, top: '8%', left: '2%' }, { id: 2, top: '12%', left: '10%' },
  { id: 3, top: '25%', left: '5%' }, { id: 4, top: '35%', left: '12%' },
  { id: 5, top: '42%', left: '3%' }, { id: 6, top: '49%', left: '10%' },
  { id: 7, top: '60%', left: '3%' }, { id: 8, top: '62%', left: '13%' },
  { id: 9, top: '75%', left: '2%' }, { id: 10, top: '78%', left: '8%' },
  { id: 11, top: '10%', left: '20%' }, { id: 12, top: '21%', left: '28%' },
  { id: 13, top: '27%', left: '20%' }, { id: 14, top: '38%', left: '34%' },
  { id: 15, top: '39%', left: '24%' }, { id: 16, top: '50%', left: '18%' },
  { id: 17, top: '51%', left: '28%' }, { id: 18, top: '64%', left: '22%' },
  { id: 19, top: '79%', left: '16%' }, { id: 20, top: '69%', left: '29%' },
  { id: 21, top: '9%', left: '34%' }, { id: 22, top: '24%', left: '37%' },
  { id: 23, top: '30%', left: '43%' }, { id: 24, top: '12%', left: '43%' },
  { id: 25, top: '42%', left: '48%' }, { id: 26, top: '48%', left: '40%' },
  { id: 27, top: '60%', left: '35%' }, { id: 28, top: '60%', left: '47%' },
  { id: 29, top: '85%', left: '23%' }, { id: 30, top: '72%', left: '40%' },
  { id: 31, top: '20%', left: '50%' }, { id: 32, top: '8%', left: '55%' },
  { id: 33, top: '32%', left: '55%' }, { id: 34, top: '18%', left: '63%' },
  { id: 35, top: '48%', left: '55%' }, { id: 36, top: '75%', left: '49%' },
  { id: 37, top: '50%', left: '65%' }, { id: 38, top: '62%', left: '55%' },
  { id: 39, top: '68%', left: '65%' }, { id: 40, top: '78%', left: '60%' },
  { id: 41, top: '12%', left: '75%' }, { id: 42, top: '38%', left: '73%' },
  { id: 43, top: '24%', left: '80%' }, { id: 44, top: '20%', left: '89%' },
  { id: 45, top: '56%', left: '75%' }, { id: 46, top: '52%', left: '83%' },
  { id: 47, top: '40%', left: '88%' }, { id: 48, top: '64%', left: '90%' },
  { id: 49, top: '80%', left: '89%' }, { id: 50, top: '80%', left: '75%' },
];

const MapPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [hoveredTower, setHoveredTower] = useState(null);
  const [selectedTowers, setSelectedTowers] = useState([]);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const { offsetWidth, offsetHeight } = containerRef.current;
    setContainerSize({ width: offsetWidth, height: offsetHeight });
  }, []);

  const getRelativeCoords = (e) => {
  const rect = containerRef.current.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};


  const getPixelPosition = (top, left) => ({
    x: parseFloat(left) / 100 * containerSize.width,
    y: parseFloat(top) / 100 * containerSize.height,
  });

  const getDistance = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy) / 10; 
  };

  const handleMouseUp = () => {
  if (!dragStart || !dragEnd) {
    setIsDragging(false);
    return;
  }

  const x1 = Math.min(dragStart.x, dragEnd.x);
  const y1 = Math.min(dragStart.y, dragEnd.y);
  const x2 = Math.max(dragStart.x, dragEnd.x);
  const y2 = Math.max(dragStart.y, dragEnd.y);

  const selected = towerPositions.filter((tower) => {
    const pixel = getPixelPosition(tower.top, tower.left);
    return pixel.x >= x1 && pixel.x <= x2 && pixel.y >= y1 && pixel.y <= y2;
  });

  setSelectedTowers(selected);  
  setIsDragging(false);
  setDragStart(null);
  setDragEnd(null);
};


  return (
    <div className="map-background" ref={containerRef} onMouseDown={(e) => { 
      setDragStart(getRelativeCoords(e));
      setIsDragging(true);
    }}

     onMouseMove={(e) => {
      if (isDragging) {
        const currentEnd = getRelativeCoords(e);
        setDragEnd(currentEnd);

    // Calculate live selection while dragging
    const x1 = Math.min(dragStart.x, currentEnd.x);
    const y1 = Math.min(dragStart.y, currentEnd.y);
    const x2 = Math.max(dragStart.x, currentEnd.x);
    const y2 = Math.max(dragStart.y, currentEnd.y);

    const dynamicSelected = towerPositions.filter((tower) => {
      const pixel = getPixelPosition(tower.top, tower.left);
      return pixel.x >= x1 && pixel.x <= x2 && pixel.y >= y1 && pixel.y <= y2;
    });
    setSelectedTowers(dynamicSelected);  
  }
}}
      
  onMouseUp={() => {
  if (!dragStart || !dragEnd) {
    setIsDragging(false);
    return;
  }
}}
 >
      <img src={mapImg} alt="Mine Map" className="map-img" />
      {dragStart && dragEnd && (
        <div
          className="selection-box"
          style={{
            left: Math.min(dragStart.x, dragEnd.x),
            top: Math.min(dragStart.y, dragEnd.y),
            width: Math.abs(dragStart.x - dragEnd.x),
            height: Math.abs(dragStart.y - dragEnd.y),
          }}
        />
      )}

      <svg className="svg-overlay">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="blue" />
          </marker>
        </defs>

        {hoveredTower && (() => {
          const from = getPixelPosition(hoveredTower.top, hoveredTower.left);
          const closestTowers = towerPositions
            .filter(t => t.id !== hoveredTower.id)
            .map(t => {
              const to = getPixelPosition(t.top, t.left);
              const distance = getDistance(from.x, from.y, to.x, to.y);
              return { ...t, distance, to };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 3);

          return closestTowers.map((t, idx) => (
            <g key={idx}>
              <line
                x1={from.x}
                y1={from.y}
                x2={t.to.x}
                y2={t.to.y}
                stroke="green"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
              <rect
                x={(from.x + t.to.x) / 2 - 20}
                y={(from.y + t.to.y) / 2 - 32}
                width="40"
                height="18"
                rx="5"
                ry="5"
                fill="white"
                opacity="0.85"
              />
              <text
                x={(from.x + t.to.x) / 2}
                y={(from.y + t.to.y) / 2 - 20}
                fill="#000"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                {t.distance.toFixed(1)} m
              </text>
            </g>
          ));
        })()}
      </svg>

      {towerPositions.map((tower) => {
      const isSelected = selectedTowers.some(t => t.id === tower.id);
      return (
        <div
          key={tower.id}
          className={`tower-marker ${isSelected ? 'show-radius' : ''}`}
          style={{ top: tower.top, left: tower.left }}
          onClick={(e) => {
            if (isDragging || dragStart || dragEnd) return;
            navigate(`/project/battery/tower/${tower.id}`);
          }}
          onMouseEnter={() => setHoveredTower(tower)}
          onMouseLeave={() => setHoveredTower(null)}
        >
          <div className="tower-label">Tower-{tower.id}</div>
          <div className="tower-icon">
            <span role="img" aria-label="tower">🔋</span>
          </div>
          <div className="tower-bar">
            <div className={`bar-fill ${tower.id % 2 === 0 ? 'bar-green' : 'bar-red'}`}></div>
          </div>

          <div className={`radius-popup ${isSelected ? 'radius-visible' : ''}`}>
            Radius: {(tower.id * 5 + 100)}m
          </div>
        </div>
      );
    })}

    </div>
  );
};

export default MapPage;
