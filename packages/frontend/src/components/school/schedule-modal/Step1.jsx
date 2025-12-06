import React from 'react';
import { MapPin } from 'lucide-react';

const Step1 = ({ formData, handleInputChange, routes, initialData, selectedRoute }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Mã Lịch Trình</label>
                <input
                    type="text"
                    name="maLich"
                    value={formData.maLich}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: SCH-001"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ngày Bắt Đầu</label>
                <input
                    type="date"
                    name="ngay"
                    value={formData.ngay}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Giờ Khởi Hành</label>
                <input
                    type="time"
                    name="gioKhoiHanh"
                    value={formData.gioKhoiHanh}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Giờ Kết Thúc</label>
                <input
                    type="time"
                    name="gioKetThuc"
                    value={formData.gioKetThuc}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Chọn Tuyến Đường</label>
            <select
                name="tuyenDuongId"
                value={formData.tuyenDuongId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
            >
                <option value="">-- Chọn tuyến đường --</option>
                {Array.isArray(routes) && routes.map(r => {
                    const startStop = r.tuyenduong_diemdung?.[0]?.diemdung?.tenDiemDung || 'N/A';
                    const endStop = r.tuyenduong_diemdung?.[r.tuyenduong_diemdung.length - 1]?.diemdung?.tenDiemDung || 'N/A';
                    return (
                        <option key={r.tuyenDuongId || r.id || Math.random()} value={r.tuyenDuongId || r.id}>
                            {r.tenTuyen} ({startStop} - {endStop})
                        </option>
                    );
                })}
            </select>
            {selectedRoute && (
                <div className="mt-2 p-3 bg-blue-900/30 border border-blue-800 rounded text-sm text-blue-300">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} />
                        <span>Tuyến này có <strong>{selectedRoute.tuyenduong_diemdung?.length || selectedRoute.diemDung?.length || 0}</strong> điểm dừng.</span>
                    </div>
                    {(selectedRoute.tuyenduong_diemdung?.length > 0 || selectedRoute.diemDung?.length > 0) && (
                        <div className="text-xs text-blue-200 space-y-1">
                            <div className="font-semibold">Các điểm dừng:</div>
                            {(selectedRoute.tuyenduong_diemdung || selectedRoute.diemDung || []).map((stop, idx) => (
                                <div key={idx} className="ml-2">• {stop.diemdung?.tenDiemDung || stop.tenDiemDung || 'Điểm dừng ' + (idx + 1)}</div>
                            ))}
                        </div>
                    )}
                    {(!selectedRoute.tuyenduong_diemdung?.length && !selectedRoute.diemDung?.length) && (
                        <span className="text-red-400 font-bold">⚠️ Cảnh báo: Tuyến chưa có điểm dừng!</span>
                    )}
                </div>
            )}
        </div>

        {!initialData && (
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Lặp Lại</label>
                <div className="flex gap-4 text-gray-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="recurring"
                            value="none"
                            checked={formData.recurring === 'none'}
                            onChange={handleInputChange}
                            className="bg-gray-700 border-gray-600"
                        />
                        <span>Không lặp lại</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="recurring"
                            value="week"
                            checked={formData.recurring === 'week'}
                            onChange={handleInputChange}
                            className="bg-gray-700 border-gray-600"
                        />
                        <span>Hàng ngày (1 tuần)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="recurring"
                            value="month"
                            checked={formData.recurring === 'month'}
                            onChange={handleInputChange}
                            className="bg-gray-700 border-gray-600"
                        />
                        <span>Hàng ngày (1 tháng)</span>
                    </label>
                </div>
            </div>
        )}
    </div>
);

export default Step1;
