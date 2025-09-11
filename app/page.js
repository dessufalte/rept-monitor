"use client";

import Navbar from "./_components/Navbar";
import RealtimeComponent from "./_components/RealtimeSensor";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="bg-gray-100 max-w-7xl mx-auto ">
        <div className="">
          <RealtimeComponent />
        </div> 
      </div>
    </div>
  );
}
