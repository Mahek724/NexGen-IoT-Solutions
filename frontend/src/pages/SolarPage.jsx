import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/solarPage.css';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const SolarPage = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [dailySampleData, setDailySampleData] = useState([]);
  const [marchSampleData, setMarchSampleData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/solar');
        setTemperatureData(res.data.temperature || []);
        setDailySampleData(res.data.dailySample || []);
        setMarchSampleData(res.data.marchSample || []);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const renderTable = (title, data) => (
    <div className="table-container">
      <h2>{title}</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => (
                  <td key={i}>{String(val)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLineChart = (title, data, xKey, yKeys) => (
    <div className="chart-section">
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yKeys.map((key, index) => (
            <Line key={index} type="monotone" dataKey={key} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="solar-dashboard">
      <h1 className="main-heading">🌞 Solar Data Dashboard</h1>

      {/* Daily Sample */}
      {renderLineChart('Daily Sample – EacToday vs Time', dailySampleData, 'Time', ['EacToday(kWh)', 'INVTemp(℃)', 'AMTemp1(℃)'])}
      {renderTable('Daily Sample Data', dailySampleData)}

      {/* Temperature */}
      {renderLineChart('Temperature – EacToday vs AMTemp1', temperatureData, 'AMTemp1(℃)', ['EacToday(kWh)'])}
      {renderTable('Temperature Data', temperatureData)}

      {/* March Sample */}
      {renderLineChart('March Sample – EacToday, Pac(W), INVTemp(℃)', marchSampleData, 'Time', ['EacToday(kWh)', 'Pac(W)', 'INVTemp(℃)'])}
      {renderTable('March Sample Data', marchSampleData)}
    </div>
  );
};

export default SolarPage;
