import React, { useState, useRef, useEffect } from 'react';
import { Send, Map, BarChart3, Settings, Menu, X, Download, Filter, Info, Moon, Sun } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Plot from 'react-plotly.js';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';


const Floatchat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content:
        "Hello! I'm Floatchat, your AI assistant for exploring ARGO oceanographic data. You can ask me about temperature profiles, salinity data, BGC parameters, or any ocean-related queries. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  const [mapData] = useState({
    floats: [
      { id: 'F001', lat: 20.5, lon: 65.8, temp: 28.5, salinity: 36.2, status: 'active' },
      { id: 'F002', lat: 15.2, lon: 68.9, temp: 29.1, salinity: 35.8, status: 'active' },
      { id: 'F003', lat: 12.8, lon: 72.1, temp: 30.2, salinity: 35.4, status: 'inactive' },
    ],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      let response = "I understand you're looking for oceanographic data. ";
      const lowerInput = inputValue.toLowerCase();

      if (lowerInput.includes('salinity')) {
        response =
          'I found salinity data in the Arabian Sea region. Average values range from 35.4 to 36.2 PSU. Would you like to see the spatial distribution or temporal trends?';
      } else if (lowerInput.includes('temperature')) {
        response =
          'Temperature profiles show interesting patterns. Surface temperatures around 28-30°C. I can generate depth-temperature profiles if you want.';
      } else if (lowerInput.includes('float')) {
        response =
          'I found 3 active ARGO floats in your region. F001 and F002 transmitting data, F003 inactive. Want to see their map locations?';
      } else {
        response +=
          'Please specify what oceanographic data interests you, like temperature, salinity, dissolved oxygen, chlorophyll, or BGC parameters.';
      }

      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const OceanWavesLogo = ({ size = 32, className = '' }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64" className="drop-shadow-lg">
        <circle
          cx="32"
          cy="32"
          r="30"
          fill={darkMode ? 'url(#oceanGradientDark)' : 'url(#oceanGradient)'}
          stroke={darkMode ? '#3b82f6' : '#1e40af'}
          strokeWidth="2"
        />
        <path d="M8 32 Q16 28, 24 32 T40 32 T56 32" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.9" />
        <path d="M8 38 Q16 34, 24 38 T40 38 T56 38" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M8 26 Q16 22, 24 26 T40 26 T56 26" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.6" />
        <defs>
          <radialGradient id="oceanGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </radialGradient>
          <radialGradient id="oceanGradientDark" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#5b21b6" />
            <stop offset="100%" stopColor="#3730a3" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );

  const exampleQueries = [
    'Show me salinity profiles near the equator in March 2023',
    'Compare BGC parameters in the Arabian Sea for the last 6 months',
    'What are the nearest ARGO floats to coordinates 20°N, 65°E?',
    'Display temperature anomalies in the Indian Ocean',
  ];

  // Map Component
  const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  iconSize: [25, 41],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

  const MapView = () => (
    <MapContainer center={[20, 67]} zoom={5} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {mapData.floats.map((float) => (
        <Marker key={float.id} position={[float.lat, float.lon]}>
          <Popup>
            <b>Float ID:</b> {float.id}
            <br />
            <b>Temp:</b> {float.temp} °C
            <br />
            <b>Salinity:</b> {float.salinity} PSU
            <br />
            <b>Status:</b> {float.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );

  // Chart Component for Temperature Profile
  const TemperatureChart = () => {
    const depth = [0, 50, 100, 200, 500, 1000];
    const temperature = [28, 24, 20, 15, 10, 5];

    return (
      <Plot
        data={[
          {
            x: temperature,
            y: depth,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
            name: 'Temperature',
          },
        ]}
        layout={{
          title: 'Temperature Profile',
          xaxis: { title: 'Temperature (°C)' },
          yaxis: { title: 'Depth (m)', autorange: 'reversed' },
          margin: { t: 30 },
        }}
        style={{ width: '100%', height: '400px' }}
      />
    );
  };

  // Charts View
  const ChartsView = () => (
    <div className={`h-full p-6 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Temperature Profile
          </h3>
          <TemperatureChart />
          <div className={`mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div>Surface: 29.2°C</div>
            <div>1000m: 12.4°C</div>
            <div>Thermocline depth: ~200m</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div
        className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-blue-900 text-white'} transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="p-4 flex items-center gap-3">
          <OceanWavesLogo size={32} />
          {sidebarOpen && <h1 className="text-xl font-bold">Floatchat</h1>}
        </div>

        <nav className="mt-8">
          <button
            onClick={() => setActiveView('chat')}
            title="Chat with AI about oceanographic data"
            className={`w-full flex items-center gap-3 px-4 py-3 hover:${
              darkMode ? 'bg-gray-700' : 'bg-blue-800'
            } transition-colors ${
              activeView === 'chat'
                ? `${darkMode ? 'bg-gray-700 border-r-2 border-blue-400' : 'bg-blue-800 border-r-2 border-blue-300'}`
                : ''
            }`}
          >
            <Send className="w-5 h-5" />
            {sidebarOpen && <span>Chat</span>}
          </button>

          <button
            onClick={() => setActiveView('map')}
            title="View ARGO float locations on interactive map"
            className={`w-full flex items-center gap-3 px-4 py-3 hover:${
              darkMode ? 'bg-gray-700' : 'bg-blue-800'
            } transition-colors ${
              activeView === 'map'
                ? `${darkMode ? 'bg-gray-700 border-r-2 border-blue-400' : 'bg-blue-800 border-r-2 border-blue-300'}`
                : ''
            }`}
          >
            <Map className="w-5 h-5" />
            {sidebarOpen && <span>Map View</span>}
          </button>

          <button
            onClick={() => setActiveView('charts')}
            title="Analyze oceanographic data with interactive charts"
            className={`w-full flex items-center gap-3 px-4 py-3 hover:${
              darkMode ? 'bg-gray-700' : 'bg-blue-800'
            } transition-colors ${
              activeView === 'charts'
                ? `${darkMode ? 'bg-gray-700 border-r-2 border-blue-400' : 'bg-blue-800 border-r-2 border-blue-300'}`
                : ''
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            {sidebarOpen && <span>Analytics</span>}
          </button>

          
        </nav>

        <div className="absolute bottom-16 left-4 right-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:${
              darkMode ? 'bg-gray-700' : 'bg-blue-800'
            } rounded transition-colors`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {sidebarOpen && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={`${sidebarOpen ? 'Collapse' : 'Expand'} sidebar`}
          className={`absolute bottom-4 left-4 p-2 hover:${
            darkMode ? 'bg-gray-700' : 'bg-blue-800'
          } rounded transition-colors`}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className={`border-b transition-colors ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } p-4`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}
              >
                {activeView === 'chat'
                  ? 'Float-chat'
                  : activeView === 'map'
                  ? 'ARGO Float Map'
                  : 'Data Analytics'}
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {activeView === 'chat'
                  ? 'Ask questions about oceanographic data'
                  : activeView === 'map'
                  ? 'Real-time float positions and status'
                  : 'Visualize and analyze ocean data'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                title="Download current data or export results"
                className={`p-2 hover:${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                } rounded-lg transition-colors`}
              >
                <Download
                  className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                />
              </button>
              <button
                title="Filter and search oceanographic data"
                className={`p-2 hover:${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                } rounded-lg transition-colors`}
              >
                <Filter
                  className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                />
              </button>
              <button
                title="Help and information about Floatchat"
                className={`p-2 hover:${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                } rounded-lg transition-colors`}
              >
                <Info
                  className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeView === 'chat' && (
            <div className="flex flex-col h-full">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-2xl p-4 rounded-lg ${
                        message.type === 'user'
                          ? `${
                              darkMode
                                ? 'bg-blue-700 text-white'
                                : 'bg-blue-600 text-white'
                            }`
                          : `${
                              darkMode
                                ? 'bg-gray-800 border border-gray-700 text-gray-200'
                                : 'bg-white border border-gray-200 text-gray-800'
                            }`
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div
                        className={`text-xs mt-2 ${
                          message.type === 'user'
                            ? `${
                                darkMode ? 'text-blue-200' : 'text-blue-100'
                              }`
                            : `${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Example Queries */}
              {messages.length === 1 && (
                <div
                  className={`px-4 py-2 border-t transition-colors ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Try asking:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exampleQueries.slice(0, 2).map((query, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(query)}
                        className={`text-xs px-3 py-1 rounded-full transition-colors ${
                          darkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div
                className={`border-t p-4 transition-colors ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about oceanographic data, ARGO floats, or any ocean-related query..."
                      className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        darkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400'
                          : 'border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      rows="1"
                      style={{ minHeight: '44px' }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    title="Send your question to Float-chat AI"
                    className={`px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 ${
                      darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'map' && <MapView />}
          {activeView === 'charts' && <ChartsView />}
        </div>
      </div>
    </div>
  );
};

export default Floatchat;
