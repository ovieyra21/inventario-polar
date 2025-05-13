import React, { useEffect, useState } from 'react';
import { fetchProductionHistory } from '../../services/productionHistoryService';
import { Line } from 'react-chartjs-2';

const ProductionHistory = () => {
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProductionHistory();
      setHistoryData(data);
    };
    fetchData();
  }, []);

  if (!historyData) {
    return <div>Loading historical data...</div>;
  }

  const chartData = {
    labels: historyData.map((entry) => entry.date),
    datasets: [
      {
        label: 'Production Volume',
        data: historyData.map((entry) => entry.volume),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  };

  return (
    <div className="production-history">
      <h2>Production History</h2>
      <Line data={chartData} />
      <table className="min-w-full border text-sm mt-4">
        <thead>
          <tr>
            <th className="border px-2 py-1">Fecha</th>
            <th className="border px-2 py-1">Volumen</th>
            <th className="border px-2 py-1">Producto</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((entry, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{entry.date}</td>
              <td className="border px-2 py-1">{entry.volume}</td>
              <td className="border px-2 py-1">{entry.product || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionHistory;
