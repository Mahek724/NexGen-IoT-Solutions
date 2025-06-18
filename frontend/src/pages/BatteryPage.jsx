import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import '../assets/css/batteryPage.css';

const BatteryPage = () => {
  const { towerId } = useParams(); // get tower number from url
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [latest, setLatest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const metrics = ['temperature', 'voltage', 'pressure', 'humidity'];

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    const switchInterval = setInterval(() => {
      setSelectedMetric((prev) => {
        const idx = metrics.indexOf(prev);
        return metrics[(idx + 1) % metrics.length];
      });
    }, 10000);
    return () => {
      clearInterval(interval);
      clearInterval(switchInterval);
    };
    // Only rerun when towerId changes
    // eslint-disable-next-line
  }, [towerId]);

  const fetchData = async () => {
    // Fetch data for the correct tower only!
    const res = await axios.get(`http://localhost:5000/api/battery-data?towerId=${towerId}`);
    console.log("Fetched data:", res.data); 
    setData(res.data);
    setLatest(res.data[res.data.length - 1]);
  };

  const avg = (arr, field) =>
    arr.length > 0 ? (arr.reduce((sum, item) => sum + (item[field] || 0), 0) / arr.length).toFixed(2) : '0.00';

  const max = (arr, field) => arr.length > 0 ? Math.max(...arr.map(item => item[field] || 0)) : 0;

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
      if (
        i === 1 || i === totalPages ||
        (i >= page - 1 && i <= page + 1)
      ) {
        pages.push(i);
      } else if (
        (i === page - 2 && i > 1) ||
        (i === page + 2 && i < totalPages)
      ) {
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

  return (
    <div className="container-fluid px-4 py-4 battery-dashboard">
      <h2 className="text-center mb-4 glow-text">
        {towerId ? `🔋 Battery Dashboard Tower-${towerId}` : "🔋 Battery Dashboard"}
      </h2>
      <div className="card-row">
        <div className="info-card card-avg-temp">🌡 Avg Temp: {avg(data, 'temperature')} °C</div>
        <div className="info-card card-avg-volt">⚡ Avg Volt: {avg(data, 'voltage')} V</div>
        <div className="info-card card-max-alt">🗻 Max Alt: {max(data, 'altitude')} m</div>
        <div className="info-card card-humidity">💧 Humidity: {latest?.humidity || '--'} %</div>
        <div className="info-card card-timestamp">⏱ Latest: {latest?.timestamp?.slice(0, 19).replace('T', ' ') || '--'}</div>
      </div>
      <div className="d-flex justify-content-center mb-3 flex-wrap">
        {metrics.map(metric => (
          <button key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`btn btn-outline-primary m-1 ${selectedMetric === metric ? 'active' : ''}`}>
            {metric.charAt(0).toUpperCase() + metric.slice(1)}
          </button>
        ))}
      </div>
      <div className="graph-and-card">
        <div className="graph-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data.filter((_, i) => i % 5 === 0)}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(t) => t?.slice(11, 16)} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#007bff"
                strokeWidth={2}
                dot={{ r: 4, fill: 'white', stroke: '#007bff', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
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
            {paginatedData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.timestamp?.slice(0, 19).replace('T', ' ')}</td>
                <td>{row.temperature}</td>
                <td>{row.humidity}</td>
                <td>{row.pressure}</td>
                <td>{row.gas_resistance}</td>
                <td>{row.altitude}</td>
                <td>{row.voltage}</td>
              </tr>
            ))}
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