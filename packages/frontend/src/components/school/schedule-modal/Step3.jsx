import React from 'react';
import { Search } from 'lucide-react';

const Step3 = ({ formData, studentSearch, setStudentSearch, filteredStudents, toggleStudent, selectedBus }) => {
    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="mb-4 flex justify-between items-center shrink-0">
                <div className="relative flex-1 mr-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm học sinh..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full pl-10 p-2 border border-gray-600 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="text-sm font-medium text-gray-300">
                    Đã chọn: <span className={formData.studentIds.length > (selectedBus?.sucChua || selectedBus?.soGhe || 0) ? 'text-red-400' : 'text-blue-400'}>
                        {formData.studentIds.length}
                    </span> / {selectedBus?.sucChua || selectedBus?.soGhe || 0}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto border border-gray-700 rounded bg-gray-800 custom-scrollbar">
                <table className="w-full text-sm text-left text-gray-300 relative">
                    <thead className="bg-gray-900 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="p-3 w-10 border-b border-gray-700 bg-gray-900">
                                <input type="checkbox" disabled className="bg-gray-700 border-gray-600 rounded" />
                            </th>
                            <th className="p-3 border-b border-gray-700 bg-gray-900">Học Sinh</th>
                            <th className="p-3 border-b border-gray-700 bg-gray-900">Lớp</th>
                            <th className="p-3 border-b border-gray-700 bg-gray-900">Địa Chỉ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => {
                                const studentId = student.hocSinhId || student.id;
                                const isSelected = formData.studentIds.includes(studentId);
                                return (
                                    <tr
                                        key={studentId}
                                        className={`hover:bg-gray-700 cursor-pointer transition-colors ${isSelected ? 'bg-blue-900/40 border-l-4 border-blue-500' : ''
                                            }`}
                                        onClick={() => toggleStudent(studentId)}
                                    >
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => { }}
                                                className="bg-gray-700 border-gray-600 rounded text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="p-3 font-medium text-white">
                                            {student.hoTen}
                                            {isSelected && <span className="ml-2 text-blue-400 text-xs">✓ Đã chọn</span>}
                                        </td>
                                        <td className="p-3 text-gray-400">{student.lop || 'N/A'}</td>
                                        <td className="p-3 text-gray-400 truncate max-w-xs">{student.diaChi || 'Chưa có địa chỉ'}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colspan="4" className="p-8 text-center text-gray-500">
                                    Không tìm thấy học sinh nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Step3;
