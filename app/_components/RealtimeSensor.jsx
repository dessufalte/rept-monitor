"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdbClient } from "@/app/lib/firebaseclient";
import { WiHumidity, WiThermometer } from "react-icons/wi";
import { IoClose } from "react-icons/io5";
import HistoryChart from "./HistoryChart";

export default function RealtimeComponent() {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState(null);

  useEffect(() => {
    const dbRef = ref(rtdbClient, "/");
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const rawData = snapshot.val();
        if (rawData) {
          const dataArray = Object.keys(rawData).map((key) => ({
            id: key.toLowerCase(), // sensor1, sensor2, dll
            ...rawData[key],
          }));
          setSensorData(dataArray);
        } else {
          setSensorData([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase Realtime DB Error: ", error);
        setSensorData([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className=" p-6 pt-15 z-10 min-h-screen w-full">
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
          {/* Grid sensor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {sensorData.map((sensor) => (
              <div
                key={sensor.id}
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
                onClick={() =>
                  setSelectedSensor(`sensor${sensor.id.replace("s", "")}`)
                }
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

          {/* HistoryChart */}
          {selectedSensor && (
            <div className="bg-white rounded-lg shadow p-4 relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedSensor(null)}
              >
                <IoClose size={20} />
              </button>
              <h4 className="font-semibold mb-2 text-blue-400">{`${selectedSensor.toUpperCase()} History`}</h4>
              <HistoryChart sensor={selectedSensor} />
            </div>
          )}
        </>
      )}
      <footer className="w-full bottom-0 right-0 left-0 fixed text-center py-4 mt-8">
        <h1 className="text-xl font-bold text-gray-800">Sistem Monitoring Reptil</h1>
        <p className="text-sm text-gray-500">Kebun Binatang Kinantan</p>
      </footer>
    </div>
  );
}
