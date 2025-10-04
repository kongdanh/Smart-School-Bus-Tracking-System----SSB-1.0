import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MapPlaceholder from "../components/MapPlaceholder";

export default function ParentDashboard() {
    return (
        <div className="flex h-screen">
            <Sidebar role="parent" />
            <div className="flex-1 flex flex-col">
                <Navbar title="Dashboard Phụ huynh" />
                <div className="flex-1 p-4">
                    <MapPlaceholder />
                </div>
            </div>
        </div>
    );
}
