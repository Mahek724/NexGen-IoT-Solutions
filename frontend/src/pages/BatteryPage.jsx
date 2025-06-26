import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import '../assets/css/batteryPage.css';

const metricConfig = {
  temperature: {label: 'Temperature', bg: '#ffe9e6', border: '#ff7d6e', line: '#ff4d2d', text: '#b13c2e'},
  voltage: {label: 'Voltage', bg: '#e8f7f0', border: '#44e0b2', line: '#00b894', text: '#1d6e5b'},
  pressure: {label: 'Pressure', bg: '#f0f0ff', border: '#b3aaff', line: '#6c5ce7', text: '#3b3474'},
  humidity: {label: 'Humidity', bg: '#eeffff', border: '#5de6e6', line: '#00cec9', text: '#1b7270'}
};

const validationRanges = {
  temperature: [19, 40],
  humidity: [20, 60],
  pressure: [998, 1003],
  gas_resistance: [2, 16],
  altitude: [95, 115],
  voltage: [5, 12]
};

const isOutOfRange = (value, [min, max]) => value < min || value > max;

const isUncertain = (row) => {
  return Object.entries(validationRanges).some(([key, [min, max]]) => {
    return row[key] < min || row[key] > max;
  });
};

const getParameterAlerts = (data) => {
  const alerts = Object.keys(validationRanges).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  data.forEach(row => {
    for (const [key, [min, max]] of Object.entries(validationRanges)) {
      if (row[key] < min || row[key] > max) alerts[key]++;
    }
  });
  return alerts;
};



const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const item = payload[0];
    return (
      <div style={{ background: '#fff', border: '1px solid #ccc', padding: 8, borderRadius: 6, fontSize: 14 }}>
        <p>{label}</p>
        <p style={{ color: item.stroke }}>{item.name} : {item.value}</p>
      </div>
    );
  }
  return null;
};



