"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HistoryChart({ sensor = "sensor1", maxPoints = 200 }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/${sensor}`); 
        const json = await res.json();

        if (json.success) {
          // Sort berdasarkan timestamp
          const sorted = json.data.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );

          // Ambil hanya maxPoints terakhir
          const latestData = sorted.slice(-maxPoints);
          setHistory(latestData);
        } else {
          console.error("API error:", json.error);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sensor, maxPoints]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const timestamp = new Date(label).toLocaleString();
      return (
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-800 mb-1">{timestamp}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} className={`text-sm font-medium ${entry.stroke === '#8884d8' ? 'text-indigo-600' : 'text-green-600'}`}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 animate-pulse">Memuat data...</p>
        </div>
      ) : history.length === 0 ? (
        <p className="text-gray-600 text-center">Tidak ada data historis untuk ditampilkan.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              interval="preserveStartEnd"
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />

            <Line type="monotone" dataKey="moisture" stroke="#8884d8" strokeWidth={2} name="Kelembaban" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="tempt" stroke="#82ca9d" strokeWidth={2} name="Suhu" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
