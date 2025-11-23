"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import PrintReport from "./PrintReport";
import { useReactToPrint } from "react-to-print";

const formatDate = (date) => {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const today = formatDate(new Date());

export default function HistoryChart({ sensor = "sensor1", maxPoints = 200 }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

  const [startDate, setStartDate] = useState(yesterday);
  const [endDate, setEndDate] = useState(today);

  const [recapData, setRecapData] = useState(null);
  const exportRef = useRef();
  useEffect(() => {
    setLoading(true);
    setRecapData(null);

    const start = new Date(`${startDate}T00:00:00.000`);
    const end = new Date(`${endDate}T23:59:59.999`);

    const q = query(
      collection(db, sensor),
      where("timestamp", ">=", start.toISOString()),
      where("timestamp", "<=", end.toISOString()),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            moisture: Number(d.moisture),
            tempt: Number(d.tempt),
            timestamp: d.timestamp,
          };
        });

        setHistory(docs.slice(-maxPoints));
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setHistory([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [sensor, startDate, endDate, maxPoints]);
  useEffect(() => {
    if (history.length === 0) {
      setRecapData(null);
      return;
    }

    const count = history.length;
    const avgMoisture = (
      history.reduce((s, x) => s + x.moisture, 0) / count
    ).toFixed(2);
    const avgTempt = (history.reduce((s, x) => s + x.tempt, 0) / count).toFixed(
      2
    );

    setRecapData({
      count,
      avgMoisture,
      avgTempt,
      maxMoisture: Math.max(...history.map((x) => x.moisture)),
      minMoisture: Math.min(...history.map((x) => x.moisture)),
      maxTempt: Math.max(...history.map((x) => x.tempt)),
      minTempt: Math.min(...history.map((x) => x.tempt)),
      range: `${startDate} — ${endDate}`,
    });
  }, [history, startDate, endDate]);

  const handlePrint = useReactToPrint({
    contentRef: exportRef,
    documentTitle: `Rekap-${sensor}-${startDate}—${endDate}`,
  });

  const chartData = useMemo(() => history, [history]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-white p-3 rounded-lg border shadow-md">
        <p className="font-semibold mb-1">{new Date(label).toLocaleString()}</p>
        <p className="text-indigo-600">Kelembaban: {payload[0].value}</p>
        <p className="text-green-600">Suhu: {payload[1].value}</p>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <h3 className="text-xl font-semibold text-gray-800">
          Grafik Historis {sensor.toUpperCase()}
        </h3>
        <div className="flex gap-2">
          <input
            type="date"
            max={endDate}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-md"
          />

          <span className="font-semibold mt-2">to</span>

          <input
            type="date"
            min={startDate}
            max={today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-md"
          />

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Print / Export PDF
          </button>
        </div>
      </div>

      <div className="p-2">
        <div className="border rounded-lg p-2">
          {loading ? (
            <p className="text-center h-64 flex items-center justify-center text-gray-500 animate-pulse">
              Memuat data...
            </p>
          ) : history.length === 0 ? (
            <p className="text-center h-64 flex items-center justify-center text-gray-500">
              Tidak ada data untuk rentang tanggal {startDate} — {endDate}
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#ddd" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(t) =>
                    new Date(t).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="moisture"
                  stroke="#6366f1"
                  name="Kelembaban"
                />
                <Line
                  type="monotone"
                  dataKey="tempt"
                  stroke="#10b981"
                  name="Suhu"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Tabel Data */}
        {/* Tabel Data */}
        {history.length > 0 && (
          <table className="w-full mt-4 border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Tanggal</th>
                <th className="border p-2">Waktu</th>
                <th className="border p-2">Kelembaban</th>
                <th className="border p-2">Suhu</th>
              </tr>
            </thead>
            <tbody>
              {history.map((d) => {
                const dateObj = new Date(d.timestamp);
                const date = dateObj.toLocaleDateString(); // 23/11/2025
                const time = dateObj.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });

                return (
                  <tr key={d.id}>
                    <td className="border p-2">{date}</td>
                    <td className="border p-2">{time}</td>
                    <td className="border p-2">{d.moisture}</td>
                    <td className="border p-2">{d.tempt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {recapData && !recapData.message && (
          <div className="mt-5 p-4 bg-indigo-50 rounded border">
            <h4 className="text-indigo-700 font-semibold mb-2">
              Rekap Data — {startDate} — {endDate}
            </h4>

            <p>Jumlah data: {recapData.count}</p>
            <p>Rata-rata kelembaban: {recapData.avgMoisture}</p>
            <p>Rata-rata suhu: {recapData.avgTempt}</p>
            <p>
              Min/Max kelembaban: {recapData.minMoisture} /{" "}
              {recapData.maxMoisture}
            </p>
            <p>
              Min/Max suhu: {recapData.minTempt} / {recapData.maxTempt}
            </p>
          </div>
        )}
      </div>

      <div className="hidden print:block">
        <PrintReport
          ref={exportRef}
          chartData={chartData}
          history={history}
          recapData={recapData}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </div>
  );
}
