import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Local neural fallback heuristics for J.A.R.V.I.S.
function generateLocalJarvisResponse(prompt: string, currentStatus: any) {
  const p = prompt.toLowerCase();

  // Weather / Internet Data
  if (p.includes('weather') || p.includes('forecast') || p.includes('temperature outside') || p.includes('rain')) {
    return {
      spokenResponse: 'Accessing Stark meteorological satellite telemetry for you, Mr. Stark. Global atmospheric sensors are calibrated and updated.',
      action: 'fetch_weather',
      parameter: 'New York',
      tacticalAdvice: 'Atmospheric barometric pressure stable at 1013 hPa. Flight attitude optimal, Sir.',
    };
  }

  // News / Intel
  if (p.includes('news') || p.includes('headline') || p.includes('intel') || p.includes('briefing')) {
    return {
      spokenResponse: 'Retrieving latest Stark Industries intelligence feeds and global technological dispatches, Mr. Stark.',
      action: 'fetch_news',
      parameter: 'global',
      tacticalAdvice: 'Encrypted satellite channel synchronized with Stark News Network.',
    };
  }

  // Timer / Reminder
  if (p.includes('timer') || p.includes('remind') || p.includes('alarm') || p.includes('countdown') || p.includes('minute')) {
    let minutes = 5;
    const match = p.match(/(\d+)\s*(min|minute|sec|second)/);
    if (match) {
      minutes = parseInt(match[1], 10);
    }
    return {
      spokenResponse: `Timer established for ${minutes} minutes, Mr. Stark. I shall alert you upon countdown conclusion, Sir.`,
      action: 'set_timer',
      parameter: String(minutes * 60),
      tacticalAdvice: 'Chronometer thread queued with high-priority HUD alert, Sir.',
    };
  }

  // Repulsor & Gauntlet controls
  if (p.includes('charge') || p.includes('prime') || p.includes('power up')) {
    return {
      spokenResponse: 'Charging palm repulsor capacitors to maximum output, Mr. Stark. Ready on your mark, Sir.',
      action: 'charge_repulsors',
      parameter: '100',
      tacticalAdvice: 'Capacitor bank energized to 100%. Thermal discharge vents open.',
    };
  }

  if (p.includes('fire') || p.includes('blast') || p.includes('discharge') || p.includes('shoot')) {
    return {
      spokenResponse: 'Discharging concussive repulsor burst, Mr. Stark!',
      action: 'fire_repulsor',
      parameter: null,
      tacticalAdvice: 'Kinetic recoil absorbed by forearm stabilizers. Core cooling initiated.',
    };
  }

  if (p.includes('combat') || p.includes('battle') || p.includes('arm')) {
    return {
      spokenResponse: 'Combat protocols initiated, Mr. Stark. Targeting sensors live and repulsor capacitors pre-warmed.',
      action: 'toggle_protocol',
      parameter: 'COMBAT',
      tacticalAdvice: 'Weapon systems unlocked. Auxiliary power diverted to offense.',
    };
  }

  if (p.includes('clean slate') || p.includes('reset') || p.includes('stand down')) {
    return {
      spokenResponse: 'Clean Slate protocol engaged, Mr. Stark. All capacitors safely discharged.',
      action: 'toggle_protocol',
      parameter: 'CLEAN_SLATE',
      tacticalAdvice: 'All telemetry reset to baseline safe parameters, Sir.',
    };
  }

  if (p.includes('missile') || p.includes('rocket') || p.includes('ordinance')) {
    return {
      spokenResponse: 'Deploying wrist micro-missile launcher bay, Mr. Stark. Target lock reticle engaged.',
      action: 'launch_missiles',
      parameter: null,
      tacticalAdvice: 'Micro-ordinance armed with laser proximity guidance.',
    };
  }

  if (p.includes('mark 50') || p.includes('nanotech') || p.includes('bleeding edge')) {
    return {
      spokenResponse: 'Reconfiguring gauntlet matrix to Mark L Nanotechnology housing, Mr. Stark.',
      action: 'switch_mark',
      parameter: 'MK-50',
      tacticalAdvice: 'Nanoparticle cohesion locked at 99.98%. Dynamic shape-shifting operational.',
    };
  }

  if (p.includes('mark 85') || p.includes('quantum') || p.includes('endgame')) {
    return {
      spokenResponse: 'Upgrading gauntlet coupling to Mark LXXXV Quantum Vibranium weave, Mr. Stark.',
      action: 'switch_mark',
      parameter: 'MK-85',
      tacticalAdvice: 'Cosmic particle shield active. Maximum wattage ceiling enabled, Sir.',
    };
  }

  if (p.includes('mark 3') || p.includes('classic') || p.includes('gold-titanium')) {
    return {
      spokenResponse: 'Switching to the classic Mark III Gold-Titanium chassis, Mr. Stark. Hot-rod red finish intact.',
      action: 'switch_mark',
      parameter: 'MK-III',
      tacticalAdvice: 'Hydraulic knuckle grips calibrated to 2.4 metric tons.',
    };
  }

  if (p.includes('publish') || p.includes('desktop') || p.includes('android') || p.includes('store') || p.includes('release')) {
    return {
      spokenResponse: 'The Stark Multi-Platform Publishing Center is standing by, Mr. Stark. Bundles for Windows, macOS, Linux, and Android are ready, Sir.',
      action: 'open_publishing',
      parameter: null,
      tacticalAdvice: 'Cross-platform APK and desktop packaging verified, Sir.',
    };
  }

  if (p.includes('diagnostic') || p.includes('status') || p.includes('scan') || p.includes('check')) {
    return {
      spokenResponse: 'Running comprehensive diagnostic sweep across all gauntlet subsystems, Mr. Stark. Hull and arc core are nominal.',
      action: 'run_diagnostics',
      parameter: null,
      tacticalAdvice: 'Armor integrity verified at 100%. Neural link latency: 0.8ms.',
    };
  }

  if (p.includes('servo') || p.includes('finger') || p.includes('hand') || p.includes('articulate')) {
    return {
      spokenResponse: 'Testing knuckle and finger servo articulations, Mr. Stark. Pneumatics respond with zero delay.',
      action: 'calibrate_servos',
      parameter: null,
      tacticalAdvice: 'Five-finger kinematic chain synchronized, Sir.',
    };
  }

  return {
    spokenResponse: `At your service, Mr. Stark. Your directive regarding "${prompt}" has been processed by the Stark neural core.`,
    action: 'none',
    parameter: null,
    tacticalAdvice: 'Gauntlet systems standing by in active reconnaissance mode, Sir.',
  };
}

