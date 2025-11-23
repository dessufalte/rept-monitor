/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";

const PrintReport = forwardRef(
  ({ chartData, history, recapData, startDate, endDate }, ref) => {
    return (
      <div ref={ref} id="printArea" className="p-4 text-sm text-black bg-white">
        <h2 className="text-xl font-bold text-center mb-1">
          Laporan Monitoring Sensor
        </h2>

        <p className="text-center mb-4" style={{ color: "#4B5563" }}>
          Rentang Tanggal: {startDate} — {endDate}
        </p>

        {/* Rekap Data */}
        {recapData && (
          <div
            className="mb-4 p-3 border rounded"
            style={{ backgroundColor: "#F9FAFB", borderColor: "#000" }}
          >
            <h3 className="font-semibold mb-2" style={{ color: "#4338CA" }}>
              Rekap Data
            </h3>
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

        {/* Grafik */}
        <div
          className="border rounded p-2 mb-4 print:flex print:justify-center"
          style={{ borderColor: "#000" }}
        >
          <LineChart width={700} height={300} data={chartData}>
            <CartesianGrid stroke="#DDDDDD" />
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
            <Line type="monotone" dataKey="moisture" stroke="#6366F1" />
            <Line type="monotone" dataKey="tempt" stroke="#10B981" />
          </LineChart>
        </div>

        {/* Tabel Data */}
        {history?.length > 0 && (
          <table
            className="w-full text-xs"
            style={{
              borderColor: "#000",
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            <thead style={{ backgroundColor: "#E5E7EB" }}>
              <tr>
                <th style={{ border: "1px solid #000", padding: "8px" }}>
                  Tanggal
                </th>
                <th style={{ border: "1px solid #000", padding: "8px" }}>
                  Waktu
                </th>
                <th style={{ border: "1px solid #000", padding: "8px" }}>
                  Kelembaban
                </th>
                <th style={{ border: "1px solid #000", padding: "8px" }}>
                  Suhu
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((d) => {
                const t = new Date(d.timestamp);
                return (
                  <tr key={d.id}>
                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                      {t.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                      {t.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                      {d.moisture}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                      {d.tempt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Kondisi bila tidak ada data */}
        {!history?.length && (
          <p className="text-center text-gray-600 mt-6">
            Tidak ada data dalam rentang tanggal ini.
          </p>
        )}
      </div>
    );
  }
);

export default PrintReport;
