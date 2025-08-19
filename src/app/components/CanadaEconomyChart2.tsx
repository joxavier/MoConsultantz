import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CanadaEconomyChartProps {
  height?: string | number;
}

interface RawDataPoint {
  year: number;
  gdp: number;
  cpi: number;
  btc: number;
  meta: number;
  gold: number;
  oil: number;
}

interface ChartDataPoint {
  year: string;
  gdpChange: number;
  cpiChange: number;
  btcChange: number;
  metaChange: number;
  goldChange: number;
  oilChange: number;
}

interface SelectedAssets {
  btc: boolean;
  meta: boolean;
  gold: boolean;
  oil: boolean;
}

interface AssetConfig {
  name: string;
  color: string;
  enabled: boolean;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
  }>;
  label?: string;
}

const CanadaEconomyChart: React.FC<CanadaEconomyChartProps> = ({ height = 500 }) => {
  const [showDataTable, setShowDataTable] = useState(false);
  const [baseYear, setBaseYear] = useState(2020);
  const [selectedAssets, setSelectedAssets] = useState<SelectedAssets>({
    btc: true,
    meta: false,
    gold: false,
    oil: false
  });

  // Raw data arrays including additional assets
  const rawData = useMemo((): RawDataPoint[] => {
    const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const gdpData = [1990, 2030, 2100, 2150, 2200, 2100, 2250, 2400, 2500, 2600, 2700];
    const cpiData = [100, 102, 104, 107, 110, 112, 117, 122, 126, 129, 132];
    
    // Bitcoin closing prices from CSV data
    const btcPrices: Record<string, number> = {
      "2015": 430.566986084,
      "2016": 963.742980957,
      "2017": 14156.400390625,
      "2018": 3742.70033544,
      "2019": 7193.59897843,
      "2020": 29001.71982218,
      "2021": 46306.4461226996,
      "2022": 16547.4953660162,
      "2023": 42265.185654866,
      "2024": 67489.6117770498,
      "2025": 115758.2039287926
    };

    // META stock prices (estimated based on historical data and FB IPO in 2012)
    const metaPrices: Record<string, number> = {
      "2015": 102.0,  // Post-IPO growth period
      "2016": 115.0,  // Steady growth
      "2017": 176.0,  // Strong user growth
      "2018": 131.0,  // Privacy concerns impact
      "2019": 205.0,  // Recovery
      "2020": 273.0,  // COVID boost
      "2021": 338.0,  // Peak metaverse hype
      "2022": 123.0,  // Reality Labs losses
      "2023": 353.0,  // AI recovery
      "2024": 504.0,  // Based on search results
      "2025": 770.0   // Current approximate price from search
    };

    // Gold prices (USD per troy ounce, estimated historical averages)
    const goldPrices: Record<string, number> = {
      "2015": 1160,
      "2016": 1250,
      "2017": 1270,
      "2018": 1270,
      "2019": 1390,
      "2020": 1770,  // COVID flight to safety
      "2021": 1800,
      "2022": 1940,
      "2023": 1970,
      "2024": 2350,
      "2025": 3400   // Based on search results showing recent highs
    };

    // Oil prices (WTI crude, USD per barrel, estimated historical averages)
    const oilPrices: Record<string, number> = {
      "2015": 48,
      "2016": 43,
      "2017": 51,
      "2018": 65,
      "2019": 57,
      "2020": 39,   // COVID crash
      "2021": 68,   // Recovery
      "2022": 95,   // Ukraine war spike
      "2023": 78,
      "2024": 77,
      "2025": 63    // Based on search results showing recent decline
    };

    return years.map((year, index) => ({
      year,
      gdp: gdpData[index],
      cpi: cpiData[index],
      btc: btcPrices[String(year)],
      meta: metaPrices[String(year)],
      gold: goldPrices[String(year)],
      oil: oilPrices[String(year)]
    }));
  }, []);

  // Calculate percentage changes relative to base year
  const chartData = useMemo((): ChartDataPoint[] => {
    const baseYearData = rawData.find(item => item.year === baseYear);
    
    if (!baseYearData) return [];

    interface CalculateBaseYearChange {
      (current: number, base: number): number;
    }

    const calculateBaseYearChange: CalculateBaseYearChange = (current, base) => {
      return base !== 0 ? ((current - base) / base) * 100 : 0;
    };

    return rawData.map(item => ({
      year: item.year.toString(),
      gdpChange: calculateBaseYearChange(item.gdp, baseYearData.gdp),
      cpiChange: calculateBaseYearChange(item.cpi, baseYearData.cpi),
      btcChange: calculateBaseYearChange(item.btc, baseYearData.btc),
      metaChange: calculateBaseYearChange(item.meta, baseYearData.meta),
      goldChange: calculateBaseYearChange(item.gold, baseYearData.gold),
      oilChange: calculateBaseYearChange(item.oil, baseYearData.oil)
    }));
  }, [rawData, baseYear]);

  const availableYears = rawData.map(item => item.year);

  const assetConfig: Record<string, AssetConfig> = {
    gdp: { name: "GDP", color: "#10b981", enabled: true },
    cpi: { name: "CPI (Inflation)", color: "#f59e0b", enabled: true },
    btc: { name: "Bitcoin", color: "#8b5cf6", enabled: selectedAssets.btc },
    meta: { name: "META Stock", color: "#1d4ed8", enabled: selectedAssets.meta },
    gold: { name: "Gold", color: "#d97706", enabled: selectedAssets.gold },
    oil: { name: "Oil (WTI)", color: "#dc2626", enabled: selectedAssets.oil }
  };

  const handleAssetToggle = (asset: keyof SelectedAssets): void => {
    setSelectedAssets(prev => ({
      ...prev,
      [asset]: !prev[asset]
    }));
  };

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-sm max-w-xs">
          <p className="font-semibold text-gray-800 mb-2">{`Year: ${label}`}</p>
          <p className="text-xs text-gray-500 mb-2">Change since {baseYear}:</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="mb-1">
              <span className="font-medium">{entry.name}:</span> {entry.value?.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate latest statistics for summary cards
  const latestStats = useMemo(() => {
    const latestData = chartData[chartData.length - 1];
    if (!latestData) return {
      gdp: 0,
      cpi: 0,
      btc: 0,
      meta: 0,
      gold: 0,
      oil: 0
    };
    
    return {
      gdp: latestData.gdpChange,
      cpi: latestData.cpiChange,
      btc: latestData.btcChange,
      meta: latestData.metaChange,
      gold: latestData.goldChange,
      oil: latestData.oilChange
    };
  }, [chartData]);

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="text-center lg:text-left mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Economic Indicators & Assets: Change Since Base Year
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto lg:mx-0">
            Compare cumulative percentage changes across economic indicators and investment assets
          </p>
        </div>
        
        <div className="flex flex-col gap-4 mb-4">
          {/* Base Year and Data Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center lg:justify-start gap-4">
            <div className="flex items-center justify-center sm:justify-start">
              <label className="text-sm sm:text-base font-medium text-gray-700 mr-3">
                Base Year:
              </label>
              <select
                value={baseYear}
                onChange={(e) => setBaseYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base min-w-[80px] bg-white"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setShowDataTable(!showDataTable)}
              className="px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base font-medium"
            >
              {showDataTable ? "Hide" : "Show"} Data
            </button>
          </div>

          {/* Asset Selection */}
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">Select Additional Assets:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              <div className="col-span-2 sm:col-span-1 flex items-center text-xs sm:text-sm text-gray-600 font-medium">
                Always shown:
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: assetConfig.gdp.color }}></div>
                <span className="text-xs sm:text-sm text-gray-600">GDP</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: assetConfig.cpi.color }}></div>
                <span className="text-xs sm:text-sm text-gray-600">CPI</span>
              </div>
              
              {Object.entries(selectedAssets).map(([asset, isSelected]) => (
                <label key={asset} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleAssetToggle(asset as keyof SelectedAssets)}
                    className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: assetConfig[asset].color }}></div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">
                    {assetConfig[asset].name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: height }} className="mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ 
              top: 20, 
              right: window.innerWidth < 640 ? 20 : window.innerWidth < 1024 ? 40 : 80, 
              left: window.innerWidth < 640 ? 20 : 40, 
              bottom: window.innerWidth < 640 ? 40 : 60 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" opacity={0.6} />
            <XAxis 
              dataKey="year" 
              stroke="#374151"
              fontSize={window.innerWidth < 640 ? 10 : 12}
              fontWeight="500"
            />
            <YAxis 
              stroke="#374151"
              fontSize={window.innerWidth < 640 ? 10 : 12}
              fontWeight="500"
              width={window.innerWidth < 640 ? 40 : 60}
              label={{ 
                value: `% Change since ${baseYear}`, 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: window.innerWidth < 640 ? '10px' : '12px' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            {/* Reference line at 0% */}
            <Line
              type="monotone"
              dataKey={() => 0}
              stroke="#9ca3af"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              name="Base Year (0%)"
              legendType="none"
            />
            
            {/* Always show GDP and CPI */}
            <Line
              type="monotone"
              dataKey="gdpChange"
              stroke={assetConfig.gdp.color}
              strokeWidth={3}
              dot={{ fill: assetConfig.gdp.color, strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: assetConfig.gdp.color, strokeWidth: 2 }}
              name={assetConfig.gdp.name}
            />
            
            <Line
              type="monotone"
              dataKey="cpiChange"
              stroke={assetConfig.cpi.color}
              strokeWidth={3}
              dot={{ fill: assetConfig.cpi.color, strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: assetConfig.cpi.color, strokeWidth: 2 }}
              name={assetConfig.cpi.name}
            />
            
            {/* Conditionally render selected assets */}
            {selectedAssets.btc && (
              <Line
                type="monotone"
                dataKey="btcChange"
                stroke={assetConfig.btc.color}
                strokeWidth={3}
                dot={{ fill: assetConfig.btc.color, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: assetConfig.btc.color, strokeWidth: 2 }}
                name={assetConfig.btc.name}
              />
            )}
            
            {selectedAssets.meta && (
              <Line
                type="monotone"
                dataKey="metaChange"
                stroke={assetConfig.meta.color}
                strokeWidth={3}
                dot={{ fill: assetConfig.meta.color, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: assetConfig.meta.color, strokeWidth: 2 }}
                name={assetConfig.meta.name}
              />
            )}
            
            {selectedAssets.gold && (
              <Line
                type="monotone"
                dataKey="goldChange"
                stroke={assetConfig.gold.color}
                strokeWidth={3}
                dot={{ fill: assetConfig.gold.color, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: assetConfig.gold.color, strokeWidth: 2 }}
                name={assetConfig.gold.name}
              />
            )}
            
            {selectedAssets.oil && (
              <Line
                type="monotone"
                dataKey="oilChange"
                stroke={assetConfig.oil.color}
                strokeWidth={3}
                dot={{ fill: assetConfig.oil.color, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: assetConfig.oil.color, strokeWidth: 2 }}
                name={assetConfig.oil.name}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {showDataTable && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700">Year</th>
                  <th className="px-2 sm:px-4 py-3 text-right font-semibold text-green-700">GDP (%)</th>
                  <th className="px-2 sm:px-4 py-3 text-right font-semibold text-amber-700">CPI (%)</th>
                  {selectedAssets.btc && <th className="px-2 sm:px-4 py-3 text-right font-semibold text-purple-700">BTC (%)</th>}
                  {selectedAssets.meta && <th className="px-2 sm:px-4 py-3 text-right font-semibold text-blue-700">META (%)</th>}
                  {selectedAssets.gold && <th className="px-2 sm:px-4 py-3 text-right font-semibold text-orange-700">Gold (%)</th>}
                  {selectedAssets.oil && <th className="px-2 sm:px-4 py-3 text-right font-semibold text-red-700">Oil (%)</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {chartData.map((row, index) => (
                  <tr key={row.year} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-2 sm:px-4 py-3 font-medium text-gray-800">
                      {row.year}
                      {parseInt(row.year) === baseYear && (
                        <span className="ml-1 sm:ml-2 px-1 sm:px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Base
                        </span>
                      )}
                    </td>
                    <td className={`px-2 sm:px-4 py-3 text-right font-mono ${row.gdpChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {row.gdpChange >= 0 ? '+' : ''}{row.gdpChange.toFixed(1)}%
                    </td>
                    <td className={`px-2 sm:px-4 py-3 text-right font-mono ${row.cpiChange >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                      {row.cpiChange >= 0 ? '+' : ''}{row.cpiChange.toFixed(1)}%
                    </td>
                    {selectedAssets.btc && (
                      <td className={`px-2 sm:px-4 py-3 text-right font-mono ${row.btcChange >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                        {row.btcChange >= 0 ? '+' : ''}{row.btcChange.toFixed(1)}%
                      </td>
                    )}
                    {selectedAssets.meta && (
                      <td className={`px-2 sm:px-4 py-3 text-right font-mono ${row.metaChange >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {row.metaChange >= 0 ? '+' : ''}{row.metaChange.toFixed(1)}%
                      </td>
                    )}
                    {selectedAssets.gold && (
                      <td className={`px-2 sm:px-4 py-3 text-right font-mono ${row.goldChange >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
                        {row.goldChange >= 0 ? '+' : ''}{row.goldChange.toFixed(1)}%
                      </td>
                    )}
                    {selectedAssets.oil && (
                      <td className={`px-2 sm:px-4 py-3 text-right font-mono ${row.oilChange >= 0 ? 'text-red-600' : 'text-red-600'}`}>
                        {row.oilChange >= 0 ? '+' : ''}{row.oilChange.toFixed(1)}%
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dynamic Summary Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {/* Always show GDP and CPI */}
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700 text-sm sm:text-base">GDP Since {baseYear}</h3>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${latestStats.gdp >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {latestStats.gdp >= 0 ? '+' : ''}{latestStats.gdp?.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Total change to 2025</p>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700 text-sm sm:text-base">CPI Since {baseYear}</h3>
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${latestStats.cpi >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
            {latestStats.cpi >= 0 ? '+' : ''}{latestStats.cpi?.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Total inflation to 2025</p>
        </div>

        {/* Show selected assets */}
        {selectedAssets.btc && (
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Bitcoin Since {baseYear}</h3>
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${latestStats.btc >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
              {latestStats.btc >= 0 ? '+' : ''}{latestStats.btc?.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Total change to 2025</p>
          </div>
        )}

        {selectedAssets.meta && (
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">META Since {baseYear}</h3>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${latestStats.meta >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {latestStats.meta >= 0 ? '+' : ''}{latestStats.meta?.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Total change to 2025</p>
          </div>
        )}

        {selectedAssets.gold && (
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Gold Since {baseYear}</h3>
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${latestStats.gold >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
              {latestStats.gold >= 0 ? '+' : ''}{latestStats.gold?.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Total change to 2025</p>
          </div>
        )}

        {selectedAssets.oil && (
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Oil Since {baseYear}</h3>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${latestStats.oil >= 0 ? 'text-red-600' : 'text-red-600'}`}>
              {latestStats.oil >= 0 ? '+' : ''}{latestStats.oil?.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Total change to 2025</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs sm:text-sm text-gray-500 space-y-1">
        <p>• All percentage changes calculated relative to {baseYear} base year values</p>
        <p>• GDP and CPI data: Statistics Canada estimates</p>
        <p>• Asset prices: Bitcoin (CoinMarketCap), META stock, Gold ($/oz), Oil (WTI $/barrel)</p>
        <p>• Base year values: GDP ${rawData.find(d => d.year === baseYear)?.gdp}B CAD, CPI {rawData.find(d => d.year === baseYear)?.cpi}, 
           {selectedAssets.btc && ` BTC $${rawData.find(d => d.year === baseYear)?.btc?.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
           {selectedAssets.meta && ` META $${rawData.find(d => d.year === baseYear)?.meta}`}
           {selectedAssets.gold && ` Gold $${rawData.find(d => d.year === baseYear)?.gold}/oz`}
           {selectedAssets.oil && ` Oil $${rawData.find(d => d.year === baseYear)?.oil}/bbl`}
        </p>
      </div>
    </div>
  );
};

export default CanadaEconomyChart;