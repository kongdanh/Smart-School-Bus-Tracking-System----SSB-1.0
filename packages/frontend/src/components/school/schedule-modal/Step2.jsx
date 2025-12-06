import React from 'react';
import { User, Bus, Users } from 'lucide-react';

const Step2 = ({ formData, handleInputChange, drivers, buses, selectedBus, selectedDriver }) => (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Chọn Tài Xế</label>
            <select
                name="taiXeId"
                value={formData.taiXeId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
            >
                <option value="">-- Chọn tài xế --</option>
                {Array.isArray(drivers) && drivers.map(d => (
                    <option key={d.taiXeId || d.id || Math.random()} value={d.taiXeId || d.id}>
                        {d.hoTen} - {d.soDienThoai} ({d.trangThai})
                    </option>
                ))}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Chọn Xe Buýt</label>
            <select
                name="xeBuytId"
                value={formData.xeBuytId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
            >
                <option value="">-- Chọn xe --</option>
                {Array.isArray(buses) && buses.map(b => (
                    <option key={b.xeBuytId || b.id || Math.random()} value={b.xeBuytId || b.id}>
                        {b.bienSo || b.bienSoXe} - {b.sucChua || b.soGhe} chỗ ({b.trangThai})
                    </option>
                ))}
            </select>
        </div>

        {selectedBus && (
            <div className="p-4 bg-gray-800 border border-gray-700 rounded">
                <h4 className="font-medium text-gray-200 mb-2">Thông tin vận hành</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span>Tài xế: <strong>{selectedDriver?.hoTen || 'Chưa chọn'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Bus size={16} className="text-gray-400" />
                        <span>Xe: <strong>{selectedBus.bienSo || selectedBus.bienSoXe}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span>Sức chứa: <strong>{selectedBus.sucChua || selectedBus.soGhe}</strong> học sinh</span>
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default Step2;
