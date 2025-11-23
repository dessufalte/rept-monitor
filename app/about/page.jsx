"use client";

import { useState } from "react";
import Image from "next/image";

export default function AboutPage() {
  const [activeGuide, setActiveGuide] = useState("about-app");

  const guides = {
    "about-app": {
      title: "Tentang Aplikasi",
      content: (
        <>
          <p className="text-gray-700 mb-6">
            Aplikasi Monitoring Reptil adalah platform berbasis web untuk
            memantau suhu dan kelembaban kandang reptil secara real-time. Sistem
            ini membantu memastikan lingkungan kandang tetap stabil dan aman
            melalui tampilan data IoT, grafik histori, dan rekap statistik.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 mb-10">
            <Image
              src="/images/laboratorium1.png"
              width={96}
              height={96}
              alt="Laboratorium 1"
            />
            <Image
              src="/images/laboratorium2.png"
              width={96}
              height={96}
              alt="Laboratorium 2"
              className="rounded-full"
            />
            <Image
              src="/images/images.jpg"
              width={96}
              height={96}
              alt="Teknik Komputer"
              className="rounded-full"
            />
            <Image
              src="/images/unand.svg"
              width={96}
              height={96}
              alt="Universitas Andalas"
            />
          </div>
        </>
      ),
    },

    features: {
      title: "Fitur Utama",
      content: (
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Monitoring suhu & kelembaban secara real-time</li>
          <li>Dukungan multisensor (Sensor 1 – Sensor 4)</li>
          <li>Penyaringan histori berdasarkan rentang tanggal</li>
          <li>Grafik interaktif perubahan data</li>
          <li>Rekap statistik (Rata-rata, Min, Max, Jumlah)</li>
          <li>Fitur Print untuk mencetak laporan</li>
          <li>Desain Glass UI modern dan responsif</li>
        </ul>
      ),
    },



    usage: {
      title: "Cara Menggunakan",
      content: (
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Buka Dashboard untuk melihat data sensor secara real-time.</li>
          <li>Klik salah satu sensor untuk membuka histori dan grafik.</li>
          <li>Pilih tanggal untuk memfilter histori pembacaan.</li>
          <li>Lihat rekap statistik untuk analisis cepat.</li>
          <li>
            Gunakan tombol <b>Print</b> untuk mencetak laporan.
          </li>
        </ol>
      ),
    },

    
  };

  const currentGuide = guides[activeGuide];

  return (
    <div className="min-h-screen bg-gray-100 flex p-8 pt-15">
      {/* Sidebar Navigasi */}
      <nav className="w-64 bg-white rounded-lg shadow-md p-4 sticky top-8 h-fit">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Panduan</h2>
        <ul className="space-y-2">
          {Object.keys(guides).map((key) => (
            <li key={key}>
              <a
                href="#"
                onClick={() => setActiveGuide(key)}
                className={`block p-2 rounded-md transition-colors duration-200 
                  ${
                    activeGuide === key
                      ? "bg-blue-500 text-white font-semibold"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {guides[key].title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Konten Utama */}
      <main className="flex-1 bg-white ml-8 p-8 rounded-lg shadow-md overflow-y-auto">
        <article className="prose max-w-none">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {currentGuide.title}
          </h1>
          {typeof currentGuide.content === "string" ? (
            <p className="text-gray-700">{currentGuide.content}</p>
          ) : (
            currentGuide.content
          )}
        </article>
      </main>
    </div>
  );
}
