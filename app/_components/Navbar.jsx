// _components/Navbar.js

"use client";

import { MdOutlineMonitor, MdOutlineSettings, MdOutlineInfo } from "react-icons/md";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white p-2 flex justify-center items-center shadow-md z-10">
      <div className="flex space-x-6">
        <a href="/" className="flex flex-col items-center text-blue-500 hover:text-blue-700 transition-colors duration-200">
          <MdOutlineMonitor className="w-6 h-6" />
        </a>
        <a href="/setting" className="flex flex-col items-center text-green-500 hover:text-green-700 transition-colors duration-200">
          <MdOutlineSettings className="w-6 h-6" />
        </a>
        <a href="/about" className="flex flex-col items-center text-red-500 hover:text-red-700 transition-colors duration-200">
          <MdOutlineInfo className="w-6 h-6" />
        </a>
      </div>
    </nav>
  );
}