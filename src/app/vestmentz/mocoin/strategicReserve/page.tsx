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

type BaseCurrency = 'USD' | 'CAD';
type TimePeriod = '1h' | '4h' | '1d' | '7d' | '1m';
type ChangeKey = 'change1h' | 'change4h' | 'change1d' | 'change7d' | 'change1m';

type Asset = {
  symbol: string;
  category: string;
  targetAllocation: number;
  currentAllocation: number;
  price: number;
  value?: number;
  holdingQuantity?: number;
  holdingCurrency?: BaseCurrency;
  verifiedHolding?: string;
  isCustom?: boolean;
  isCash?: boolean;
  hasPriceError?: boolean;
  change1h: number;
  change4h: number;
  change1d: number;
  change7d: number;
  change1m: number;
};

export default function StrategicReserve() {
  const [view, setView] = useState<'industry' | 'asset'>('asset');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7d');
  const [currency, setCurrency] = useState<BaseCurrency>('CAD');

  const [assets, setAssets] = useState<Asset[]>([
    // Core Equities (28%)
    { symbol: 'ENB', category: 'Core Equities', targetAllocation: 7, currentAllocation: 0, price: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 },
    { symbol: 'AMAT', category: 'Core Equities', targetAllocation: 7, currentAllocation: 0, price: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 },
    { symbol: 'PINS', category: 'Core Equities', targetAllocation: 7, currentAllocation: 0, price: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 },
    { symbol: 'SNAP', category: 'Core Equities', targetAllocation: 7, currentAllocation: 0, price: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 },
    
    // Speculative Equities (10%)
    { symbol: 'QS', category: 'Speculative Equities', targetAllocation: 3.33, currentAllocation: 0, price: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 },
    { symbol: 'OPEN', category: 'Speculative Equities', targetAllocation: 3.33, currentAllocation: 0, price: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 },
    { symbol: 'WEED.TO', category: 'Speculative Equities', targetAllocation: 3.34, currentAllocation: 0, holdingQuantity: 142, verifiedHolding: '142 shares', price: 0, value: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 },
    
    // Crypto Infrastructure & Altcoins (29%)
    { symbol: 'BTC', category: 'Crypto Infrastructure & Altcoins', targetAllocation: 15, currentAllocation: 0, price: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 },
    { symbol: 'SOL', category: 'Crypto Infrastructure & Altcoins', targetAllocation: 7, currentAllocation: 0, holdingQuantity: 1.32472, verifiedHolding: '1.32472 SOL eq.', price: 0, value: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 },
    { symbol: 'ADA', category: 'Crypto Infrastructure & Altcoins', targetAllocation: 4, currentAllocation: 0, holdingQuantity: 522, verifiedHolding: '522 ADA', price: 0, value: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 },
    { symbol: 'FIL', category: 'Crypto Infrastructure & Altcoins', targetAllocation: 3, currentAllocation: 0, price: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 },
    
    // Fixed Income/Cash (10%)
    { symbol: 'USD Cash', category: 'Fixed Income / Cash', targetAllocation: 5, currentAllocation: 0, holdingQuantity: 2000, holdingCurrency: 'USD', verifiedHolding: '2,000 USD', price: 1.0, value: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0, isCustom: true, isCash: true },
    { symbol: 'CAD Cash', category: 'Fixed Income / Cash', targetAllocation: 5, currentAllocation: 0, holdingQuantity: 1000, holdingCurrency: 'CAD', verifiedHolding: '1,000 CAD', price: 1.0, value: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0, isCustom: true, isCash: true },
    
    // Pre-Seed (10%)
    { symbol: 'Pre-Seed Portfolio', category: 'Pre-Seed', targetAllocation: 10, currentAllocation: 0, price: 0, change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0, isCustom: true },
  ]);

  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch live price data from API route
  useEffect(() => {
    const fetchPrices = async () => {
      console.log('Fetching prices from API...');
      setLoading(true);
      
      try {
        const symbolsToFetch = ['ENB', 'AMAT', 'PINS', 'SNAP', 'QS', 'OPEN', 'WEED.TO', 
                                'BTC', 'SOL', 'ADA', 'FIL'];

        const response = await fetch('/api/market-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbols: symbolsToFetch, baseCurrency: currency }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received price data:', data);

        setAssets(prevAssets => prevAssets.map(asset => {
          if (asset.isCash) {
            const usdCadRate = data.ADA?.usdCadRate || data['WEED.TO']?.usdCadRate || 1.43;
            const price = asset.holdingCurrency === currency
              ? 1
              : asset.holdingCurrency === 'USD'
                ? usdCadRate
                : 1 / usdCadRate;

            return {
              ...asset,
              price,
              value: (asset.holdingQuantity || 0) * price,
              change1h: 0,
              change4h: 0,
              change1d: 0,
              change7d: 0,
              change1m: 0,
            };
          }

          if (asset.isCustom) {
            return { ...asset, price: 0, value: 0 };
          }

          const priceData = data[asset.symbol];
          if (!priceData || priceData.error) {
            console.error(`No data for ${asset.symbol}:`, priceData?.error);
            return { ...asset, hasPriceError: true };
          }

          // Parse market-data response: price is already converted to the selected base currency.
          const currentPrice = priceData.c || priceData.price || 0;
          const percentChange1h = priceData.change1h || 0;
          const percentChange4h = priceData.change4h || 0;
          const percentChange1d = priceData.change1d || 0;
          const percentChange7d = priceData.change7d || 0;
          const percentChange1m = priceData.change1m || 0;

          console.log(`Updating ${asset.symbol}:`, {
            price: currentPrice,
            change1h: percentChange1h,
            change4h: percentChange4h,
            change1d: percentChange1d,
            change7d: percentChange7d,
            change1m: percentChange1m
          });

          return {
            ...asset,
            hasPriceError: false,
            price: currentPrice,
            value: (asset.holdingQuantity || 0) * currentPrice,
            change1h: percentChange1h,
            change4h: percentChange4h,
            change1d: percentChange1d,
            change7d: percentChange7d,
            change1m: percentChange1m,
          };
        }).map((asset, _index, updatedAssets) => {
          const totalValue = updatedAssets.reduce((sum, currentAsset) => sum + (currentAsset.value || 0), 0);

          return {
            ...asset,
            currentAllocation: totalValue > 0 ? ((asset.value || 0) / totalValue) * 100 : 0,
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
  }, [currency]);

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

  const categoryNames = [
    'Core Equities',
    'Speculative Equities',
    'Crypto Infrastructure & Altcoins',
    'Fixed Income / Cash',
    'Pre-Seed',
  ];

  const categoryData = categoryNames.map((name, index) => {
    const categoryAssets = assets.filter((asset) => asset.category === name);
    return {
      name,
      value: categoryAssets.reduce((sum, asset) => sum + asset.currentAllocation, 0),
      marketValue: categoryAssets.reduce((sum, asset) => sum + (asset.value || 0), 0),
      targetValue: categoryAssets.reduce((sum, asset) => sum + asset.targetAllocation, 0),
      color: categoryColors[index],
    };
  });

  const assetPieData = assets.map((asset, idx) => ({
    name: asset.symbol,
    value: asset.currentAllocation,
    targetValue: asset.targetAllocation,
    color: assetColors[idx] || categoryColors[idx % categoryColors.length],
  }));

  const getChangeKey = (): ChangeKey => {
    switch(timePeriod) {
      case '1h': return 'change1h';
      case '4h': return 'change4h';
      case '1d': return 'change1d';
      case '7d': return 'change7d';
      case '1m': return 'change1m';
      default: return 'change7d';
    }
  };

  const calculateWeightedChange = (allocationKey: 'currentAllocation' | 'targetAllocation') => {
    const changeKey = getChangeKey();
    const totalWeight = assets.reduce((sum, asset) => sum + asset[allocationKey], 0);

    if (totalWeight === 0) return 0;

    return assets.reduce((total, asset) => {
      return total + (asset[changeKey] * asset[allocationKey]) / totalWeight;
    }, 0);
  };

  const calculateCategoryChange = (categoryName: string, allocationKey: 'currentAllocation' | 'targetAllocation' = 'currentAllocation') => {
    const changeKey = getChangeKey();
    const categoryAssets = assets.filter(a => a.category === categoryName);
    const totalWeight = categoryAssets.reduce((sum, asset) => sum + asset[allocationKey], 0);

    if (totalWeight === 0) return 0;

    return categoryAssets.reduce((sum, asset) => {
      return sum + (asset[changeKey] * asset[allocationKey]) / totalWeight;
    }, 0);
  };

  const generateWeightedPerformance = () => {
    let dataPoints: number;
    let dayInterval: number;
    
    switch(timePeriod) {
      case '1h':
        dataPoints = 12;
        dayInterval = 5 / 60;
        break;
      case '4h':
        dataPoints = 16;
        dayInterval = 0.25;
        break;
      case '1d':
        dataPoints = 24;
        dayInterval = 1;
        break;
      case '7d':
        dataPoints = 7;
        dayInterval = 1;
        break;
      case '1m':
        dataPoints = 30;
        dayInterval = 1;
        break;
      default:
        dataPoints = 7;
        dayInterval = 1;
    }
    
    const data = [];
    const changeKey = getChangeKey();
    
    for (let i = 0; i <= dataPoints; i++) {
      const currentDay = Math.floor(i * dayInterval);
      const timeLabel = timePeriod === '1h' ? `${i * 5}m` :
                       timePeriod === '4h' ? `${Math.round(i * 15)}m` :
                       timePeriod === '1d' ? `${i}h` :
                       `Day ${currentDay}`;
      
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
          return sum + ((asset[changeKey] * progress + randomWalk) * asset.currentAllocation / (cat.value || 1));
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
  const totalChange = calculateWeightedChange('currentAllocation');
  const targetChange = calculateWeightedChange('targetAllocation');
  const reserveAssets = assets.filter((asset) => (asset.holdingQuantity || 0) > 0 || (asset.value || 0) > 0);
  const totalReserveValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
  const currentAllocationTotal = assets.reduce((sum, asset) => sum + asset.currentAllocation, 0);
  const targetAllocationTotal = assets.reduce((sum, asset) => sum + asset.targetAllocation, 0);
  const visibleTargetAllocationTotal = view === 'asset'
    ? reserveAssets.reduce((sum, asset) => sum + asset.targetAllocation, 0)
    : targetAllocationTotal;
  const formatMoney = (value: number) => `${currency === 'CAD' ? 'C$' : '$'}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const rebalanceActions = assets
    .filter((asset) => asset.targetAllocation > 0 || asset.currentAllocation > 0)
    .map((asset) => {
      const delta = asset.targetAllocation - asset.currentAllocation;
      const action = Math.abs(delta) < 0.5 ? 'Hold' : delta > 0 ? 'Add' : 'Reduce';
      const estimatedValue = totalReserveValue * Math.abs(delta) / 100;

      return {
        ...asset,
        action,
        delta,
        estimatedValue,
      };
    })
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const maxRebalanceDelta = Math.max(...rebalanceActions.map((asset) => Math.abs(asset.delta)), 1);

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
                  formatter={(value: any, name: any, entry: any) => {
                    return [
                      <div key="tooltip-content" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ color: entry.payload.color, fontWeight: 'bold', fontSize: '14px' }}>
                          {name} :
                        </span>
                        <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
                          Current: {Number(value).toFixed(2)}% allocation
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
                Current weighted
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginTop: '4px'
              }}>
                Target: {targetChange >= 0 ? '+' : ''}{targetChange.toFixed(2)}%
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
          <>
            <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {reserveAssets.map((asset) => (
                <div key={asset.symbol} className="rounded-lg border border-gray-700 bg-gray-800 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">{asset.symbol}</div>
                  <div className="mt-1 text-lg font-bold text-white">{asset.verifiedHolding}</div>
                  <div className="mt-2 text-sm text-gray-300">{formatMoney(asset.value || 0)}</div>
                </div>
              ))}
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-600">
                  <th className="text-left py-4 px-4 text-lg font-semibold text-gray-300">
                    {view === 'industry' ? 'Category' : 'Asset'}
                  </th>
                  {view === 'asset' && (
                    <>
                      <th className="text-left py-4 px-4 text-lg font-semibold text-gray-300">Category</th>
                      <th className="text-right py-4 px-4 text-lg font-semibold text-gray-300">Holding</th>
                      <th className="text-right py-4 px-4 text-lg font-semibold text-gray-300">Price ({currency})</th>
                    </>
                  )}
                  <th className="text-right py-4 px-4 text-lg font-semibold text-gray-300">Value ({currency})</th>
                  <th className="text-right py-4 px-4 text-lg font-semibold text-gray-300">
                    {timePeriod.toUpperCase()} Change
                  </th>
                  <th className="text-right py-4 px-4 text-lg font-semibold text-gray-300">Current</th>
                  <th className="text-right py-4 px-4 text-lg font-semibold text-gray-300">Target</th>
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
                        <td className="text-right py-3 px-4 text-white font-semibold">{formatMoney(item.marketValue)}</td>
                        <td className={`text-right py-3 px-4 font-semibold ${categoryChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {categoryChange >= 0 ? '+' : ''}{categoryChange.toFixed(2)}%
                        </td>
                        <td className="text-right py-3 px-4 text-white font-semibold">{item.value.toFixed(2)}%</td>
                        <td className="text-right py-3 px-4 text-white font-semibold">{item.targetValue.toFixed(2)}%</td>
                      </tr>
                    );
                  })
                ) : (
                  reserveAssets.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                    >
                      <td className="py-3 px-4 text-white font-mono">{item.symbol}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{item.category}</td>
                      <td className="text-right py-3 px-4 text-gray-300">{item.verifiedHolding || ''}</td>
                      <td className="text-right py-3 px-4 text-white">
                        {item.hasPriceError || (item.isCustom && !item.isCash) ? '—' : formatMoney(item.price)}
                      </td>
                      <td className="text-right py-3 px-4 text-white font-semibold">{formatMoney(item.value || 0)}</td>
                      <td className={`text-right py-3 px-4 font-semibold ${item[changeKey] >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.hasPriceError || (item.isCustom && !item.isCash) ? '—' : `${item[changeKey] >= 0 ? '+' : ''}${item[changeKey].toFixed(2)}%`}
                      </td>
                      <td className="text-right py-3 px-4 text-white font-semibold">{item.currentAllocation.toFixed(2)}%</td>
                      <td className="text-right py-3 px-4 text-white font-semibold">{item.targetAllocation.toFixed(2)}%</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-600 font-bold">
                  <td className="py-4 px-4 text-lg text-white" colSpan={view === 'asset' ? 4 : 1}>TOTAL</td>
                  <td className="text-right py-4 px-4 text-lg text-white">{formatMoney(totalReserveValue)}</td>
                  <td className={`text-right py-4 px-4 text-lg font-bold ${totalChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%
                  </td>
                  <td className="text-right py-4 px-4 text-lg text-white">{currentAllocationTotal.toFixed(2)}%</td>
                  <td className="text-right py-4 px-4 text-lg text-white">{visibleTargetAllocationTotal.toFixed(2)}%</td>
                </tr>
              </tfoot>
            </table>
          </>
        )}
        <p className="text-sm text-gray-400 italic mt-4 text-center">
          Current allocation is calculated from 2,000 USD, 1,000 CAD, 522 ADA, 142 WEED shares, and 1.32472 SOL equivalent (0.321 SOL + 1.00372 mSOL)
        </p>
        {!loading && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Last updated: {lastUpdate.toLocaleTimeString()} | Data refreshes every 5 minutes | Prices shown in {currency}
          </p>
        )}
      </div>
    );
  };

  const RebalanceActionsView = () => {
    return (
      <div className="w-full bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Rebalance Actions</h3>
            <p className="text-sm text-gray-400 mt-2">
              Current weight compared with recommended target weight
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-gray-500">Reserve Value</div>
            <div className="text-xl font-bold text-white">{formatMoney(totalReserveValue)}</div>
          </div>
        </div>

        <div className="space-y-4">
          {rebalanceActions.map((asset) => {
            const isAdd = asset.delta > 0.5;
            const isReduce = asset.delta < -0.5;
            const barWidth = `${Math.min(100, (Math.abs(asset.delta) / maxRebalanceDelta) * 100)}%`;
            const actionColor = isAdd ? 'text-green-400' : isReduce ? 'text-red-400' : 'text-gray-300';
            const barColor = isAdd ? 'bg-green-500' : isReduce ? 'bg-red-500' : 'bg-gray-500';

            return (
              <div key={asset.symbol} className="grid gap-3 lg:grid-cols-[160px_1fr_190px] lg:items-center">
                <div>
                  <div className="text-white font-mono font-semibold">{asset.symbol}</div>
                  <div className="text-xs text-gray-500">{asset.category}</div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs text-gray-400">
                    <span>Current {asset.currentAllocation.toFixed(2)}%</span>
                    <span>Target {asset.targetAllocation.toFixed(2)}%</span>
                  </div>
                  <div className="relative h-5 overflow-hidden rounded bg-gray-800">
                    <div className="absolute left-1/2 top-0 h-full w-px bg-gray-600" />
                    <div
                      className={`absolute top-1/2 h-2 -translate-y-1/2 rounded ${barColor}`}
                      style={{
                        width: barWidth,
                        left: isAdd ? '50%' : undefined,
                        right: isReduce ? '50%' : undefined,
                      }}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-bold ${actionColor}`}>
                    {asset.action} {Math.abs(asset.delta).toFixed(2)} pts
                  </div>
                  <div className="text-xs text-gray-400">
                    {asset.action === 'Hold' ? 'Within tolerance' : `Approx. ${formatMoney(asset.estimatedValue)}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
              formatter={(value: any) => `${value.toFixed(2)}%`}
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
              {(['1h', '4h', '1d', '7d', '1m'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    timePeriod === period
                      ? 'bg-gradient-to-r from-[#3ca5de] to-[#8743f7] text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {period.toUpperCase()}
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
          <RebalanceActionsView />
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
