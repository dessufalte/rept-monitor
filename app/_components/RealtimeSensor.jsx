"use client";

import { useEffect, useState } from "react";
import { WiHumidity, WiThermometer } from "react-icons/wi";
import { IoClose } from "react-icons/io5";
import HistoryChart from "./HistoryChart";

import { db } from "../lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

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
                className="
    cursor-pointer
    rounded-2xl
    p-4
    bg-white/15
    backdrop-blur-md
    border border-white/20
    shadow-[0_0_15px_rgb(255,255,255,0.15)]
    transition
    hover:shadow-[0_0_25px_rgb(255,255,255,0.35)]
    hover:bg-white/20
    hover:-translate-y-1
  "
                onClick={() => setSelectedSensor(sensor.id)}
              >
                <h4 className="font-bold text-white drop-shadow mb-2 tracking-wide">
                  {sensor.id.toUpperCase()}
                </h4>

                <div className="flex justify-between items-center text-blue-300">
                  <WiHumidity className="text-2xl drop-shadow" />
                  <span className="font-semibold">{sensor.moisture || 0}%</span>
                </div>

                <div className="flex justify-between items-center text-red-300 mt-1">
                  <WiThermometer className="text-2xl drop-shadow" />
                  <span className="font-semibold">{sensor.tempt || 0}°C</span>
                </div>
              </div>
            ))}
          </div>

          {/* --- HISTORY CHART --- */}
          {selectedSensor && (
            <div className="">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedSensor(null)}
              >
                <IoClose size={20} />
              </button>

              <HistoryChart sensor={selectedSensor} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
