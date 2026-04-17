import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

let leafletIconsFixed = false;
function fixDefaultIconsOnce() {
  if (leafletIconsFixed) return;
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
  leafletIconsFixed = true;
}

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points?.length) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    const b = L.latLngBounds(points);
    map.fitBounds(b, { padding: [48, 48], maxZoom: 14 });
  }, [map, points]);
  return null;
}

const OSM = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};

/**
 * Interactive map: optional user GPS + store pins.
 * Always uses light OSM tiles so the map stays readable on dark app theme.
 */
export default function StoreMapView({ user, stores }) {
  useEffect(() => {
    fixDefaultIconsOnce();
  }, []);

  const storeMarkers = useMemo(
    () => (stores || []).filter((s) => s.lat != null && s.lng != null),
    [stores],
  );

  const allPoints = useMemo(() => {
    const pts = [];
    if (user?.lat != null && user?.lng != null) pts.push([user.lat, user.lng]);
    storeMarkers.forEach((s) => pts.push([s.lat, s.lng]));
    return pts;
  }, [user, storeMarkers]);

  const center = allPoints[0] || [17.4065, 78.4772];

  if (allPoints.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center bg-slate-100 px-4 text-center text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-400">
        Location data will appear here after detection (enable GPS or use default routing).
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom
      className="store-map-light z-0 h-64 w-full rounded-b-2xl"
      style={{ minHeight: 256 }}
    >
      <TileLayer attribution={OSM.attribution} url={OSM.url} />
      <FitBounds points={allPoints} />
      {user?.lat != null && user?.lng != null && (
        <Marker position={[user.lat, user.lng]}>
          <Popup>
            <span className="font-semibold">Your location</span>
            <br />
            <span className="text-xs text-slate-600">Used for store distances</span>
          </Popup>
        </Marker>
      )}
      {storeMarkers.map((s) => (
        <Marker key={s.name} position={[s.lat, s.lng]}>
          <Popup>
            <span className="font-semibold">{s.name}</span>
            <br />
            <span className="text-xs">{s.address}</span>
            <br />
            <span className="text-xs text-farm-700">{s.distance}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