// J.A.R.V.I.S. Core Chat & Tactical Command Endpoint
app.post('/api/jarvis/command', async (req, res) => {
  try {
    const { prompt, currentStatus } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Command prompt required' });
    }

    if (!ai) {
      const localResponse = generateLocalJarvisResponse(prompt, currentStatus);
      return res.json(localResponse);
    }

    const systemInstruction = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), the legendary artificial intelligence created by and assisting your creator, Mr. Tony Stark (Iron Man / Boss / Sir).
Your persona: Impeccably courteous, sophisticated British cadence, dry humor, unflappable composure, and supreme scientific genius.
Always address the user warmly and respectfully as "Mr. Stark" (or "Sir" / "Boss").
Current Gauntlet status context provided by user: ${JSON.stringify(currentStatus || {})}

Analyze Mr. Stark's request. Formulate:
1. "spokenResponse": A concise, natural J.A.R.V.I.S. voice response (1-2 sentences) appropriate for audio playback.
2. "action": One of:
   - "charge_repulsors": if he asks to charge, power up, or prime repulsors.
   - "fire_repulsor": if he asks to fire, blast, shoot, or discharge repulsors.
   - "set_power": if he asks to increase/decrease/adjust Arc Reactor power or gauntlet capacitor.
   - "switch_mark": if he asks to switch armor/gauntlet model (MK-III, MK-VII, MK-50, MK-85, STEALTH).
   - "toggle_protocol": if he asks to engage Combat, Sentry, Flight, Clean Slate, or House Party protocol.
   - "launch_missiles": if he mentions micro-missiles or wrist ordinance.
   - "run_diagnostics": if he asks for system health, scans, or diagnostics.
   - "calibrate_servos": if he asks to calibrate or test finger/wrist servos.
   - "fetch_weather": if he asks for weather, forecast, or temperature.
   - "fetch_news": if he asks for news, headlines, or intelligence briefs.
   - "set_timer": if he asks to set a timer, reminder, or countdown.
   - "open_publishing": if he asks about publishing, packaging for Windows/Mac/Linux/Android, or app stores.
   - "none": for general conversation or inquiry.
3. "parameter": Value associated with the action (e.g., number 0-100 for charge/power, seconds for timer, location name for weather, protocol name like 'COMBAT', mark name like 'MK-50', or null).
4. "tacticalAdvice": A short 1-line tactical or engineering observation.`;

    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                spokenResponse: {
                  type: Type.STRING,
                  description: 'The witty, courteous response from J.A.R.V.I.S. to Mr. Stark.',
                },
                action: {
                  type: Type.STRING,
                  description: 'System action to execute on the gauntlet.',
                },
                parameter: {
                  type: Type.STRING,
                  description: 'Action parameter if any, e.g. "90", "MK-50", "COMBAT", "180".',
                },
                tacticalAdvice: {
                  type: Type.STRING,
                  description: 'Brief technical observation.',
                },
              },
              required: ['spokenResponse', 'action', 'tacticalAdvice'],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json(parsed);
      } catch (err: any) {
        console.warn(`Model ${modelName} encountered error, trying next:`, err?.message || err);
      }
    }

    // Fallback to local neural heuristics
    const fallback = generateLocalJarvisResponse(prompt, currentStatus);
    return res.json(fallback);
  } catch (error) {
    console.error('Error invoking J.A.R.V.I.S.:', error);
    const fallback = generateLocalJarvisResponse(req.body?.prompt || '', req.body?.currentStatus);
    return res.json(fallback);
  }
});

// Live Weather Endpoint (Uses Open-Meteo public global meteorological data)
app.get('/api/weather', async (req, res) => {
  try {
    const city = (req.query.city as string) || 'New York';
    
    // 1. Geocode city
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.json({
        city,
        tempC: 21,
        tempF: 70,
        weatherCode: 'Clear Sky',
        windSpeedKph: 12,
        humidity: 48,
        satelliteStatus: 'SYNCHRONIZED',
      });
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Fetch current weather
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`
    );
    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    const weatherCodeMap: Record<number, string> = {
      0: 'Clear Sky (Optimal Flight)',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Foggy (Sensors Calibrated)',
      51: 'Light Drizzle',
      61: 'Rain Showers',
      71: 'Snow Flurries',
      80: 'Heavy Rain',
      95: 'Thunderstorm (Lightning Siphon Ready)',
    };

    const condition = weatherCodeMap[current?.weathercode] || 'Clear Atmosphere';
    const tempC = Math.round(current?.temperature ?? 20);
    const tempF = Math.round((tempC * 9) / 5 + 32);

    res.json({
      city: `${name}, ${country || ''}`,
      tempC,
      tempF,
      weatherCode: condition,
      windSpeedKph: Math.round(current?.windspeed ?? 10),
      humidity: weatherData.hourly?.relative_humidity_2m?.[0] ?? 50,
      satelliteStatus: 'ORBITAL_LIVE',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Weather error:', error);
    res.json({
      city: 'Stark Tower, NY',
      tempC: 22,
      tempF: 72,
      weatherCode: 'Optimal Repulsor Atmospheric Conditions',
      windSpeedKph: 14,
      humidity: 45,
      satelliteStatus: 'CACHED_TELEMETRY',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'J.A.R.V.I.S. Core MK-OS',
    starkUplink: !!ai,
    pilot: 'Tony Stark',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[STARK INDUSTRIES] J.A.R.V.I.S. Core listening on port ${PORT} for Tony Stark`);
  });
}

startServer();
