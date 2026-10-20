import React, { useState } from 'react';
import { scanNetwork } from './nmap';

const ScanNetworks = () => {
  const [devices, setDevices] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    try {
      const results = await scanNetwork();
      setDevices(results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error scanning network');
    }
  };

  return (
    <div>
      <button onClick={handleScan}>Scan Network</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <h3>Devices Found:</h3>
      <ul>
        {devices.map((device, index) => (
          <li key={index}>{device}</li>
        ))}
      </ul>
    </div>
  );
};

export default ScanNetworks;
