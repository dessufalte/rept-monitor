"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function AboutPage() {
  const [activeGuide, setActiveGuide] = useState('about-app');

  const guides = {
    'about-app': {
      title: "Tentang Aplikasi",
      content: (
        <>
          <p className="text-gray-700 mb-6">
            Aplikasi ini menyediakan antarmuka sederhana dan intuitif untuk memantau dan mengelola data real-time dari perangkat yang terhubung.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="w-24 h-24 flex items-center justify-center">
              <Image 
                src="/images/laboratorium1.png"
                alt="Logo Laboratorium 1"
                width={96}
                height={96}
                className="w-full h-auto "
              />
            </div>
            <div className="w-24 h-24 flex items-center justify-center">
              <Image 
                src="/images/laboratorium2.png"
                alt="Logo Laboratorium 2"
                width={96}
                height={96}
                className="w-full h-auto rounded-full"
              />
            </div>
            <div className="w-24 h-24 flex items-center justify-center">
              <Image 
                src="/images/tekom.png"
                alt="Logo Teknik Komputer"
                width={96}
                height={96}
                className="w-full h-auto rounded-full"
              />
            </div>
            <div className="w-24 h-24 flex items-center justify-center">
              <Image 
                src="/images/unand.svg"
                alt="Logo Universitas Andalas"
                width={96}
                height={96}
                className="w-full h-auto"
              />
            </div>
          </div>
        </>
      )
    },
    'getting-started': {
      title: "Mulai Menggunakan Aplikasi",
      content: "Panduan ini akan memandu Anda melalui langkah-langkah awal untuk menginstal dan menggunakan aplikasi. Mulai dari pendaftaran, login, hingga mengakses dasbor real-time untuk pertama kalinya."
    }
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
                  ${activeGuide === key ? 'bg-blue-500 text-white font-semibold' : 'text-gray-600 hover:bg-gray-200'}`}
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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{currentGuide.title}</h1>
          {typeof currentGuide.content === 'string' ? (
            <p className="text-gray-700">{currentGuide.content}</p>
          ) : (
            currentGuide.content
          )}
       
        </article>
      </main>
    </div>
  );
}
