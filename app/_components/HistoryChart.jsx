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
  ReferenceArea,
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
import { PrinterIcon } from "lucide-react";
import {
  FaDatabase,
  FaTint,
  FaTemperatureLow,
  FaArrowsAltV,
} from "react-icons/fa";

const formatDate = (date) => {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};


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
      <div className="p-6 rounded-2xl
    bg-white/15 backdrop-blur-lg
    border border-white/30
    shadow-[0_0_20px_rgba(255,255,255,0.15)]
    gap-4">
        <p className="font-semibold mb-1">{new Date(label).toLocaleString()}</p>
        <p className="text-blue-600">Kelembaban: {payload[0].value}</p>
        <p className="text-red-600">Suhu: {payload[1].value}</p>
      </div>
    );
  };
  const dateRanges = useMemo(() => {
    if (history.length === 0) return [];

    let ranges = [];
    let start = history[0].timestamp;
    let currentDate = new Date(start).toDateString();

    for (let i = 1; i < history.length; i++) {
      const t = history[i].timestamp;
      const day = new Date(t).toDateString();
      if (day !== currentDate) {
        ranges.push({ start, end: history[i - 1].timestamp });
        start = t;
        currentDate = day;
      }
    }
    ranges.push({ start, end: history[history.length - 1].timestamp });

    return ranges;
  }, [history]);

  return (
    <div className="">
      <div
        className="
    mt-5 p-6 rounded-2xl
    bg-white/15 backdrop-blur-lg
    border border-white/30
    shadow-[0_0_20px_rgba(255,255,255,0.15)]
    flex flex-col md:flex-row justify-between items-center
    gap-4 mb-4
  "
      >
        <h3 className="text-lg font-semibold text-white drop-shadow">
          {sensor.toUpperCase()}
        </h3>

        <div className="flex gap-3 items-center">
          <input
            type="date"
            max={endDate}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="
        px-3 py-2 rounded-lg text-white
        bg-white/20 border border-white/30
        backdrop-blur-md outline-none
        focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40
      "
          />

          <span className="font-semibold text-white drop-shadow">to</span>

          <input
            type="date"
            min={startDate}
            max={today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="
        px-3 py-2 rounded-lg text-white
        bg-white/20 border border-white/30
        backdrop-blur-md outline-none
        focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40
      "
          />

          <button
            onClick={handlePrint}
            className="
        px-4 py-2 rounded-xl
        bg-green-500/70 hover:bg-green-500/90
        text-white font-medium transition
        backdrop-blur-md border border-white/20
        shadow-[0_0_15px_rgba(0,255,120,0.3)]
      "
          >
            <PrinterIcon className="inline-block w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="">
        {recapData && !recapData.message && (
          <div className="mt-5 p-6 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg space-y-2 mb-4">
            <h4 className="text-white font-semibold mb-3 text-lg drop-shadow flex items-center gap-2">
              <FaDatabase className="text-white/80" />
              Rekap Data — {startDate} — {endDate}
            </h4>

            <p className="text-white/90 flex items-center gap-2">
              <FaDatabase /> Jumlah data: {recapData.count}
            </p>

            <p className="text-white/90 flex items-center gap-2">
              <FaTint /> Rata-rata kelembaban: {recapData.avgMoisture}
            </p>

            <p className="text-white/90 flex items-center gap-2">
              <FaTemperatureLow /> Rata-rata suhu: {recapData.avgTempt}
            </p>

            <p className="text-white/90 flex items-center gap-2">
              <FaArrowsAltV /> Min/Max kelembaban: {recapData.minMoisture} /{" "}
              {recapData.maxMoisture}
            </p>

            <p className="text-white/90 flex items-center gap-2">
              <FaArrowsAltV /> Min/Max suhu: {recapData.minTempt} /{" "}
              {recapData.maxTempt}
            </p>
          </div>
        )}
        <div
          className="
    relative mb-4 p-4 rounded-2xl
    bg-white/15 
    backdrop-blur-xl
    border border-white/20
    shadow-[0_0_25px_rgba(255,255,255,0.08)]
  "
        >
          {loading ? (
            <p className="text-center h-64 flex items-center justify-center text-gray-300 animate-pulse">
              Memuat data...
            </p>
          ) : history.length === 0 ? (
            <p className="text-center h-64 flex items-center justify-center text-gray-300">
              Tidak ada data untuk rentang tanggal {startDate} — {endDate}
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#ffffff20" />{" "}
                {/* grid juga dibuat soft */}
                {dateRanges.map((r, idx) => (
                  <ReferenceArea
                    key={idx}
                    x1={r.start}
                    x2={r.end}
                    fill="rgba(255,255,255,0.15)"
                  />
                ))}
                <XAxis
                  dataKey="timestamp"
                  tick={{ fill: "#e5e7eb" }}
                  tickFormatter={(t) =>
                    new Date(t).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                />
                <YAxis tick={{ fill: "#e5e7eb" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="moisture" stroke="#38bdf8" />
                <Line type="monotone" dataKey="tempt" stroke="#f87171" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="">
          {history.length > 0 && (
            <table className="w-full mt-4 text-sm backdrop-blur-md bg-white/30 border border-white/20 rounded-xl overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-white/40 text-gray-800 font-semibold">
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Kelembaban</th>
                  <th className="p-3">Suhu</th>
                </tr>
              </thead>

              <tbody>
                {history.map((d, idx) => {
                  const dateObj = new Date(d.timestamp);
                  const date = dateObj.toLocaleDateString();
                  const time = dateObj.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  return (
                    <tr
                      key={d.id}
                      className={`${
                        idx % 2 === 0 ? "bg-white/10" : "bg-white/20"
                      } hover:bg-white/40 transition duration-200`}
                    >
                      <td className="p-3 border-b border-white/10">{date}</td>
                      <td className="p-3 border-b border-white/10">{time}</td>
                      <td className="p-3 border-b border-white/10 font-medium text-gray-900">
                        {d.moisture}
                      </td>
                      <td className="p-3 border-b border-white/10 font-medium text-gray-900">
                        {d.tempt}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
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
