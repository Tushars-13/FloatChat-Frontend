import React from 'react';
import TemperatureChart from './TemperatureChart';

const ChartsView = () => (
  <div className="p-6 h-full overflow-auto bg-gray-50">
    <h2 className="text-xl font-bold mb-4">Oceanographic Data Analytics</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <TemperatureChart />
      </div>
      {/* Add more chart components here */}
    </div>
  </div>
);

export default ChartsView;
