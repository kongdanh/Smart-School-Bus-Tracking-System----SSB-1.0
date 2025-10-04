import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MapPlaceholder from "../components/MapPlaceholder";

export default function DriverDashboard() {
    return (
        <div className="flex h-screen">
            <Sidebar role="driver" />
            <div className="flex-1 flex flex-col">
                <Navbar title="Dashboard Tài xế" />
                <div className="flex-1 p-4">
                    <MapPlaceholder />
                </div>
            </div>
        </div>
    );
}
