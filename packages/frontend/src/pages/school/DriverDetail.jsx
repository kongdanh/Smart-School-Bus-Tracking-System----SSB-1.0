import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import schoolService from '../../services/schoolService';
import { toast } from 'react-toastify';
import '../../styles/school-styles/school-driver-detail.css';

const DriverDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        if (id) {
            fetchDriver();
        }
    }, [id]);

    const fetchDriver = async () => {
        try {
            setLoading(true);
            const response = await schoolService.getDriverById(id);
            if (response.success) {
                setDriver(response.data);
                setEditData(response.data);
            } else {
                toast.error(response.message || 'Không thể tải thông tin tài xế');
                navigate('/school/drivers');
            }
        } catch (error) {
            console.error('Error fetching driver:', error);
            toast.error('Lỗi khi tải thông tin tài xế');
            navigate('/school/drivers');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await schoolService.updateDriver(id, editData);
            if (response.success) {
                setDriver(response.data);
                setIsEditing(false);
                toast.success('Cập nhật thông tin tài xế thành công');
            } else {
                toast.error(response.message || 'Lỗi khi cập nhật');
            }
        } catch (error) {
            console.error('Error updating driver:', error);
            toast.error('Lỗi khi cập nhật thông tin tài xế');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditData(driver);
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading && !driver) {
        return <div className="loading">Đang tải...</div>;
    }

    if (!driver) {
        return <div className="error">Không tìm thấy tài xế</div>;
    }

    return (
        <div className="driver-detail-container">
            <div className="detail-header">
                <button className="btn-back" onClick={() => navigate('/school/drivers')}>
                    ← Quay lại
                </button>
                <h1>Chi Tiết Tài Xế</h1>
                {!isEditing && (
                    <button className="btn-edit" onClick={handleEdit}>
                        ✎ Chỉnh Sửa
                    </button>
                )}
            </div>

            <div className="detail-content">
                <div className="detail-card">
                    <div className="card-header">
                        <h2>Thông Tin Cơ Bản</h2>
                    </div>

                    <div className="card-body">
                        <div className="detail-grid">
                            {/* Tên */}
                            <div className="detail-item">
                                <label>Tên Tài Xế</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.hoTen || ''}
                                        onChange={e => handleChange('hoTen', e.target.value)}
                                    />
                                ) : (
                                    <span className="value">{driver.hoTen || 'N/A'}</span>
                                )}
                            </div>

                            {/* Mã Tài Xế */}
                            <div className="detail-item">
                                <label>Mã Tài Xế</label>
                                <span className="value">{driver.maTx || 'N/A'}</span>
                            </div>

                            {/* Số Điện Thoại */}
                            <div className="detail-item">
                                <label>Số Điện Thoại</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editData.soDienThoai || ''}
                                        onChange={e => handleChange('soDienThoai', e.target.value)}
                                    />
                                ) : (
                                    <span className="value">{driver.soDienThoai || 'N/A'}</span>
                                )}
                            </div>

                            {/* Email */}
                            <div className="detail-item">
                                <label>Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editData.email || ''}
                                        onChange={e => handleChange('email', e.target.value)}
                                    />
                                ) : (
                                    <span className="value">{driver.email || 'N/A'}</span>
                                )}
                            </div>

                            {/* Địa Chỉ */}
                            <div className="detail-item full-width">
                                <label>Địa Chỉ</label>
                                {isEditing ? (
                                    <textarea
                                        value={editData.diaChi || ''}
                                        onChange={e => handleChange('diaChi', e.target.value)}
                                        rows={3}
                                    />
                                ) : (
                                    <span className="value">{driver.diaChi || 'N/A'}</span>
                                )}
                            </div>

                            {/* Số CMND */}
                            <div className="detail-item">
                                <label>Số CMND/CCCD</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.soCMND || ''}
                                        onChange={e => handleChange('soCMND', e.target.value)}
                                    />
                                ) : (
                                    <span className="value">{driver.soCMND || 'N/A'}</span>
                                )}
                            </div>

                            {/* Bằng Lái Xe */}
                            <div className="detail-item">
                                <label>Số Bằng Lái Xe</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.bangLaiXe || ''}
                                        onChange={e => handleChange('bangLaiXe', e.target.value)}
                                    />
                                ) : (
                                    <span className="value">{driver.bangLaiXe || 'N/A'}</span>
                                )}
                            </div>

                            {/* Hạn Bằng Lái */}
                            <div className="detail-item">
                                <label>Hạn Bằng Lái</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={editData.hanBangLai || ''}
                                        onChange={e => handleChange('hanBangLai', e.target.value)}
                                    />
                                ) : (
                                    <span className="value">{driver.hanBangLai || 'N/A'}</span>
                                )}
                            </div>

                            {/* Trạng Thái */}
                            <div className="detail-item">
                                <label>Trạng Thái</label>
                                {isEditing ? (
                                    <select
                                        value={editData.trangThai || 'active'}
                                        onChange={e => handleChange('trangThai', e.target.value)}
                                    >
                                        <option value="active">Đang hoạt động</option>
                                        <option value="inactive">Không hoạt động</option>
                                        <option value="leave">Đang nghỉ</option>
                                    </select>
                                ) : (
                                    <span className={`status-badge ${driver.trangThai?.toLowerCase() || 'active'}`}>
                                        {driver.trangThai || 'Đang hoạt động'}
                                    </span>
                                )}
                            </div>

                            {/* Ngày Vào Làm */}
                            <div className="detail-item">
                                <label>Ngày Vào Làm</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={editData.ngayVaoLam || ''}
                                        onChange={e => handleChange('ngayVaoLam', e.target.value)}
                                    />
                                ) : (
                                    <span className="value">{driver.ngayVaoLam || 'N/A'}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thông Tin Xe */}
                {driver.xebuyt && (
                    <div className="detail-card">
                        <div className="card-header">
                            <h2>Thông Tin Xe Được Giao</h2>
                        </div>
                        <div className="card-body">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <label>Biển Số Xe</label>
                                    <span className="value">{driver.xebuyt.bienSoXe || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Số Ghế</label>
                                    <span className="value">{driver.xebuyt.soGhe || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Hãng Xe</label>
                                    <span className="value">{driver.xebuyt.hangXe || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Năm Sản Xuất</label>
                                    <span className="value">{driver.xebuyt.namSX || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Statistics */}
                <div className="detail-card">
                    <div className="card-header">
                        <h2>Thống Kê</h2>
                    </div>
                    <div className="card-body">
                        <div className="stats-grid">
                            <div className="stat-box">
                                <div className="stat-label">Chuyến Đi</div>
                                <div className="stat-value">{driver.totalTrips || 0}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-label">Học Sinh Phục Vụ</div>
                                <div className="stat-value">{driver.totalStudents || 0}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-label">Tuyến Đường</div>
                                <div className="stat-value">{driver.totalRoutes || 0}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-label">Đánh Giá</div>
                                <div className="stat-value">{driver.rating || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="detail-actions">
                    <button className="btn-cancel" onClick={handleCancel} disabled={loading}>
                        Hủy
                    </button>
                    <button className="btn-save" onClick={handleSave} disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DriverDetail;
