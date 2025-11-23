"use client";

import { useEffect, useState } from "react";
import { WiHumidity, WiThermometer } from "react-icons/wi";
import { IoClose } from "react-icons/io5";
import HistoryChart from "./HistoryChart";

import { db } from "../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function RealtimeComponent() {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState(null);

  const sensors = ["sensor1", "sensor2", "sensor3", "sensor4"];

  useEffect(() => {
    setLoading(true);
    const unsubscribers = [];

    sensors.forEach((sensor) => {
      const q = query(
        collection(db, sensor),
        orderBy("timestamp", "desc"),
        limit(1)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let latest = null;
        snapshot.forEach((doc) => {
          latest = {
            id: sensor,
            moisture: doc.data().moisture,
            tempt: doc.data().tempt,
            timestamp: doc.data().timestamp,
          };
        });

        setSensorData((prev) => {
          const filtered = prev.filter((s) => s.id !== sensor);
          return latest ? [...filtered, latest] : filtered;
        });
        setLoading(false);
      });

      unsubscribers.push(unsubscribe);
    });

    return () => unsubscribers.forEach((u) => u());
  }, []);

  return (
    <div className="p-6 pt-15 z-10 min-h-screen w-full">
      {loading && (
        <p className="text-center text-gray-500 animate-pulse">
          Memuat data...
        </p>
      )}

      {!loading && sensorData.length === 0 && (
        <p className="text-center text-gray-500">
          Tidak ada data sensor untuk ditampilkan.
        </p>
      )}

      {!loading && sensorData.length > 0 && (
        <>
          {/* --- CARD SENSOR --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {sensorData.map((sensor) => (
              <div
                key={sensor.id}
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
                onClick={() => setSelectedSensor(sensor.id)}
              >
                <h4 className="font-bold text-gray-800 mb-2">
                  {sensor.id.toUpperCase()}
                </h4>

                <div className="flex justify-between text-blue-500">
                  <WiHumidity className="text-xl" />
                  <span>{sensor.moisture || 0}%</span>
                </div>

                <div className="flex justify-between text-red-500 mt-1">
                  <WiThermometer className="text-xl" />
                  <span>{sensor.tempt || 0}°C</span>
                </div>
              </div>
            ))}
          </div>

          {/* --- HISTORY CHART --- */}
          {selectedSensor && (
            <div className="bg-white rounded-lg shadow p-4 relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedSensor(null)}
              >
                <IoClose size={20} />
              </button>
              <h4 className="font-semibold mb-2 text-blue-400">
                {selectedSensor.toUpperCase()} History
              </h4>
              <HistoryChart sensor={selectedSensor} />
            </div>
          )}
        </>
      )}

      <footer className="w-full bottom-0 right-0 left-0 fixed text-center py-4 mt-8">
        <h1 className="text-xl font-bold text-gray-800">
          Sistem Monitoring Reptil
        </h1>
        <p className="text-sm text-gray-500">Kebun Binatang Kinantan</p>
      </footer>
    </div>
  );
}
