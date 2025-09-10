import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon not loading in React-Leaflet
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  iconSize: [25, 41],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ floats }) => (
  <MapContainer center={[20, 67]} zoom={5} style={{ height: '100%', width: '100%' }}>
    <TileLayer 
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
      attribution="&copy; OpenStreetMap contributors" 
    />
    {floats.map((float) => (
      <Marker key={float.id} position={[float.lat, float.lon]}>
        <Popup>
          <div>
            <b>Float ID:</b> {float.id}<br/>
            <b>Temp:</b> {float.temp} °C<br/>
            <b>Salinity:</b> {float.salinity} PSU<br/>
            <b>Status:</b> {float.status}
          </div>
        </Popup>
      </Marker>
    ))}
  </MapContainer>
);

export default MapView;