const BatteryPage = () => {
  const { towerId } = useParams();
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [latest, setLatest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const parameterAlerts = getParameterAlerts(data);


  const fetchData = async () => {
  try {
    const towerParam = towerId.replace('tower-', '').replace('Tower-', '').replace('Tower', '').trim();
    const res = await axios.get(`http://localhost:5000/api/battery-data?towerId=${towerParam}`);
    setData(res.data);
    setLatest(res.data[res.data.length - 1]);
  } catch (err) {
    console.error("Error fetching tower data", err);
    setData([]);
    setLatest(null);
  }
};


  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    const switchInterval = setInterval(() => {
      setSelectedMetric(prev => {
        const idx = metrics.indexOf(prev);
        return metrics[(idx + 1) % metrics.length];
      });
    }, 10000);
    return () => {
      clearInterval(interval);
      clearInterval(switchInterval);
    };
  }, [towerId]);

  const avg = (arr, field) =>
    arr.length > 0 ? (arr.reduce((sum, item) => sum + (item[field] || 0), 0) / arr.length).toFixed(2) : '0.00';

  const max = (arr, field) =>
    arr.length > 0 ? Math.max(...arr.map(item => item[field] || 0)) : 0;

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "BatteryData");
    XLSX.writeFile(wb, "BatteryData.xlsx");
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedData = filteredData.slice().sort((a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const renderPageButtons = () => {
    const maxVisible = 5;
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if ((i === page - 2 && i > 1) || (i === page + 2 && i < totalPages)) {
        pages.push('...');
      }
    }
    return pages.filter((v, i, a) => i === 0 || v !== a[i - 1]).map((p, i) =>
      p === '...' ? (
        <span key={i} className="pagination-ellipsis">...</span>
      ) : (
        <button key={i}
          className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
          onClick={() => setPage(p)}>{p}
        </button>
      )
    );
  };

  const getAlertStats = (data) => {
    const total = data.length;
    const alertCount = data.filter(isUncertain).length;
    return {
      count: alertCount,
      percent: total > 0 ? (alertCount / total) * 100 : 0
    };
  };

  const metrics = ['temperature', 'voltage', 'pressure', 'humidity'];
  const metric = metricConfig[selectedMetric];
  const alertStats = getAlertStats(data);

  return (
    <div className="container-fluid px-4 py-4 battery-dashboard">
      <div className="d-flex align-items-center justify-content-center mb-2">
        <div className="battery-icon-wrapper vertical">
          <div className="battery-icon">
            <div
              className="battery-fill"
              style={{
                height: `${100 - alertStats.percent}%`,
                backgroundColor: alertStats.count > 0 ? 'red' : 'limegreen',
                animation: alertStats.count > 0 ? 'blink 1s infinite' : 'none'
              }}
            />
            {/* No percentage text here */}
          </div>
        </div>

        <h2 className="text-center glow-text m-0">
          {towerId ? `Battery Dashboard Tower-${towerId}` : "Battery Dashboard"}
        </h2>
      </div>

      <div className="card-row">
        <div className="info-card card-avg-temp">🌡 Avg Temp: {avg(data, 'temperature')} °C</div>
        <div className="info-card card-avg-volt">⚡ Avg Volt: {avg(data, 'voltage')} V</div>
        <div className="info-card card-max-alt">🗻 Max Alt: {max(data, 'altitude')} m</div>
        <div className="info-card card-humidity">💧 Humidity: {latest?.humidity || '--'} %</div>
        <div className="info-card card-timestamp">⏱ Latest: {latest?.timestamp?.slice(0, 19).replace('T', ' ') || '--'}</div>
      </div>
      
       {alertStats.count > 0 && (
           <div className="alert-box mb-3">
              <strong>Alert Summary:</strong>
              <ul className="mb-0 mt-1">
              {Object.entries(parameterAlerts).map(([key, count]) =>
          count > 0 && <li key={key}>{key.charAt(0).toUpperCase() + key.slice(1)} out of range: {count} times</li>
              )}
              </ul>
            </div>
        )}


      <div className="metric-btn-group">
        {metrics.map(metricKey => (
          <button
            key={metricKey}
            onClick={() => setSelectedMetric(metricKey)}
            style={{
              background: metricConfig[metricKey].bg,
              border: `1.5px solid ${metricConfig[metricKey].border}`,
              color: metricConfig[metricKey].text,
              fontWeight: 700
            }}
            className={`metric-btn ${selectedMetric === metricKey ? 'active' : ''}`}>
            {metricConfig[metricKey].label}
          </button>
        ))}
      </div>

       
      <div className="graph-and-card">
        <div
          className="graph-container"
          style={{
            background: metric.bg,
            border: `2px solid ${metric.border}`,
            borderRadius: 14,
            padding: 18,
            boxShadow: `0 2px 12px ${metric.border}22`
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(t) => t?.slice(11, 16)} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={metric.line}
                  strokeWidth={2.5}
                  dot={(dotProps) => {
                    const row = data[dotProps.index];
                    return isUncertain(row) ? (
                      <circle cx={dotProps.cx} cy={dotProps.cy} r={4} fill="red" />
                    ) : null;
                  }}
                  isAnimationActive={false}
              />

            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="floating-latest-box animate-pulse">
          <h6><i className="bi bi-clock-history"></i> Latest Reading</h6>
          <p>📅 {latest?.timestamp?.slice(0, 19).replace('T', ' ')}</p>
          <p>🌡 Temp: {latest?.temperature} °C</p>
          <p>⚡ Volt: {latest?.voltage} V</p>
          <p>💧 Humidity: {latest?.humidity} %</p>
          <p>🗻 Alt: {latest?.altitude} m</p>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center my-3 flex-wrap gap-2">
        <input type="text" className="form-control w-auto" placeholder="Search..."
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button className="btn btn-success" onClick={exportToExcel}>📤 Export CSV/Excel</button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Timestamp</th><th>Temperature (°C)</th><th>Humidity (%)</th>
              <th>Pressure (hPa)</th><th>Gas (kΩ)</th><th>Altitude (m)</th><th>Voltage (V)</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => {
              const isRowUncertain =
                row.temperature < 19 || row.temperature > 40 ||
                row.humidity < 20 || row.humidity > 60 ||
                row.pressure < 998 || row.pressure > 1003 ||
                row.gas_resistance < 2 || row.gas_resistance > 16 ||
                row.altitude < 95 || row.altitude > 115 ||
                row.voltage < 5 || row.voltage > 12;

              return (
                <tr key={idx}>
                    <td>{row.timestamp?.slice(0, 19).replace('T', ' ')}</td>
                    
                    <td className={isOutOfRange(row.temperature, validationRanges.temperature) ? 'uncertain-cell' : ''}>
                      {row.temperature}
                    </td>
                    
                    <td className={isOutOfRange(row.temperature, validationRanges.temperature) ? 'uncertain-cell' : ''}>
                      {row.humidity}
                    </td>
                    
                    <td className={isOutOfRange(row.temperature, validationRanges.temperature) ? 'uncertain-cell' : ''}>
                      {row.pressure}
                    </td>
                    
                    <td className={isOutOfRange(row.temperature, validationRanges.temperature) ? 'uncertain-cell' : ''}>
                      {row.gas_resistance}
                    </td>
                    
                    <td className={isOutOfRange(row.temperature, validationRanges.temperature) ? 'uncertain-cell' : ''}>
                      {row.altitude}
                    </td>
                    
                    <td className={isOutOfRange(row.temperature, validationRanges.temperature) ? 'uncertain-cell' : ''}>
                      {row.voltage}
                    </td>
                </tr>

              );
            })}
          </tbody>

        </table>
      </div>

      <div className="d-flex justify-content-center mt-3 flex-wrap pagination-container">
        {renderPageButtons()}
      </div>
    </div>
  );
};

export default BatteryPage;
