import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🎨 NATIVE HTML/CSS DROP-PIN ICON: Bypasses Leaflet image paths completely!
const htmlPinIcon = L.divIcon({
  className: 'native-html-pin',
  html: `
    <div style="
      position: relative;
      width: 30px;
      height: 30px;
      background-color: #ff385c;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      border: 2px solid #ffffff;
    ">
      <!-- Inner white dot core -->
      <div style="
        width: 10px;
        height: 10px;
        background-color: #ffffff;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  // Sets pin center offsets so it points precisely at the coordinate intersections
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -34]
});

export default function MapView({ listings, onSelectListing }) {
  const defaultCenter = [28.6139, 77.2090]; // New Delhi coordinates center

  return (
    <div style={{ height: '380px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #ebebeb', marginBottom: '35px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
      <MapContainer center={defaultCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Array.isArray(listings) && listings.map((listing) => {
          const lat = Number(listing.coordinates?.lat || listing.lat || 28.6139);
          const lng = Number(listing.coordinates?.lng || listing.lng || 77.2090);

          return (
            <Marker key={listing._id} position={[lat, lng]} icon={htmlPinIcon}>
              <Popup>
                <div 
                  style={{ fontFamily: 'sans-serif', padding: '5px', cursor: 'pointer' }} 
                  onClick={() => onSelectListing && onSelectListing(listing)}
                >
                  <strong style={{ color: '#ff385c', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                    {listing.title}
                  </strong>
                  <p style={{ margin: '0 0 6px 0', color: '#717171', fontSize: '12px' }}>📍 {listing.location}</p>
                  <strong style={{ color: '#222222' }}>\${listing.pricePerNight}</strong> <span style={{ color: '#717171', fontSize: '12px' }}>/ night</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
