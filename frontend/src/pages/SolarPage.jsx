import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/solarPage.css";

const SolarPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/api/solar")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);
const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 10;

const indexOfLastRow = currentPage * rowsPerPage;
const indexOfFirstRow = indexOfLastRow - rowsPerPage;
const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
const totalPages = Math.ceil(data.length / rowsPerPage);

  const average = (key) => {
    const validValues = data.map(row => parseFloat(row[key])).filter(v => !isNaN(v));
    const sum = validValues.reduce((a, b) => a + b, 0);
    return (sum / validValues.length).toFixed(2);
  };

  return (
    <div className="solar-container">
      <h1>🔆 Solar Dashboard</h1>

      <div className="solar-avg">
        <p><strong>Avg EacToday:</strong> {average("EacToday(kWh)")} kWh</p>
        <p><strong>Avg Pac:</strong> {average("Pac(W)")} W</p>
        <p><strong>Avg INV Temp:</strong> {average("INVTemp(℃)")} ℃</p>
      </div>

      <table className="solar-table">
        <thead>
          <tr>
            <th>Serial</th>
            <th>Time</th>
            <th>Status</th>
            <th>EacToday</th>
            <th>Pac(W)</th>
            <th>INVTemp(℃)</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, idx) => (

            <tr key={idx}>
              <td>{row["Serial number"]}</td>
              <td>{row["Time"]}</td>
              <td>{row["Status"]}</td>
              <td>{row["EacToday(kWh)"]}</td>
              <td>{row["Pac(W)"]}</td>
              <td>{row["INVTemp(℃)"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
            <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
};

export default SolarPage;
