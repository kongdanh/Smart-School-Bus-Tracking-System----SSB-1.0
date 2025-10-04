import { Link } from "react-router-dom";

export default function Sidebar({ role }: { role: string }) {
    const menus = {
        school: [
            { name: "Quản lý tuyến xe", path: "/school" },
            { name: "Quản lý học sinh", path: "/school" },
            { name: "Danh sách xe & tài xế", path: "/school" },
            { name: "Báo cáo - Thống kê", path: "/school" },
        ],
        parent: [
            { name: "Theo dõi xe của con", path: "/parent" },
            { name: "Thông báo", path: "/parent" },
        ],
        driver: [
            { name: "Lộ trình", path: "/driver" },
            { name: "Danh sách học sinh", path: "/driver" },
        ],
    };

    return (
        <div className="w-64 bg-gray-100 p-4 h-full shadow-md">
            <h2 className="text-lg font-bold mb-4 capitalize">{role} menu</h2>
            <ul className="space-y-2">
                {menus[role as keyof typeof menus]?.map((m) => (
                    <li key={m.name}>
                        <Link to={m.path} className="block p-2 hover:bg-gray-200 rounded">
                            {m.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
