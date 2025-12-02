import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import schoolService from '../../services/schoolService';
import { toast } from 'react-toastify';
import '../../styles/school-styles/school-add-form.css';

const EditBus = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        maBX: '',
        tenBX: '',
        bienSo: '',
        soChoNgoi: '',
        taiXe: '',
        soDienThoaiTaiXe: '',
        status: 'active'
    });

    useEffect(() => {
        const fetchBus = async () => {
            try {
                setLoading(true);
                const response = await schoolService.getBuses();
                if (response.success) {
                    const bus = response.data.find(b => b.id === parseInt(id));
                    if (bus) {
                        setFormData({
                            maBX: bus.maBX || '',
                            tenBX: bus.tenBX || '',
                            bienSo: bus.bienSo || '',
                            soChoNgoi: bus.soChoNgoi || '',
                            taiXe: bus.taiXe || '',
                            soDienThoaiTaiXe: bus.soDienThoaiTaiXe || '',
                            status: bus.status || 'active'
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching bus:', error);
                toast.error('Lỗi khi tải dữ liệu xe bus');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBus();
        }
    }, [id]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.maBX || !formData.bienSo || !formData.soChoNgoi) {
            toast.warning('Vui lòng nhập mã xe, biển số và số chỗ ngồi');
            return;
        }

        try {
            setLoading(true);
            const response = await schoolService.updateBus(id, formData);
            if (response.success) {
                toast.success('Cập nhật xe bus thành công');
                navigate('/school/buses');
            } else {
                toast.error(response.message || 'Lỗi khi cập nhật xe bus');
            }
        } catch (error) {
            console.error('Error updating bus:', error);
            toast.error('Lỗi khi cập nhật xe bus');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-form-container">
            <div className="form-header">
                <button className="btn-back" onClick={() => navigate('/school/buses')}>
                    ← Quay lại
                </button>
                <h1>Chỉnh Sửa Xe Bus</h1>
            </div>

            <div className="form-card">
                <div className="form-section">
                    <h2>Thông Tin Xe Bus</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Mã Xe Bus *</label>
                            <input
                                type="text"
                                placeholder="VD: BX001"
                                value={formData.maBX}
                                onChange={e => handleChange('maBX', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tên Xe Bus</label>
                            <input
                                type="text"
                                placeholder="VD: Bus Tuyến A"
                                value={formData.tenBX}
                                onChange={e => handleChange('tenBX', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Biển Số *</label>
                            <input
                                type="text"
                                placeholder="VD: 29A-123456"
                                value={formData.bienSo}
                                onChange={e => handleChange('bienSo', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Số Chỗ Ngồi *</label>
                            <input
                                type="number"
                                placeholder="VD: 45"
                                value={formData.soChoNgoi}
                                onChange={e => handleChange('soChoNgoi', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Thông Tin Tài Xế</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên Tài Xế</label>
                            <input
                                type="text"
                                placeholder="VD: Nguyễn Văn A"
                                value={formData.taiXe}
                                onChange={e => handleChange('taiXe', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Số Điện Thoại</label>
                            <input
                                type="tel"
                                placeholder="VD: 0901234567"
                                value={formData.soDienThoaiTaiXe}
                                onChange={e => handleChange('soDienThoaiTaiXe', e.target.value)}
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
                <button className="btn-cancel" onClick={() => navigate('/school/buses')} disabled={loading}>
                    Hủy
                </button>
                <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Cập Nhật Xe Bus'}
                </button>
            </div>
        </div>
    );
};

export default EditBus;
