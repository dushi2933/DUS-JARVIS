import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Globe, 
  Wind, 
  Droplets, 
  Thermometer, 
  Search, 
  RefreshCw, 
  Radio, 
  Rss, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface WeatherData {
  city: string;
  tempC: number;
  tempF: number;
  weatherCode: string;
  windSpeedKph: number;
  humidity: number;
  satelliteStatus: string;
}

export const StarkWorldDataHub: React.FC = () => {
  const [cityQuery, setCityQuery] = useState('New York');
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData>({
    city: 'New York, US',
    tempC: 22,
    tempF: 72,
    weatherCode: 'Optimal Repulsor Atmospheric Flight Conditions',
    windSpeedKph: 14,
    humidity: 46,
    satelliteStatus: 'ORBITAL_LIVE',
  });

  const [worldTimes, setWorldTimes] = useState({
    newYork: '',
    london: '',
    tokyo: '',
    malibu: '',
  });

  // Ticking World Clocks
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setWorldTimes({
        newYork: now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        london: now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        tokyo: now.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        malibu: now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live weather
  const fetchWeather = async (targetCity: string) => {
    setIsLoadingWeather(true);
    soundFx.playHudBeep('subtle');
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(targetCity)}`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchWeather('New York');
  }, []);

  const newsDispatches = [
    {
      id: 'news-1',
      tag: 'STARK R&D',
      title: 'Vibranium-Infused Micro-Capacitor Enters Mass Prototype Validation',
      summary: 'Stark Industries Advanced Weapons division confirms 40% reduction in repulsor thermal bleed across Mark series hardware.',
      timestamp: '12m ago',
    },
    {
      id: 'news-2',
      tag: 'ORBITAL INTEL',
      title: 'Stark Telecom Satellites Establish Quantum Key Encryption Relay',
      summary: 'Low-latency telemetry uplink activated for all authorized J.A.R.V.I.S. neural terminals worldwide.',
      timestamp: '48m ago',
    },
    {
      id: 'news-3',
      tag: 'GLOBAL DEFENSE',
      title: 'Atmospheric Clean Flight Corridor Opened for Civilian Exosuits',
      summary: 'Flight attitude stabilization algorithms approved under United Nations Stark Accords.',
      timestamp: '2h ago',
    },
    {
      id: 'news-4',
      tag: 'NANOTECH',
      title: 'Bleeding Edge Nanoparticle Cohesion Reaches 99.98% Efficiency',
      summary: 'Morphing energy shields withstand multi-gigawatt continuous thermal plasma discharges.',
      timestamp: '5h ago',
    },
  ];

  return (
    <div className="bg-gray-900/60 border border-cyan-500/20 rounded-xl p-4 flex flex-col backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-center glow-arc-blue">
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-tech text-sm font-bold tracking-wider text-cyan-200">
              STARK SATELLITE & GLOBAL DATA HUB
            </h3>
            <p className="text-[11px] text-gray-400 font-sans">
              Real-Time Atmospheric Meteorological Feeds & Technological Intelligence for Miss Lisara
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono-tech text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SATELLITE UPLINK LIVE</span>
        </div>
      </div>

      {/* Grid: Weather Telemetry & World Clocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 mb-6">
        {/* Left 7 cols: Live Weather Retrieval */}
        <div className="lg:col-span-7 bg-gray-950/60 p-4 rounded-xl border border-cyan-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span className="font-tech text-xs font-bold text-gray-200 uppercase">
                Atmospheric Meteorological Telemetry
              </span>
            </div>

            {/* City Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (cityQuery.trim()) fetchWeather(cityQuery.trim());
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                placeholder="Enter city (e.g. London)..."
                className="bg-gray-900 border border-gray-700 rounded px-2.5 py-1 text-xs text-cyan-100 font-mono-tech focus:outline-none focus:border-cyan-400 w-36 sm:w-44"
              />
              <button
                type="submit"
                disabled={isLoadingWeather}
                className="p-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-bold transition-all cursor-pointer"
                title="Search City Telemetry"
              >
                {isLoadingWeather ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>

          {/* Current Weather Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Temperature Big Readout */}
            <div className="bg-gray-900/80 p-3.5 rounded-lg border border-gray-800">
              <div className="text-[11px] font-mono-tech text-cyan-400 flex items-center justify-between mb-1">
                <span>LOCATION: {weatherData.city}</span>
                <span className="text-gray-500">{weatherData.satelliteStatus}</span>
              </div>
              <div className="flex items-baseline gap-2 my-1">
                <span className="text-3xl font-bold font-tech text-white">
                  {weatherData.tempC}°C
                </span>
                <span className="text-base text-gray-400 font-mono-tech">
                  / {weatherData.tempF}°F
                </span>
              </div>
              <div className="text-xs text-amber-300 font-sans mt-1">
                {weatherData.weatherCode}
              </div>
            </div>

            {/* Atmospheric Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
              <div className="bg-gray-900/80 p-2.5 rounded-lg border border-gray-800">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1 text-[10px]">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  <span>WIND SPEED</span>
                </div>
                <div className="font-bold text-gray-200">
                  {weatherData.windSpeedKph} km/h
                </div>
              </div>

              <div className="bg-gray-900/80 p-2.5 rounded-lg border border-gray-800">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1 text-[10px]">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>HUMIDITY</span>
                </div>
                <div className="font-bold text-gray-200">
                  {weatherData.humidity}%
                </div>
              </div>

              <div className="col-span-2 bg-gray-900/80 p-2.5 rounded-lg border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>GAUNTLET FLIGHT CLEARANCE:</span>
                </div>
                <span className="font-bold text-emerald-300 text-xs font-tech">
                  AUTHORIZED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Stark World Clocks */}
        <div className="lg:col-span-5 bg-gray-950/60 p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2 mb-3">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-tech text-xs font-bold text-gray-200 uppercase">
              Global Stark Orbital Chronometers
            </span>
          </div>

          <div className="space-y-2">
            {[
              { location: 'New York (Stark Tower)', time: worldTimes.newYork, sub: 'EDT / HQ' },
              { location: 'London (British Hub)', time: worldTimes.london, sub: 'BST / J.A.R.V.I.S. Core' },
              { location: 'Point Dume Malibu', time: worldTimes.malibu, sub: 'PDT / Stark Workshop' },
              { location: 'Tokyo (Asia Pacific)', time: worldTimes.tokyo, sub: 'JST / Tech Relays' },
            ].map((clock, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-900/60 border border-gray-800/80 text-xs"
              >
                <div>
                  <div className="font-tech font-bold text-gray-200">{clock.location}</div>
                  <div className="text-[10px] text-gray-500 font-mono-tech">{clock.sub}</div>
                </div>
                <div className="font-mono-tech font-bold text-cyan-300 tracking-wider">
                  {clock.time || '12:00:00'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stark Intelligence & Technology Newsfeed */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Rss className="w-4 h-4 text-amber-400" />
            <span className="font-tech text-xs font-bold text-amber-300 uppercase tracking-wider">
              Stark News Network (SNN) & Technology Dispatches
            </span>
          </div>
          <span className="text-[10px] font-mono-tech text-gray-400">
            ENCRYPTED SATELLITE DISPATCHES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {newsDispatches.map((news) => (
            <div
              key={news.id}
              className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 hover:border-cyan-500/30 transition-all text-xs"
            >
              <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono-tech">
                <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-bold">
                  {news.tag}
                </span>
                <span className="text-gray-500">{news.timestamp}</span>
              </div>
              <h4 className="font-tech font-bold text-sm text-slate-100 mb-1 leading-snug">
                {news.title}
              </h4>
              <p className="text-gray-400 font-sans leading-relaxed text-[11px]">
                {news.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
