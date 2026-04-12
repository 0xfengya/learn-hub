"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";

// Generate realistic mock BTC price data
function generatePriceData(days: number, basePrice: number) {
  const data = [];
  let price = basePrice * 0.85;
  const now = Date.now();
  const interval = (days * 24 * 60 * 60 * 1000) / 60;

  for (let i = 60; i >= 0; i--) {
    const change = (Math.random() - 0.47) * price * 0.025;
    price = Math.max(price + change, basePrice * 0.5);
    const date = new Date(now - i * interval);
    data.push({
      time: days <= 1 ? date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) :
            days <= 7 ? date.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" }) :
            date.toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
      price: Math.round(price),
      volume: Math.round(Math.random() * 5e9 + 1e9),
    });
  }
  return data;
}

const RANGES = [
  { label: "1H", days: 0.042 },
  { label: "24J", days: 1 },
  { label: "7H", days: 7 },
  { label: "30H", days: 30 },
];

const MOCK_BTC_USD = 83420;
const MOCK_BTC_IDR = MOCK_BTC_USD * 16250;

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}
function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function LivePrice() {
  const [range, setRange] = useState(RANGES[1]);
  const [data, setData] = useState(() => generatePriceData(1, MOCK_BTC_USD));
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const change24h = 2.34;
  const isPositive = change24h >= 0;

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setData(generatePriceData(range.days, MOCK_BTC_USD));
      setLastUpdated(new Date());
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    setData(generatePriceData(range.days, MOCK_BTC_USD));
  }, [range]);

  // Auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(refresh, 30000);
    return () => clearInterval(id);
  }, [range]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-base-100 border border-base-300 rounded-xl p-3 shadow-xl text-sm">
          <div className="font-bold text-warning">{formatUSD(payload[0].value)}</div>
          <div className="text-base-content/60 text-xs">{formatIDR(payload[0].value * 16250)}</div>
          <div className="text-base-content/40 text-xs mt-1">{payload[0].payload.time}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="harga" className="py-24 px-4 sm:px-6 bg-base-200/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge badge-warning mb-4">📊 Live Data</div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Harga Bitcoin Real-Time
          </h2>
          <p className="text-base-content/60 flex items-center justify-center gap-2 text-sm">
            <AlertCircle size={14} />
            Data simulasi untuk demo — integrasikan dengan CoinGecko API untuk data nyata
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Harga (USD)", value: formatUSD(MOCK_BTC_USD), highlight: true },
            { label: "Harga (IDR)", value: formatIDR(MOCK_BTC_IDR) },
            { label: "Market Cap", value: "$1.64T" },
            { label: "Volume 24J", value: "$28.4B" },
          ].map((s) => (
            <div
              key={s.label}
              className={`card p-4 rounded-2xl border ${
                s.highlight
                  ? "bg-warning/10 border-warning/30"
                  : "bg-base-100 border-base-300"
              }`}
            >
              <div className="text-xs text-base-content/50 mb-1 font-medium uppercase tracking-wide">
                {s.label}
              </div>
              <div
                className={`font-black text-lg sm:text-xl ${
                  s.highlight ? "text-warning" : ""
                }`}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Chart card */}
        <div className="card bg-base-100 border border-base-300 rounded-2xl p-4 sm:p-6 shadow-sm">
          {/* Chart header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-2xl font-black">{formatUSD(MOCK_BTC_USD)}</div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    isPositive ? "text-success" : "text-error"
                  }`}
                >
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {isPositive ? "+" : ""}
                  {change24h}% (24J)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Range selector */}
              <div className="join">
                {RANGES.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setRange(r)}
                    className={`join-item btn btn-sm ${
                      range.label === r.label ? "btn-warning" : "btn-ghost"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <button
                onClick={refresh}
                className={`btn btn-ghost btn-sm ${loading ? "loading" : ""}`}
                title="Refresh"
              >
                {!loading && <RefreshCw size={14} />}
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F7931A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F7931A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.05} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                  domain={["auto", "auto"]}
                  width={45}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#F7931A"
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#F7931A", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-base-content/30 text-right mt-2">
            Terakhir diperbarui: {lastUpdated.toLocaleTimeString("id-ID")}
          </div>
        </div>
      </div>
    </section>
  );
}
