import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../style/ParentMap.css";
import busIconImg from "../assets/bus.svg";
import schoolIconImg from "../assets/school.svg";
import homeIconImg from "../assets/house.svg";
import L from "leaflet";


export default function ParentMap() {
    const [route, setRoute] = useState([]); // lưu tuyến đường

    // 📍 Tạo hai điểm mẫu: trường học và nhà học sinh, bus
    const school = [10.762622, 106.660172];
    const home = [10.776889, 106.700806];
    const busStop = [10.7685, 106.6825];


    // Icon cho map
    const busIcon = L.icon({
        iconUrl: busIconImg,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    const schoolIcon = L.icon({
        iconUrl: schoolIconImg,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    const homeIcon = L.icon({
        iconUrl: homeIconImg,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    // 🧭 Gọi API OSRM để lấy tuyến đường tự động
    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const res = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/` +
                    `${school[1]},${school[0]};` +
                    `${busStop[1]},${busStop[0]};` +
                    `${home[1]},${home[0]}?overview=full&geometries=geojson`
                );
                const data = await res.json();
                if (data.routes && data.routes.length > 0) {
                    const coords = data.routes[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]);
                    setRoute(coords);
                }
            } catch (err) {
                console.error("Lỗi khi tải tuyến đường:", err);
            }
        };

        fetchRoute();
    }, []);

    return (
        <div className="parent-container">
            <button className="back-btn" onClick={() => window.history.back()}>
                ← Quay lại
            </button>

            <div className="parent-header">
                <h1>📍 Theo dõi xe đưa đón</h1>
                <p>Bản đồ định vị xe bus theo thời gian thực</p>
            </div>

            <div className="parent-content">
                <div className="map-wrapper">
                    <MapContainer center={school} zoom={13} scrollWheelZoom style={{ height: "500px", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Marker trường học */}
                        <Marker position={school} icon={schoolIcon}>
                            <Popup>🏫 Trường học</Popup>
                        </Marker>

                        {/* Marker nhà học sinh */}
                        <Marker position={home} icon={homeIcon}>
                            <Popup>🏠 Nhà học sinh</Popup>
                        </Marker>

                        <Marker position={busStop} icon={busIcon}>
                            <Popup>🚌 Xe bus hiện tại</Popup>
                        </Marker>

                        {/* Vẽ tuyến đường nếu có */}
                        {route.length > 0 && (
                            <Polyline positions={route} pathOptions={{ color: "blue", weight: 5 }} />
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
