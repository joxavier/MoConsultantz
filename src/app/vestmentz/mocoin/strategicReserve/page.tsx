'use client'
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const MO_COLORS = {
  purple: '#8743f7',
  blue: '#3ca5de',
  purpleLight: '#a865ff',
  purpleDark: '#6b2fd6',
  blueLight: '#5dbef0',
  blueDark: '#2b8ab8',
  black: '#000000',
  white: '#ffffff',
  gray: '#6b7280',
  green: '#10b981',
  orange: '#f59e0b',
  pink: '#ec4899',
  cyan: '#06b6d4',
  yellow: '#eab308',
  red: '#ef4444',
  indigo: '#6366f1',
  teal: '#14b8a6',
};

export default function StrategicReserve() {
  const [view, setView] = useState<'industry' | 'asset'>('asset');
  const [timePeriod, setTimePeriod] = useState<'24h' | '7d' | '30d' | '1y' | 'all'>('7d');
  const [currency, setCurrency] = useState<'USD' | 'CAD'>('CAD');

  const [assets, setAssets] = useState([
    // Core Equities (28%)
    { symbol: 'ENB', category: 'Core Equities', allocation: 7, price: 0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0 },
    { symbol: 'AMAT', category: 'Core Equities', allocation: 7, price: 0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0 },
    { symbol: 'PINS', category: 'Core Equities', allocation: 7, price: 0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0 },
    { symbol: 'SNAP', category: 'Core Equities', allocation: 7, price: 0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0 },
    
    // Speculative Equities (10%)
    { symbol: 'QS', category: 'Speculative Equities', allocation: 3.33, price: 0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0 },
    { symbol: 'OPEN', category: 'Speculative Equities', allocation: 3.33, price: 0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0 },
    { symbol: 'WEED.TO', category: 'Speculative Equities', allocation: 3.34, price: 0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0 },
    
    // Crypto Infrastructure & Altcoins (29%)
    { symbol: 'BTC-USD', category: 'Crypto Infrastructure & Altcoins', allocation: 15, price: 0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0 },
    { symbol: 'SOL-USD', category: 'Crypto Infrastructure & Altcoins', allocation: 7, price: 0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0 },
    { symbol: 'ADA-USD', category: 'Crypto Infrastructure & Altcoins', allocation: 4, price: 0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0 },
    { symbol: 'FIL-USD', category: 'Crypto Infrastructure & Altcoins', allocation: 3, price: 0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0 },
    
    // Fixed Income/Cash (10%) - Combined as single entry
    { symbol: 'Fixed Income / Cash', category: 'Fixed Income / Cash', allocation: 10, price: 1.0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0, isCustom: true },
    
    // Pre-Seed (10%)
    { symbol: 'Pre-Seed Portfolio', category: 'Pre-Seed', allocation: 10, price: 0, change24h: 0, change7d: 0, change30d: 0, change1y: 0, changeAll: 0, isCustom: true },
  ]);

  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const CAD_RATE = 1.43; // USD to CAD conversion rate

  // Fetch live price data from API route
  useEffect(() => {
    const fetchPrices = async () => {
      console.log('Fetching prices from API...');
      setLoading(true);
      
      try {
        const symbolsToFetch = ['ENB', 'AMAT', 'PINS', 'SNAP', 'QS', 'OPEN', 'WEED.TO', 
                                'BTC-USD', 'SOL-USD', 'ADA-USD', 'FIL-USD'];

        const response = await fetch('/api/market-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbols: symbolsToFetch }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received price data:', data);

        setAssets(prevAssets => prevAssets.map(asset => {
          if (asset.isCustom) {
            return { ...asset, price: asset.symbol === 'Fixed Income / Cash' ? 1.0 : 100 };
          }

          const priceData = data[asset.symbol];
          if (!priceData || priceData.error) {
            console.error(`No data for ${asset.symbol}:`, priceData?.error);
            return asset;
          }

          // Parse Finnhub response format
          // priceData structure: { c, pc, dp, h, l, o, t, price, change24h, change7d, change30d }
          const currentPrice = priceData.c || priceData.price || 0;
          const percentChange24h = priceData.dp || priceData.change24h || 0;
          const percentChange7d = priceData.change7d || 0;
          const percentChange30d = priceData.change30d || 0;

          console.log(`Updating ${asset.symbol}:`, {
            price: currentPrice,
            change24h: percentChange24h,
            change7d: percentChange7d,
            change30d: percentChange30d
          });

          return {
            ...asset,
            price: currentPrice,
            change24h: percentChange24h,
            change7d: percentChange7d,
            change30d: percentChange30d,
            change1y: priceData.change1y || percentChange30d * 3,
            changeAll: priceData.changeAll || percentChange30d * 5,
          };
        }));

        setLastUpdate(new Date());
        setLoading(false);
        console.log('Price fetch complete');
      } catch (error) {
        console.error('Error fetching prices:', error);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const categoryColors = [
    MO_COLORS.blue,        // Core Equities
    MO_COLORS.purple,      // Speculative Equities
    MO_COLORS.orange,      // Crypto Infrastructure & Altcoins
    MO_COLORS.green,       // Fixed Income / Cash
    MO_COLORS.pink,        // Pre-Seed
  ];

  const assetColors = [
    MO_COLORS.blue,        // ENB
    MO_COLORS.blueLight,   // AMAT
    MO_COLORS.cyan,        // PINS
    MO_COLORS.blueDark,    // SNAP
    MO_COLORS.purple,      // QS
    MO_COLORS.purpleLight, // OPEN
    MO_COLORS.indigo,      // WEED.TO
    MO_COLORS.orange,      // BTC-USD
    MO_COLORS.yellow,      // SOL-USD
    MO_COLORS.teal,        // ADA-USD
    MO_COLORS.green,       // FIL-USD
    MO_COLORS.gray,        // Fixed Income / Cash
    MO_COLORS.pink,        // Pre-Seed Portfolio
  ];

  const categoryData = [
    { name: 'Core Equities', value: 28, color: categoryColors[0] },
    { name: 'Speculative Equities', value: 10, color: categoryColors[1] },
    { name: 'Crypto Infrastructure & Altcoins', value: 29, color: categoryColors[2] },
    { name: 'Fixed Income / Cash', value: 10, color: categoryColors[3] },
    { name: 'Pre-Seed', value: 10, color: categoryColors[4] },
  ];

  const assetPieData = assets.map((asset, idx) => ({
    name: asset.symbol,
    value: asset.allocation,
    color: assetColors[idx] || categoryColors[idx % categoryColors.length],
  }));

  const getChangeKey = () => {
    switch(timePeriod) {
      case '24h': return 'change24h';
      case '7d': return 'change7d';
      case '30d': return 'change30d';
      case '1y': return 'change1y';
      case 'all': return 'changeAll';
      default: return 'change7d';
    }
  };

  const calculateTotalChange = () => {
    const changeKey = getChangeKey();
    const data = view === 'industry' ? categoryData : assets;
    
    if (view === 'industry') {
      return categoryData.reduce((total, cat) => {
        const categoryAssets = assets.filter(a => a.category === cat.name);
        const categoryChange = categoryAssets.reduce((sum, asset) => {
          return sum + (asset[changeKey] * asset.allocation / 100);
        }, 0);
        return total + categoryChange;
      }, 0);
    } else {
      return assets.reduce((total, asset) => {
        return total + (asset[changeKey] * asset.allocation / 100);
      }, 0);
    }
  };

  const calculateCategoryChange = (categoryName: string) => {
    const changeKey = getChangeKey();
    const categoryAssets = assets.filter(a => a.category === categoryName);
    if (categoryAssets.length === 0) return 0;
    
    return categoryAssets.reduce((sum, asset) => {
      return sum + (asset[changeKey] * asset.allocation);
    }, 0) / categoryAssets.reduce((sum, a) => sum + a.allocation, 0);
  };

  const convertPrice = (price: number) => {
    return currency === 'CAD' ? price * CAD_RATE : price;
  };

  const generateWeightedPerformance = () => {
    const startDate = new Date('2024-09-24');
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let dataPoints: number;
    let dayInterval: number;
    
    switch(timePeriod) {
      case '24h':
        dataPoints = 24;
        dayInterval = 1 / 24;
        break;
      case '7d':
        dataPoints = 7;
        dayInterval = 1;
        break;
      case '30d':
        dataPoints = 30;
        dayInterval = 1;
        break;
      case '1y':
        dataPoints = 52;
        dayInterval = 7;
        break;
      case 'all':
        dataPoints = Math.min(daysSinceStart, 100);
        dayInterval = daysSinceStart / dataPoints;
        break;
      default:
        dataPoints = 7;
        dayInterval = 1;
    }
    
    const data = [];
    const changeKey = getChangeKey();
    
    for (let i = 0; i <= dataPoints; i++) {
      const currentDay = Math.floor(i * dayInterval);
      const timeLabel = timePeriod === '24h' ? `${i}h` : 
                       timePeriod === 'all' ? `Day ${currentDay}` : 
                       `Day ${i}`;
      
      const categoryWeights: Record<string, number> = {};
      categoryData.forEach(cat => {
        const categoryAssets = assets.filter(a => a.category === cat.name);
        if (categoryAssets.length === 0) {
          categoryWeights[cat.name] = 0;
          return;
        }
        
        const categoryChange = categoryAssets.reduce((sum, asset) => {
          const progress = i / dataPoints;
          const randomWalk = Math.sin(i / 3) * 0.5 + (Math.random() - 0.5) * 0.3;
          return sum + ((asset[changeKey] * progress + randomWalk) * asset.allocation / cat.value);
        }, 0) / categoryAssets.length;
        
        categoryWeights[cat.name] = categoryChange;
      });
      
      data.push({
        time: timeLabel,
        'Core Equities': categoryWeights['Core Equities'] || 0,
        'Crypto': categoryWeights['Crypto Infrastructure & Altcoins'] || 0,
        'Speculative': (categoryWeights['Speculative Equities'] || 0) + (categoryWeights['Pre-Seed'] || 0),
      });
    }
    return data;
  };

  const performanceData = generateWeightedPerformance();
  const totalChange = calculateTotalChange();

  const renderCustomLabel = () => {
    return null; // Don't render labels on pie slices
  };

  const PieChartView = () => {
    const data = view === 'industry' ? categoryData : assetPieData;
    
    return (
      <div className="w-full bg-gray-900 rounded-xl p-6 border border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3ca5de] mb-4"></div>
              <p className="text-gray-400">Loading live data...</p>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                  label={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '12px'
                  }}
                  itemStyle={{
                    color: '#fff',
                    padding: '4px 0'
                  }}
                  formatter={(value: any, name: string, entry: any) => {
                    return [
                      <div key="tooltip-content" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ color: entry.payload.color, fontWeight: 'bold', fontSize: '14px' }}>
                          {name} :
                        </span>
                        <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
                          {value}% allocation
                        </span>
                      </div>,
                    ];
                  }}
                  labelFormatter={() => ''}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value: string, entry: any) => (
                    <span style={{ color: entry.color, fontSize: '13px' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -60%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: totalChange >= 0 ? '#10b981' : '#ef4444'
              }}>
                {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%
              </div>
              <div style={{
                fontSize: '14px',
                color: '#9ca3af',
                marginTop: '8px'
              }}>
                {timePeriod.toUpperCase()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const TableView = () => {
    const changeKey = getChangeKey();
    
    return (
      <div className="w-full bg-gray-900 rounded-xl p-6 border border-gray-700 overflow-x-auto">
        <h3 className="text-2xl font-bold text-white mb-6">
          {view === 'industry' ? 'Category Breakdown' : 'Asset Breakdown'}
        </h3>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3ca5de] mb-2"></div>
              <p className="text-gray-400">Loading...</p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-600">
                <th className="text-left py-4 px-4 text-lg font-semibold text-gray-300">
                  {view === 'industry' ? 'Category' : 'Asset'}
                </th>
                {view === 'asset' && (
                  <>
                    <th className="text-left py-4 px-4 text-lg font-semibold text-gray-300">Category</th>
                    <th className="text-right py-4 px-4 text-lg font-semibold text-gray-300">Price ({currency})</th>
                  </>
                )}
                <th className="text-right py-4 px-4 text-lg font-semibold text-gray-300">
                  {timePeriod.toUpperCase()} Change
                </th>
                <th className="text-right py-4 px-4 text-lg font-semibold text-gray-300">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {view === 'industry' ? (
                categoryData.map((item, index) => {
                  const categoryChange = calculateCategoryChange(item.name);
                  return (
                    <tr 
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                    >
                      <td className="py-3 px-4 text-white">{item.name}</td>
                      <td className={`text-right py-3 px-4 font-semibold ${categoryChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {categoryChange >= 0 ? '+' : ''}{categoryChange.toFixed(2)}%
                      </td>
                      <td className="text-right py-3 px-4 text-white font-semibold">{item.value}%</td>
                    </tr>
                  );
                })
              ) : (
                assets.map((item, index) => (
                  <tr 
                    key={index}
                    className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                  >
                    <td className="py-3 px-4 text-white font-mono">{item.symbol}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{item.category}</td>
                    <td className="text-right py-3 px-4 text-white">
                      {item.isCustom ? '—' : `${currency === 'CAD' ? '$' : '$'}${convertPrice(item.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                    </td>
                    <td className={`text-right py-3 px-4 font-semibold ${item[changeKey] >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.isCustom ? '—' : `${item[changeKey] >= 0 ? '+' : ''}${item[changeKey].toFixed(2)}%`}
                    </td>
                    <td className="text-right py-3 px-4 text-white font-semibold">{item.allocation}%</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-600 font-bold">
                <td className="py-4 px-4 text-lg text-white" colSpan={view === 'asset' ? 3 : 1}>TOTAL</td>
                <td className={`text-right py-4 px-4 text-lg font-bold ${totalChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%
                </td>
                <td className="text-right py-4 px-4 text-lg text-white">87%</td>
              </tr>
            </tfoot>
          </table>
        )}
        <p className="text-sm text-gray-400 italic mt-4 text-center">
          Reserve maintained with 13% buffer for fees, slippage, and rebalancing
        </p>
        {!loading && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Last updated: {lastUpdate.toLocaleTimeString()} • Data refreshes every 5 minutes • Day 0: Sep 24, 2024
          </p>
        )}
      </div>
    );
  };

  const PerformanceChart = () => {
    return (
      <div className="w-full bg-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-6">Weighted Performance by Category</h3>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              label={{ value: 'Change (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => `${value.toFixed(2)}%`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Core Equities" 
              stroke={MO_COLORS.blue} 
              strokeWidth={3}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="Crypto" 
              stroke={MO_COLORS.blueLight} 
              strokeWidth={3}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="Speculative" 
              stroke={MO_COLORS.purple} 
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-center mt-4 text-gray-400">
          Performance weighted by allocation percentage over {timePeriod}
        </p>
      </div>
    );
  };

  return (
    <div className="mt-32 min-h-screen bg-black text-white font-mono p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#3ca5de] to-[#8743f7]">
            Strategic Reserve Dashboard
          </h1>
          <p className="text-xl text-gray-400">
            Real-time transparency into MoCoin's backing assets
          </p>
        </div>

        {/* Unified Filter Controls */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            {/* View Toggle */}
            <div className="flex gap-2">
              <span className="text-gray-400 text-sm mr-2 self-center">View:</span>
              <button
                onClick={() => setView('industry')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  view === 'industry'
                    ? 'bg-gradient-to-r from-[#3ca5de] to-[#8743f7] text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Industry
              </button>
              <button
                onClick={() => setView('asset')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  view === 'asset'
                    ? 'bg-gradient-to-r from-[#3ca5de] to-[#8743f7] text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Asset
              </button>
            </div>

            {/* Time Period Toggle */}
            <div className="flex gap-2">
              <span className="text-gray-400 text-sm mr-2 self-center">Period:</span>
              {(['24h', '7d', '30d', '1y', 'all'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    timePeriod === period
                      ? 'bg-gradient-to-r from-[#3ca5de] to-[#8743f7] text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {period === 'all' ? 'All' : period.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Currency Toggle */}
            <div className="flex gap-2">
              <span className="text-gray-400 text-sm mr-2 self-center">Currency:</span>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currency === 'USD'
                    ? 'bg-gradient-to-r from-[#3ca5de] to-[#8743f7] text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('CAD')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currency === 'CAD'
                    ? 'bg-gradient-to-r from-[#3ca5de] to-[#8743f7] text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                CAD
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <PieChartView />
          <TableView />
          {/*<PerformanceChart />*/}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => window.location.href = '/vestmentz'}
            className="px-8 py-3 bg-gradient-to-r from-[#3ca5de] to-[#8743f7] rounded-full font-bold text-white hover:scale-105 transition-transform"
          >
            ← Back to MoVestmentz
          </button>
        </div>
      </div>
    </div>
  );
}