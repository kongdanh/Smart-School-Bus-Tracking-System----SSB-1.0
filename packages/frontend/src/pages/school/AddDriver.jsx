import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import schoolService from '../../services/schoolService';
import { toast } from 'react-toastify';
import '../../styles/school-styles/school-add-form.css';

const AddDriver = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        maTX: '',
        hoTen: '',
        soDienThoai: '',
        email: '',
        bienSoXe: '',
        giayPhep: '',
        status: 'active'
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.maTX || !formData.hoTen || !formData.soDienThoai) {
            toast.warning('Vui lòng nhập mã tài xế, tên và số điện thoại');
            return;
        }

        try {
            setLoading(true);
            const response = await schoolService.createDriver(formData);
            if (response.success) {
                toast.success('Thêm tài xế thành công');
                navigate('/school/drivers');
            } else {
                toast.error(response.message || 'Lỗi khi thêm tài xế');
            }
        } catch (error) {
            console.error('Error creating driver:', error);
            toast.error('Lỗi khi thêm tài xế');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-form-container">
            <div className="form-header">
                <button className="btn-back" onClick={() => navigate('/school/drivers')}>
                    ← Quay lại
                </button>
                <h1>Thêm Tài Xế Mới</h1>
            </div>

            <div className="form-card">
                <div className="form-section">
                    <h2>Thông Tin Cơ Bản</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Mã Tài Xế *</label>
                            <input
                                type="text"
                                placeholder="VD: TX001"
                                value={formData.maTX}
                                onChange={e => handleChange('maTX', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tên Tài Xế *</label>
                            <input
                                type="text"
                                placeholder="VD: Nguyễn Văn A"
                                value={formData.hoTen}
                                onChange={e => handleChange('hoTen', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Số Điện Thoại *</label>
                            <input
                                type="tel"
                                placeholder="VD: 0901234567"
                                value={formData.soDienThoai}
                                onChange={e => handleChange('soDienThoai', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="VD: driver@example.com"
                                value={formData.email}
                                onChange={e => handleChange('email', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Thông Tin Xe</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Biển Số Xe</label>
                            <input
                                type="text"
                                placeholder="VD: 29A-123456"
                                value={formData.bienSoXe}
                                onChange={e => handleChange('bienSoXe', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Giấy Phép Lái Xe</label>
                            <input
                                type="text"
                                placeholder="VD: 123456789"
                                value={formData.giayPhep}
                                onChange={e => handleChange('giayPhep', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Trạng Thái</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Trạng Thái</label>
                            <select
                                value={formData.status}
                                onChange={e => handleChange('status', e.target.value)}
                            >
                                <option value="active">Đang hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-footer">
                <button className="btn-cancel" onClick={() => navigate('/school/drivers')} disabled={loading}>
                    Hủy
                </button>
                <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Thêm Tài Xế'}
                </button>
            </div>
        </div>
    );
};

export default AddDriver;
