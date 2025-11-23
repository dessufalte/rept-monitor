"use client";

import Navbar from "./_components/Navbar";
import RealtimeComponent from "./_components/RealtimeSensor";

export default function Dashboard() {
  return (
    <div className="font-sans">
      <link rel="icon" href="/favicon.png" />
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/30" />

      <div className=" max-w-7xl mx-auto ">
        <div className="">
          <RealtimeComponent />
          <footer className="w-full bottom-0 right-0 left-0 flex flex-col text-center py-4 ">
            <h1 className="text-xl font-bold text-white">
              Sistem Monitoring Reptil
            </h1>
            <p className="text-sm text-white">Kebun Binatang Kinantan</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
