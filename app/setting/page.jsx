"use client";

import { useState, useEffect } from 'react';

export default function SettingPage() {
  const [lcdText, setLcdText] = useState('');
  const [ssidName, setSsidName] = useState('');
  const [ssidPass, setSsidPass] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Ambil data dari API saat komponen dimuat
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/setting');
        const { success, data } = await res.json();
        if (success && data) {
          setLcdText(data.LED_TXT || '');
          setSsidName(data.SSID_NAME || '');
          setSsidPass(data.SSID_PASS || '');
        } else {
          setMessage('Failed to fetch settings.');
        }
      } catch (err) {
        setMessage('Failed to fetch settings. Please check your network.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/setting', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ LED_TXT: lcdText, SSID_NAME: ssidName, SSID_PASS: ssidPass }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-3xl font-bold mb-8 font-mono">API Settings</h1>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          <div className="flex flex-col">
            <label htmlFor="lcd_text" className="text-sm text-gray-400 font-mono mb-1">
              lcd_text
            </label>
            <input
              type="text"
              id="lcd_text"
              value={lcdText}
              onChange={(e) => setLcdText(e.target.value)}
              className="bg-gray-800 text-white p-3 rounded-md border-2 border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="ssid_name" className="text-sm text-gray-400 font-mono mb-1">
              ssid_name
            </label>
            <input
              type="text"
              id="ssid_name"
              value={ssidName}
              onChange={(e) => setSsidName(e.target.value)}
              className="bg-gray-800 text-white p-3 rounded-md border-2 border-gray-700 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="ssid_pass" className="text-sm text-gray-400 font-mono mb-1">
              ssid_pass
            </label>
            <input
              type="password"
              id="ssid_pass"
              value={ssidPass}
              onChange={(e) => setSsidPass(e.target.value)}
              className="bg-gray-800 text-white p-3 rounded-md border-2 border-gray-700 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </form>
      )}
      {message && (
        <p className="mt-4 text-center text-sm font-medium text-green-500 font-mono">
          {message}
        </p>
      )}
    </div>
  );
}
