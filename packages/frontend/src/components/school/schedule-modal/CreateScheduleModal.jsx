import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const CreateScheduleModal = ({ isOpen, onClose, onSave, initialData, routes, drivers, buses, students }) => {
    if (!isOpen) return null;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        maLich: '',
        ngay: new Date().toISOString().split('T')[0],
        gioKhoiHanh: '06:30',
        gioKetThuc: '07:30',
        tuyenDuongId: '',
        xeBuytId: '',
        taiXeId: '',
        studentIds: [],
        recurring: 'none', // none, week, month
    });

    // Derived State
    const selectedRoute = Array.isArray(routes) ? routes.find(r => r.tuyenDuongId === parseInt(formData.tuyenDuongId)) : null;
    const selectedBus = Array.isArray(buses) ? buses.find(b => b.xeBuytId === parseInt(formData.xeBuytId)) : null;
    const selectedDriver = Array.isArray(drivers) ? drivers.find(d => d.taiXeId === parseInt(formData.taiXeId)) : null;

    // Filtered Students
    const [studentSearch, setStudentSearch] = useState('');

    const filteredStudents = (Array.isArray(students) ? students : []).filter(s =>
        (s.hoTen || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
        (s.maHS || '').toLowerCase().includes(studentSearch.toLowerCase())
    );

    // Initialize form data when modal opens or initialData changes
    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            // Populate form for editing - Fix data mapping
            setFormData({
                maLich: initialData.raw?.maLich || initialData.name || '',
                ngay: initialData.raw?.ngay ? new Date(initialData.raw.ngay).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                gioKhoiHanh: initialData.gioKhoiHanh || '06:30',
                gioKetThuc: initialData.gioKetThuc || '07:30',
                tuyenDuongId: (initialData.tuyenDuong?.tuyenDuongId || initialData.raw?.tuyenDuongId || '').toString(),
                xeBuytId: (initialData.xeBuyt?.xeBuytId || initialData.raw?.xeBuytId || '').toString(),
                taiXeId: (initialData.taiXe?.taiXeId || initialData.raw?.taiXeId || '').toString(),
                studentIds: initialData.students?.map(s => s.hocSinhId || s.id) || [],
                recurring: 'none'
            });
        } else {
            // Reset for new
            setFormData({
                maLich: `SCH-${Date.now().toString().slice(-6)}`,
                ngay: new Date().toISOString().split('T')[0],
                gioKhoiHanh: '06:30',
                gioKetThuc: '07:30',
                tuyenDuongId: '',
                xeBuytId: '',
                taiXeId: '',
                studentIds: [],
                recurring: 'none'
            });
        }
    }, [isOpen, initialData]);

    // Reset step when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleStudent = (id) => {
        setFormData(prev => {
            const exists = prev.studentIds.includes(id);
            if (exists) {
                return { ...prev, studentIds: prev.studentIds.filter(sid => sid !== id) };
            } else {
                // Check capacity
                const capacity = selectedBus?.sucChua || selectedBus?.soGhe || 0;
                if (selectedBus && prev.studentIds.length >= capacity) {
                    toast.warning(`Xe đã đầy (${capacity} chỗ)!`);
                    return prev;
                }
                return { ...prev, studentIds: [...prev.studentIds, id] };
            }
        });
    };

    const generateDates = () => {
        const dates = [];
        const startDate = new Date(formData.ngay);
        let count = 1;

        if (formData.recurring === 'week') count = 7;
        if (formData.recurring === 'month') count = 30;

        for (let i = 0; i < count; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    };

    const handleSubmit = async () => {
        // Validation
        const capacity = selectedBus?.sucChua || selectedBus?.soGhe || 0;
        if (selectedBus && formData.studentIds.length > capacity) {
            toast.error(`Số lượng học sinh (${formData.studentIds.length}) vượt quá sức chứa của xe (${capacity})`);
            return;
        }

        try {
            setLoading(true);
            const dates = generateDates();

            const payload = {
                ...formData,
                dates: dates,
                // Ensure IDs are numbers
                tuyenDuongId: parseInt(formData.tuyenDuongId),
                xeBuytId: parseInt(formData.xeBuytId),
                taiXeId: parseInt(formData.taiXeId),
            };

            await onSave(payload, !!initialData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#1a1d21] border border-gray-700 rounded-lg shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col text-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50 rounded-t-lg">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Chỉnh Sửa Lịch Trình (Cập nhật)' : 'Tạo Lịch Trình Mới (Cập nhật)'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Steps Indicator */}
                <div className="flex border-b border-gray-700 bg-gray-800/30">
                    <button
                        className={`flex-1 p-3 text-sm font-medium text-center transition-colors ${step === 1 ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-900/10' : 'text-gray-500 hover:text-gray-300'}`}
                        onClick={() => setStep(1)}
                    >
                        1. Thông Tin Chung
                    </button>
                    <button
                        className={`flex-1 p-3 text-sm font-medium text-center transition-colors ${step === 2 ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-900/10' : 'text-gray-500 hover:text-gray-300'}`}
                        onClick={() => setStep(2)}
                    >
                        2. Tài Xế & Xe
                    </button>
                    <button
                        className={`flex-1 p-3 text-sm font-medium text-center transition-colors ${step === 3 ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-900/10' : 'text-gray-500 hover:text-gray-300'}`}
                        onClick={() => setStep(3)}
                    >
                        3. Phân Công Học Sinh
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 min-h-0 flex flex-col overflow-hidden">
                    {step === 1 && (
                        <div className="overflow-y-auto h-full pr-2 custom-scrollbar">
                            <Step1
                                formData={formData}
                                handleInputChange={handleInputChange}
                                routes={routes}
                                initialData={initialData}
                                selectedRoute={selectedRoute}
                            />
                        </div>
                    )}
                    {step === 2 && (
                        <div className="overflow-y-auto h-full pr-2 custom-scrollbar">
                            <Step2
                                formData={formData}
                                handleInputChange={handleInputChange}
                                drivers={drivers}
                                buses={buses}
                                selectedBus={selectedBus}
                                selectedDriver={selectedDriver}
                            />
                        </div>
                    )}
                    {step === 3 && (
                        <Step3
                            formData={formData}
                            studentSearch={studentSearch}
                            setStudentSearch={setStudentSearch}
                            filteredStudents={filteredStudents}
                            toggleStudent={toggleStudent}
                            selectedBus={selectedBus}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 flex justify-between items-center bg-gray-800/50 rounded-b-lg">
                    <button
                        onClick={() => setStep(prev => Math.max(1, prev - 1))}
                        className={`px-4 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors ${step === 1 ? 'invisible' : ''}`}
                    >
                        Quay Lại
                    </button>

                    <div className="flex gap-2">
                        {step < 3 ? (
                            <button
                                onClick={() => setStep(prev => Math.min(3, prev + 1))}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors font-medium"
                            >
                                Tiếp Tục
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 flex items-center gap-2 transition-colors font-medium shadow-lg shadow-green-900/20"
                            >
                                {loading ? 'Đang xử lý...' : (
                                    <>
                                        <CheckCircle size={18} />
                                        {initialData ? 'Cập Nhật' : 'Hoàn Tất'}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateScheduleModal;
