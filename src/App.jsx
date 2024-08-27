import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Import vehicle icon
//import vehicleIcon from './assets/vehicle-icon.png'

function App() {
  const [positions, setPositions] = useState([]);
  useEffect(() => {
    // Simulating API call to fetch route data
    const fetchRouteData = async () => {
      // Replace this with actual API call
      const dummyData = [
        {
          latitude: 17.385044,
          longitude: 78.486671,
          timestamp: "2024-07-20T10:00:00Z",
        },
        {
          latitude: 17.385045,
          longitude: 78.486672,
          timestamp: "2024-07-20T10:00:05Z",
        },
        {
          latitude: 17.385046,
          longitude: 78.486673,
          timestamp: "2024-07-20T10:00:10Z",
        },
        // Add more dummy data points here
      ];
      setPositions(dummyData);
    };

    fetchRouteData();

//    Simulating real-time updates
  //   const interval = setInterval(() => {
  //     navigator.geolocation.getCurrentPosition(getPosition);
  //   }, 3000)

  //   return () => clearInterval(interval)
  }, []);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(getPosition);
  }, []);

  function getPosition(position) {
    console.log(position);
    const lat = position.coords.latitude;
     const accuracy=position.coords.accuracy
    const lon = position.coords.longitude;
    console.log(lat, lon);
    fetchAddress(lat, lon)
    setCurrentPosition({ latitude: lat, longitude: lon,accuracy:accuracy });
  }
  async function fetchAddress(lat, lon) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
      const data = await response.json()
      console.log(data);
      
      setAddress(data.display_name)
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }

  return (
    <div className="app">
      <h1>Vehicle Tracker</h1>
      {currentPosition && (
        <MapContainer
          center={[currentPosition.latitude, currentPosition.longitude]}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker
            position={[currentPosition.latitude, currentPosition.longitude]}
          >
            <Popup>
              <div className="popup-content">
                <h2>WIRELESS</h2>
                <p>
                  <strong>Jul 20, 07:09 AM</strong>
                </p>
                <p>{address}</p>
                <hr />
                <p>
                  <strong>Speed:</strong> 0.00 km/h
                </p>
                <p>
                  <strong>Total Distance:</strong> 834.89 km
                </p>
                <p>
                  <strong>Battery:</strong> 16%
                </p>
                <hr />
                <p>
                  <strong>Today Running:</strong> 00:00m
                </p>
                <p>
                  <strong>Today Stopped:</strong> 07:10m
                </p>
                <p>
                  <strong>Today Idle:</strong> 00:00m
                </p>
                <p>
                  <strong>Current Status:</strong> STOPPED
                </p>
                <p>
                  <strong>Max Speed Today:</strong> 00.00 km/h
                </p>
              </div>
            </Popup>
          </Marker>

          <Polyline
            positions={positions.map((pos) => [pos.latitude, pos.longitude])}
            color="blue"
          />
        </MapContainer>
      )}
    </div>
  );
}

export default App;
