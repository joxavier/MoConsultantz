import React, { useState } from 'react';
import { Shield, Activity, Wifi, Server, Router, Laptop, AlertTriangle, CheckCircle, Lock, FileText, Search, RefreshCw } from 'lucide-react';

interface ScanResult {
  critical: number;
  high: number;
  medium: number;
  low: number;
  passed: number;
}

interface ScanResults {
  public: ScanResult;
  penetration: ScanResult;
  smoke: ScanResult;
  vulnerability: ScanResult;
}

export default function SecurityDashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);

  const devices = [
    { id: "Router", ip: "192.168.1.1", type: "Router", traffic: "120Mbps", icon: Router, x: 50, y: 50 },
    { id: "Server1", ip: "192.168.1.2", type: "Server", traffic: "85Mbps", icon: Server, x: 50, y: 150 },
    { id: "Laptop1", ip: "192.168.1.10", type: "Client", traffic: "15Mbps", icon: Laptop, x: 20, y: 250 },
    { id: "Laptop2", ip: "192.168.1.11", type: "Client", traffic: "20Mbps", icon: Laptop, x: 80, y: 250 },
  ];

  const logs = [
    { time: "14:32:15", type: "info", message: "Connection established: 192.168.1.10", severity: "low" },
    { time: "14:31:48", type: "warning", message: "Unusual traffic pattern detected on port 8080", severity: "medium" },
    { time: "14:30:22", type: "success", message: "Firewall rules updated successfully", severity: "low" },
    { time: "14:28:05", type: "info", message: "Server1 backup completed", severity: "low" },
    { time: "14:25:31", type: "warning", message: "Failed login attempt from 192.168.1.45", severity: "medium" },
  ];

  const firewallRules = [
    { id: 1, name: "Block Malicious IPs", status: "active", blocked: 143 },
    { id: 2, name: "Allow HTTPS Traffic", status: "active", allowed: 5420 },
    { id: 3, name: "Block Unauthorized Ports", status: "active", blocked: 67 },
    { id: 4, name: "Rate Limiting", status: "active", limited: 234 },
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanResults({
        public: { critical: 0, high: 1, medium: 3, low: 5, passed: 12 },
        penetration: { critical: 0, high: 0, medium: 2, low: 4, passed: 15 },
        smoke: { critical: 0, high: 0, medium: 0, low: 1, passed: 24 },
        vulnerability: { critical: 1, high: 2, medium: 5, low: 8, passed: 45 }
      });
      setIsScanning(false);
    }, 2000);
  };

  const stats = [
    { label: "Active Devices", value: "4", icon: Wifi, color: "from-purple-500 to-blue-500" },
    { label: "Total Traffic", value: "240Mbps", icon: Activity, color: "from-blue-500 to-cyan-500" },
    { label: "Security Score", value: "94/100", icon: Shield, color: "from-green-500 to-emerald-500" },
    { label: "Threats Blocked", value: "210", icon: Lock, color: "from-red-500 to-orange-500" },
  ];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Network Security Dashboard
          </h2>
        </div>
        <p className="text-slate-300 ml-13">Real-time monitoring and threat detection powered by Mo</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="relative group overflow-hidden rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-purple-500/50 transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-slate-300">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Network Topology */}
        <div className="rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 sm:p-6 shadow-2xl">
          <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 truncate">Network Topology</h3>
              <p className="text-xs sm:text-sm text-slate-300">Active device visualization</p>
            </div>
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-400">Online</span>
            </div>
          </div>
          
          <div className="rounded-xl bg-slate-950/50 border border-slate-700 p-4 sm:p-8 h-72 sm:h-96 relative overflow-hidden">{/* Connection Lines */}
            <svg width="100%" height="100%" className="absolute inset-0">
              <line x1="50%" y1="20%" x2="50%" y2="45%" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              <line x1="50%" y1="20%" x2="25%" y2="70%" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              <line x1="50%" y1="20%" x2="75%" y2="70%" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
            </svg>
            
            {/* Devices */}
            <div className="absolute left-1/2 top-[15%] -translate-x-1/2">
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Router className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-semibold text-white">Router</div>
                  <div className="text-xs text-slate-300">192.168.1.1</div>
                  <div className="text-xs text-green-400">120Mbps</div>
                </div>
              </div>
            </div>

            <div className="absolute left-1/2 top-[45%] -translate-x-1/2">
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <Server className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-semibold text-white">Server1</div>
                  <div className="text-xs text-slate-300">192.168.1.2</div>
                  <div className="text-xs text-green-400">85Mbps</div>
                </div>
              </div>
            </div>

            <div className="absolute left-[20%] top-[70%] -translate-x-1/2">
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <Laptop className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-white">Laptop1</div>
                  <div className="text-xs text-slate-300 hidden sm:block">192.168.1.10</div>
                  <div className="text-xs text-green-400">15Mbps</div>
                </div>
              </div>
            </div>

            <div className="absolute left-[80%] top-[70%] -translate-x-1/2">
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <Laptop className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-white">Laptop2</div>
                  <div className="text-xs text-slate-300 hidden sm:block">192.168.1.11</div>
                  <div className="text-xs text-green-400">20Mbps</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Firewall Rules */}
        <div className="rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Firewall Rules</h3>
              <p className="text-xs sm:text-sm text-slate-300">Active protection rules</p>
            </div>
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
          </div>
          
          <div className="space-y-2 sm:space-y-3">{firewallRules.map((rule) => (
              <div key={rule.id} className="rounded-lg bg-slate-950/50 border border-slate-700 p-3 sm:p-4 hover:border-purple-500/50 transition-all">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-white truncate">{rule.name}</span>
                  <span className="px-2 py-1 text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/30 rounded flex-shrink-0">
                    {rule.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {rule.blocked && `${rule.blocked} blocked`}
                  {rule.allowed && `${rule.allowed} allowed`}
                  {rule.limited && `${rule.limited} limited`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Logs */}
        <div className="rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">System Logs</h3>
              <p className="text-xs sm:text-sm text-slate-300">Recent activity</p>
            </div>
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
          </div>
          
          <div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto">{logs.map((log, idx) => (
              <div key={idx} className="rounded-lg bg-slate-950/50 border border-slate-700 p-2 sm:p-3 hover:border-purple-500/50 transition-all">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xs font-mono text-slate-500 mt-0.5 flex-shrink-0">{log.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-200 break-words">{log.message}</p>
                  </div>
                  <span className={`px-1.5 sm:px-2 py-0.5 text-xs font-medium rounded flex-shrink-0 ${getSeverityColor(log.severity)}`}>
                    {log.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vulnerability Scanner */}
        <div className="rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Vulnerability Scanner</h3>
              <p className="text-xs sm:text-sm text-slate-300">Security assessment results</p>
            </div>
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Scan Now
                </>
              )}
            </button>
          </div>

          {scanResults ? (
            <div className="space-y-3 sm:space-y-4">{Object.entries(scanResults).map(([type, results]) => (
                <div key={type} className="rounded-lg bg-slate-950/50 border border-slate-700 p-3 sm:p-4">
                  <div className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3 capitalize">
                    {type === 'public' ? 'Public Reports' : 
                     type === 'penetration' ? 'Penetration Test' :
                     type === 'smoke' ? 'Smoke Test' :
                     'Vulnerability Report'}
                  </div>
                  <div className="grid grid-cols-5 gap-1 sm:gap-2">
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-red-400">{results.critical}</div>
                      <div className="text-xs text-slate-400">Critical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-orange-400">{results.high}</div>
                      <div className="text-xs text-slate-400">High</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-yellow-400">{results.medium}</div>
                      <div className="text-xs text-slate-400">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-blue-400">{results.low}</div>
                      <div className="text-xs text-slate-400">Low</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-green-400">{results.passed}</div>
                      <div className="text-xs text-slate-400">Passed</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-slate-950/50 border border-slate-700 p-6 sm:p-8 text-center">
              <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No scan results available</p>
              <p className="text-slate-500 text-xs mt-1">Click "Scan Now" to run a security assessment</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Badge */}
      <div className="mt-6 sm:mt-8 flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" />
          <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Secured by Mo
          </span>
        </div>
      </div>
    </div>
  );
}