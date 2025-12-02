import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import schoolService from '../../services/schoolService';
import { toast } from 'react-toastify';
import '../../styles/school-styles/school-add-form.css';

const AddStudent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [classes] = useState([
        '9A', '9B', '9C', '9D', '9E',
        '10A', '10B', '10C', '10D', '10E',
        '11A', '11B', '11C', '11D', '11E',
        '12A', '12B', '12C', '12D', '12E'
    ]);
    const [formData, setFormData] = useState({
        maHS: '',
        hoTen: '',
        lop: '',
        soDienThoaiPH: '',
        phuHuynh: '',
        diemDon: '',
        diemTra: ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.maHS || !formData.hoTen || !formData.lop) {
            toast.warning('Vui lòng nhập mã học sinh, tên và lớp');
            return;
        }

        try {
            setLoading(true);
            const response = await schoolService.createStudent(formData);
            if (response.success) {
                toast.success('Thêm học sinh thành công');
                navigate('/school/students');
            } else {
                toast.error(response.message || 'Lỗi khi thêm học sinh');
            }
        } catch (error) {
            console.error('Error creating student:', error);
            toast.error('Lỗi khi thêm học sinh');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-form-container">
            <div className="form-header">
                <button className="btn-back" onClick={() => navigate('/school/students')}>
                    ← Quay lại
                </button>
                <h1>Thêm Học Sinh Mới</h1>
            </div>

            <div className="form-card">
                <div className="form-section">
                    <h2>Thông Tin Cơ Bản</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Mã Học Sinh *</label>
                            <input
                                type="text"
                                placeholder="VD: HS001"
                                value={formData.maHS}
                                onChange={e => handleChange('maHS', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tên Học Sinh *</label>
                            <input
                                type="text"
                                placeholder="VD: Nguyễn Văn A"
                                value={formData.hoTen}
                                onChange={e => handleChange('hoTen', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Lớp *</label>
                            <select
                                value={formData.lop}
                                onChange={e => handleChange('lop', e.target.value)}
                            >
                                <option value="">-- Chọn lớp --</option>
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Thông Tin Phụ Huynh</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên Phụ Huynh</label>
                            <input
                                type="text"
                                placeholder="VD: Nguyễn Thị B"
                                value={formData.phuHuynh}
                                onChange={e => handleChange('phuHuynh', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Số Điện Thoại</label>
                            <input
                                type="tel"
                                placeholder="VD: 0901234567"
                                value={formData.soDienThoaiPH}
                                onChange={e => handleChange('soDienThoaiPH', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Điểm Dừng</h2>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Điểm Đón</label>
                            <input
                                type="text"
                                placeholder="VD: Nhà bạn An"
                                value={formData.diemDon}
                                onChange={e => handleChange('diemDon', e.target.value)}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Điểm Trả</label>
                            <input
                                type="text"
                                placeholder="VD: Trường THPT ABC"
                                value={formData.diemTra}
                                onChange={e => handleChange('diemTra', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-footer">
                <button className="btn-cancel" onClick={() => navigate('/school/students')} disabled={loading}>
                    Hủy
                </button>
                <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Thêm Học Sinh'}
                </button>
            </div>
        </div>
    );
};

export default AddStudent;
